module.exports = (sequelize, DataTypes) => {
  const ArticleCountageHistory = sequelize.define("ArticleCountageHistory", {
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
  });

  ArticleCountageHistory.associate = (models) => {
    ArticleCountageHistory.belongsTo(models.ArticleCountage, {
      foreignKey: "ArticleCountageId",
    });
    ArticleCountageHistory.belongsTo(models.User, {
      foreignkey: {
        allowNull: false,
      },
    });
  };

  return ArticleCountageHistory;
};
