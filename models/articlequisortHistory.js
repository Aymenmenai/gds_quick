module.exports = (sequelize, DataTypes) => {
  const ArticleQuiSortHistory = sequelize.define(
    "ArticleQuiSortHistory",
    {
      data: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      prevVal: {
        type: DataTypes.STRING,
      },
      newVal: {
        type: DataTypes.STRING,
      },
    },
  );

  ArticleQuiSortHistory.associate = (models) => {
    ArticleQuiSortHistory.belongsTo(models.ArticleQuiSort, { foreignKey: "ArticleQuiSortId" });
    ArticleQuiSortHistory.belongsTo(models.User, {
      foreignkey: {
        allowNull: false,
      },
    });
  };

  return ArticleQuiSortHistory;
};
