const { Op } = require("sequelize");
const db = require("../../models");
const catchAsync = require("../utils/catchAsync");
const Err = require("../utils/appError");
const sendRes = require("../utils/sendRes");

// Helper to update Ref quantity based on latest countage and sorties
const update_ref_quantity = async (RefId, date, quantity) => {
  try {
    // console.log("🔧 [update_ref_quantity] Started for RefId:", RefId);

    const last_countage = await db.Countage.findOne({
      where: { RefId },
      order: [["date", "DESC"]],
    });

    if (!last_countage || date >= last_countage.date) {
      const articles = await db.Article.findAll({ where: { RefId } });
      const articleIds = articles.map((a) => a.id);

      const sorties = await db.ArticleQuiSort.findAll({
        where: {
          ArticleId: { [Op.in]: articleIds },
        },
        include: [
          {
            model: db.Sortie,
            where: { date: { [Op.gt]: date } },
          },
        ],
      });

      const totalSortie = sorties.reduce(
        (sum, s) => sum + (s.quantity || 0),
        0
      );

      const newQuantity = quantity - totalSortie;

      await db.Ref.update({ quantity: newQuantity }, { where: { id: RefId } });

      // console.log("✅ Ref quantity updated successfully.");
    } else {
      // console.log("⛔ Skipping update: countage is older than the latest one.");
    }
  } catch (err) {
    console.error("❌ Error in update_ref_quantity:", err);
  }
};

// CREATE Countage
exports.add_ref_countage = async (req, res, next) => {
  try {
    const { comment, quantity, date, RefId } = req.body;

    if (!comment || !quantity || !date || !RefId) {
      return next(new Err("All fields are required", 400));
    }

    // console.log(req.body);
    const new_countage = await db.Countage.create({
      comment,
      quantity,
      date,
      RefId,
      UserId: req.user.id,
    });

    // console.log(new_countage, "89878768");
    await update_ref_quantity(RefId, new Date(date), quantity);

    sendRes(res, 200, new_countage);
    next();
  } catch (err) {
    console.error(err);
  }
};

// UPDATE Countage
exports.update_ref_countage = catchAsync(async (req, res, next) => {
  const { comment, quantity, date } = req.body;
  const countage = await db.Countage.findOne({ where: req.params.id });

  if (!countage) return next(new Err("Countage not found", 404));

  if (comment) countage.comment = comment;
  if (quantity) countage.quantity = quantity;
  if (date) countage.date = date;

  await countage.save();

  if (date || quantity) {
    await update_ref_quantity(
      countage.RefId,
      new Date(countage.date),
      countage.quantity
    );
  }

  sendRes(res, 200, countage);
});

// DELETE Countage
exports.delete_ref_countage = catchAsync(async (req, res, next) => {
  const { RefId, date } = await db.Countage.findOne({
    where: req.params.id,
  });
  await db.Countage.destroy({ where: req.params.id });

  const last = await db.Countage.findOne({
    where: { RefId },
    order: [["date", "DESC"]],
  });

  if (last && date > last.date) {
    const articles = await db.Article.findAll({ where: { RefId } });
    const articleIds = articles.map((a) => a.id);
    const sorties = await db.ArticleQuiSort.findAll({
      where: {
        ArticleId: { [Op.in]: articleIds },
      },
      include: [
        {
          model: db.Sortie,
          where: { date: { [Op.gt]: last.date } },
        },
      ],
    });
    const quantity_sortant = sorties.reduce(
      (sum, s) => sum + (s.quantity || 0),
      0
    );
    const new_quantity = last.quantity - quantity_sortant;
    await db.Ref.update({ quantity: new_quantity }, { where: { id: RefId } });
  }

  sendRes(res, 200, "Ref countage deleted and quantity updated");
});
