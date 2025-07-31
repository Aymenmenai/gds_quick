const db = require("../../models");
const catchAsync = require("../utils/catchAsync");
const sendRes = require("../utils/sendRes");

const { Op } = require("sequelize");
exports.getRefStockTimeline = catchAsync(async (req, res, next) => {
  const refId = req.params.id;
  const { start, end } = req.body;

  const startDate = new Date(start);
  const endDate = new Date(end);

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

  const initialMap = {};
  const grouped = (name, price) => `${name}::${price}`;

  // ✅ Step 1: Build initial stock before startDate
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

  // Include zero quantity articles
  for (const article of articles) {
    const key = grouped(article.name, article.price || 0);
    if (!initialMap[key]) {
      initialMap[key] = {
        name: article.name,
        price: article.price || 0,
        quantity: 0,
      };
    }
  }

  const initialStock = Object.values(initialMap);

  // ✅ Step 2: Collect movements
  const movements = [];

  for (const article of articles) {
    const d = article.Entree?.date ? new Date(article.Entree.date) : null;
    if (d && d >= startDate && d <= endDate) {
      movements.push({
        type: "entree",
        date: d,
        movement_quantity: article.initial_quantity,
        bon_number: article.Entree?.number || null,
        fournisseur: article.Entree?.Fournisseur?.name || null,
        article: {
          name: article.name,
          price: article.price || null,
          ref: article.Ref.name,
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
        bon_number: sortie.Sortie?.number || null,
        beneficiaire: sortie.Sortie?.Beneficiare?.name || null,
        article: {
          name: article.name,
          price: article.price || null,
          ref: article.Ref.name,
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

  // ✅ Step 3: Calculate stock_at_date + start_quantity
  const runningMap = JSON.parse(JSON.stringify(initialMap));
  let runningTotal = Object.values(runningMap).reduce(
    (sum, a) => sum + a.quantity,
    0
  );
  let lastCountage = null;

  for (const move of movements) {
    move.start_quantity = runningTotal;

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
      lastCountage = move;
      runningTotal = move.quantity;
      move.stock_at_date = runningTotal;
    }
  }

  // ✅ Step 4: Final stock
  const finalStock = [];

  for (const [_, item] of Object.entries(runningMap)) {
    const result = {
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    };

    if (lastCountage) {
      const countedQty = lastCountage.quantity;
      const diff = countedQty - item.quantity;
      if (diff > 0) {
        result.extra_quantity = diff;
      }
    }

    finalStock.push(result);
  }

  // ✅ Step 5: Response
  sendRes(res, 200, {
    refId,
    from: startDate,
    to: endDate,
    initialStock,
    movements,
    finalStock,
  });

  next();
});
