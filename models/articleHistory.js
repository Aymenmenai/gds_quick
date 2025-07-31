module.exports = (sequelize, DataTypes) => {
  const ArticleHistory = sequelize.define(
    "ArticleHistory",
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

  ArticleHistory.associate = (models) => {
    ArticleHistory.belongsTo(models.Article, { foreignKey: "ArticleId" });
    ArticleHistory.belongsTo(models.User, {
      foreignkey: {
        allowNull: false,
      },
    });
  };

  return ArticleHistory;
};
