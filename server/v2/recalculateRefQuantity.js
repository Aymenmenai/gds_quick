const { Op } = require("sequelize");
const db = require("../../models");

async function recalculateRefQuantity(refId) {
  const startDate = new Date("2024-12-30");
  const endDate = new Date();
  // console.log("dopjkosihjfdsoiuhfidu");

  const articles = await db.Article.findAll({
    where: { RefId: refId },
    include: [
      {
        model: db.Entree,
        required: false,
        include: [{ model: db.Fournisseur, required: false }],
      },
      { model: db.Ref, required: true },
    ],
  });

  const articleMap = {};
  const articleIds = [];

  for (const article of articles) {
    articleMap[article.id] = article;
    articleIds.push(article.id);
  }

  const sorties = await db.ArticleQuiSort.findAll({
    where: { ArticleId: { [Op.in]: articleIds } },
    include: [
      {
        model: db.Sortie,
        required: true,
        include: [{ model: db.Beneficiare, required: false }],
      },
    ],
  });

  const countages = await db.Countage.findAll({
    where: { RefId: refId },
    order: [["date", "ASC"]],
  });

  const grouped = (name, price) => `${name}::${price || 0}`;
  const initialMap = {};

  for (const article of articles) {
    const key = grouped(article.name, article.price || 0);
    if (!initialMap[key]) {
      initialMap[key] = {
        name: article.name,
        price: article.price || 0,
        quantity: 0,
      };
    }

    const d = article.Entree?.date ? new Date(article.Entree.date) : null;
    if (d && d < startDate) {
      initialMap[key].quantity += article.initial_quantity || 0;
    }
  }

  for (const sortie of sorties) {
    const d = new Date(sortie.Sortie.date);
    const article = articleMap[sortie.ArticleId];
    const key = grouped(article.name, article.price || 0);
    if (!initialMap[key]) {
      initialMap[key] = {
        name: article.name,
        price: article.price || 0,
        quantity: 0,
      };
    }

    if (d < startDate) {
      initialMap[key].quantity -= sortie.quantity || 0;
    }
  }

  const movements = [];

  for (const article of articles) {
    const d = article.Entree?.date ? new Date(article.Entree.date) : null;
    if (d >= startDate && d <= endDate) {
      movements.push({
        type: "entree",
        date: d,
        movement_quantity: article.initial_quantity,
        article: {
          name: article.name,
          price: article.price || null,
        },
      });
    }
  }

  for (const sortie of sorties) {
    const d = new Date(sortie.Sortie.date);
    if (d >= startDate && d <= endDate) {
      const article = articleMap[sortie.ArticleId];
      movements.push({
        type: "sortie",
        date: d,
        movement_quantity: -sortie.quantity,
        article: {
          name: article.name,
          price: article.price || null,
        },
      });
    }
  }

  for (const countage of countages) {
    const d = new Date(countage.date);
    if (d >= startDate && d <= endDate) {
      movements.push({
        type: "countage",
        date: d,
        quantity: countage.quantity,
        comment: countage.comment || "",
      });
    }
  }

  movements.sort((a, b) => new Date(a.date) - new Date(b.date));

  const runningMap = JSON.parse(JSON.stringify(initialMap));
  let runningTotal = Object.values(runningMap).reduce(
    (sum, a) => sum + a.quantity,
    0
  );

  for (const move of movements) {
    if (move.type === "entree" || move.type === "sortie") {
      const key = grouped(move.article.name, move.article.price || 0);
      if (!runningMap[key]) {
        runningMap[key] = {
          name: move.article.name,
          price: move.article.price || 0,
          quantity: 0,
        };
      }

      runningMap[key].quantity += move.movement_quantity;
      runningTotal += move.movement_quantity;
      move.stock_at_date = runningTotal;
    }

    if (move.type === "countage") {
      runningTotal = move.quantity;
      for (const k in runningMap) {
        runningMap[k].quantity = 0;
      }
      move.stock_at_date = runningTotal;
    }
  }

  // ✅ Use final stock_at_date as total
  const finalStock = Object.values(runningMap);
  const totalQuantity = finalStock.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // console.log(totalQuantity, "-----gooal");
  await db.Ref.update({ quantity: totalQuantity }, { where: { id: refId } });
}

module.exports = recalculateRefQuantity;
