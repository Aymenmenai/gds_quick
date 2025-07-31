const recalculateArticleStock = require("../server/utils/recalculateArticleStock");

module.exports = (sequelize, DataTypes) => {
  const ArticleQuiSort = sequelize.define(
    "ArticleQuiSort",
    {
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      price: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      paranoid: true,
    }
  );

  ArticleQuiSort.associate = (models) => {
    ArticleQuiSort.hasMany(models.ArticleQuiSortHistory, {
      onDelete: "cascade",
    });

    ArticleQuiSort.belongsTo(models.Article, {
      foreignKey: {
        allowNull: false,
      },
    });

    ArticleQuiSort.belongsTo(models.Sortie, {
      foreignKey: {
        allowNull: false,
      },
    });

    ArticleQuiSort.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
      },
    });

    ArticleQuiSort.belongsTo(models.Magazin, {
      foreignKey: {
        allowNull: false,
      },
    });
  };

  // 🔁 Local helper to update Sortie.total_price
  const recalculateSortieTotal = async (sortieId, transaction = null) => {
    const { ArticleQuiSort, Sortie } = sequelize.models;

    const lines = await ArticleQuiSort.findAll({
      where: { SortieId: sortieId },
      transaction,
    });

    const total = lines.reduce((sum, item) => {
      return sum + (item.price || 0) * (item.quantity || 0);
    }, 0);

    await Sortie.update(
      { total_price: total },
      { where: { id: sortieId }, transaction }
    );
  };

  // 🔁 Hooks

  ArticleQuiSort.afterCreate(async (record, options) => {
    const t = options?.transaction;
    if (record.ArticleId) {
      await recalculateArticleStock(record.ArticleId, t);
    }
    if (record.SortieId) {
      await recalculateSortieTotal(record.SortieId, t);
    }
  });

  ArticleQuiSort.afterUpdate(async (record, options) => {
    const t = options?.transaction;
    const changed = record.changed();
    const changedFields = Array.isArray(changed) ? changed : [changed];

    const watchedFields = ["quantity", "SortieId", "date", "price"];
    const hasImportantChange = changedFields.some((field) =>
      watchedFields.includes(field)
    );

    if (hasImportantChange && record.ArticleId) {
      await recalculateArticleStock(record.ArticleId, t);
    }
    if (hasImportantChange && record.SortieId) {
      await recalculateSortieTotal(record.SortieId, t);
    }
  });

  ArticleQuiSort.afterDestroy(async (record, options) => {
    const t = options?.transaction;
    if (record.ArticleId) {
      await recalculateArticleStock(record.ArticleId, t);
    }
    if (record.SortieId) {
      await recalculateSortieTotal(record.SortieId, t);
    }
  });

  return ArticleQuiSort;
};
