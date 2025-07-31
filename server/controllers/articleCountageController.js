const { Op } = require("sequelize");
const db = require("../../models");
const catchAsync = require("../utils/catchAsync");
const Err = require("../utils/appError");
const sendRes = require("../utils/sendRes");
const recalculateRefQuantity = require("../v2/recalculateRefQuantity");
// const counage = require("../models/counage");

// UPDATE THE ARTICLE QUANTITYT
const update_article_quantity = async (ArticleId, date, quantity) => {
  try {
    // console.log(
    //   "🔧 [update_article_quantity] Started for ArticleId:",
    //   ArticleId
    // );
    // console.log("🕒 Countage Date:", date, "📦 Quantity:", quantity);

    // 1️⃣ Get the latest countage
    const last_countage = await db.ArticleCountage.findOne({
      where: { ArticleId },
      order: [["date", "DESC"]],
    });

    // console.log(
    //   "📋 Latest countage found:",
    //   last_countage?.date
    //   // new Date(date)
    // );

    // 2️⃣ Proceed if countage is newer or no previous countage
    if (!last_countage || date >= last_countage.date) {
      // console.log("✅ Proceeding with sortie check...");

      // 3️⃣ Fetch sorties after this countage date
      const sorties = await db.ArticleQuiSort.findAll({
        where: { ArticleId },
        include: [
          {
            model: db.Sortie,
            where: {
              date: { [Op.gt]: date },
            },
          },
        ],
      });

      // console.log("📦 Sorties after countage:", sorties.length);

      // 4️⃣ Calculate total quantity from sorties
      const quantity_sortant = sorties.reduce(
        (sum, record) => sum + (record.quantity || 0),
        0
      );

      // console.log(
      //   "➖ Total quantity sortant after countage:",
      //   quantity_sortant
      // );

      // 5️⃣ Calculate the new quantity
      const new_quantity = quantity - quantity_sortant;
      // console.log("🧮 New quantity to set:", new_quantity);

      // 6️⃣ Update the article
      await db.Article.update(
        { quantity: new_quantity },
        { where: { id: ArticleId } }
      );

      // console.log("✅ Article quantity updated successfully.");
    } else {
      console.log("⛔ Skipping update: countage is older than the latest one.");
    }
  } catch (err) {
    console.error("❌ Error in update_article_quantity:", err);
  }
};
// CREATION
exports.add_countage = async (req, res, next) => {
  try {
    const { comment, quantity, date, ArticleId } = req.body;

    // console.log("🆕 [add_countage] Request received with data:", req.body);

    // 1️⃣ Validate required fields
    if (!comment || !quantity || !date || !ArticleId) {
      // console.warn("⚠️ Missing required field(s)");
      return next(new Err("All fields are required", 400));
    }

    // 2️⃣ Create countage
    const new_countage = await db.ArticleCountage.create({
      comment,
      quantity,
      date,
      ArticleId,
      UserId: req.user.id,
    });

    // console.log("✅ Countage created:", new_countage.id);

    // console.log("➡️ Calling update_article_quantity with:", {
    //   ArticleId,
    //   quantity,
    //   date,
    //   parsedDate: new Date(date),
    // });
    // 3️⃣ Update article stock
    await update_article_quantity(ArticleId, new Date(date), quantity);

    // 4️⃣ Send response
    // console.log("🚀 Responding with success.");
    const article = await db.Article.findByPk(ArticleId);
    if (article?.RefId) {
      await recalculateRefQuantity(article.RefId);
    }

    sendRes(res, 200, new_countage);
  } catch (err) {
    console.error("error", err);
  }
};

// UPDATE
exports.update_countage = catchAsync(async (req, res, next) => {
  const { comment, quantity, date } = req.body;
  let update_content = {};
  const targeted_countage = await db.ArticleCountage.findOne({
    where: req.params.id,
  });
  // updating comment
  if (comment) update_content.comment = comment;
  // updating date

  if (date) update_content.date = date;
  if (quantity) update_content.quantity = quantity;

  targeted_countage = { ...targeted_countage, ...update_content };
  await targeted_countage.save();
  // updating quantity
  if (update_content.date) {
    update_article_quantity(
      targeted_countage.ArticleId,
      update_content.date,
      update_content.quantity
    );
  }
  //   COUNTAGE HISTORY
  // for (let i in data) {
  //     // console.log(i in old);
  //     if (i in old) {
  //       let obj = {
  //         data: i,
  //         prevVal: JSON.stringify(old[i]).replace(/"/g, ""),
  //         newVal: req.body[i],
  //         [nameId]: old.id,
  //         UserId: req.user.id,
  //       };
  //       if (
  //         obj.data !== "updatedAt" &&
  //         `${obj.prevVal}` !== `${obj.newVal}` &&
  //         `${obj.prevVal}`.split("T")[0] !== `${obj.newVal}`
  //       ) {
  //         await ModelHistory.create(obj);
  //       }

  //       // console.log(obj);
  //     }
  const article = await db.Article.findByPk(targeted_countage.ArticleId);
  if (article?.RefId) {
    await recalculateRefQuantity(article.RefId);
  }

  sendRes(res, 200, "data has been updated");
});

// DLEETE
exports.delete_countage = catchAsync(async (req, res, next) => {
  // delete
  const { ArticleId, date } = await db.ArticleCountage.findOne({
    where: req.params.id,
  });
  await db.ArticleCountage.delete({ where: req.params.id });
  // get the new last one and do the update
  const last_countage = await db.ArticleCountage.findOne({
    where: {
      ArticleId,
    },
    order: ["date", "DESC"],
  });

  if (date > last_countage.date) {
    const aqs = await db.ArticleQuiSort.findAll({
      where: { ArticleId },
      include: [{ model: db.Sortie, where: { date: { [Op.gt]: date } } }],
    });

    const quantity_sortant = aqs.map((a, b) => a.quantity + b);
    // calculate the new quantity
    const new_qunatity = last_countage.quantity - quantity_sortant;
    // update the quantity of entree
    await db.Article.update(
      { quantity: new_qunatity },
      { where: { id: ArticleId } }
    );
  }
  const article = await db.Article.findByPk(ArticleId);
  if (article?.RefId) {
    await recalculateRefQuantity(article.RefId);
  }

  //   COUNTAGE HISTORY
});

// GET FICHE DE STOCK
exports.fiche_de_stock = catchAsync(async (req, res, next) => {});
