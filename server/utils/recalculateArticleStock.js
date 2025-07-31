const db = require("../../models");
const { Op } = require("sequelize");

async function recalculateArticleStock(articleId, transaction = null) {
  // 1. Try to find the latest countage
  const latestCountage = await db.Countage.findOne({
    where: { ArticleId: articleId },
    order: [["date", "DESC"]],
    transaction,
  });

  const article = await db.Article.findByPk(articleId, { transaction });

  if (!article) return;

  let newQuantity = 0;

  if (!latestCountage) {
    // 🔁 No countage — fallback to: initial_quantity - all sorties
    const allSorties = await db.ArticleQuiSort.findAll({
      where: { ArticleId: articleId },
      transaction,
    });

    const totalSortieQty = allSorties.reduce((sum, record) => {
      return sum + (record.quantity || 0);
    }, 0);

    newQuantity = article.initial_quantity - totalSortieQty;
  } else {
    // ✅ Countage exists → subtract sorties after countage
    const sortiesAfterCountage = await db.ArticleQuiSort.findAll({
      where: { ArticleId: articleId },
      include: [
        {
          model: db.Sortie,
          where: {
            date: { [Op.gt]: latestCountage.date },
          },
        },
      ],
      transaction,
    });

    const totalAfter = sortiesAfterCountage.reduce((sum, record) => {
      return sum + (record.quantity || 0);
    }, 0);

    newQuantity = latestCountage.quantity - totalAfter;
  }

  // 3. Update article.quantity
  await article.update({ quantity: newQuantity }, { transaction });
}

module.exports = recalculateArticleStock;
