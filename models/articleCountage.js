module.exports = (sequelize, DataTypes) => {
  const ArticleCountage = sequelize.define(
    "ArticleCountage",
    {
      quantity: {
        type: DataTypes.INTEGER,
      },
      comment: {
        type: DataTypes.STRING,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Date.now(),
      },
    },
    {
      paranoid: true,
    }
  );

  ArticleCountage.associate = (models) => {
    ArticleCountage.belongsTo(models.Article, {
      foreignkey: {
        allowNull: false,
      },
    });
    ArticleCountage.hasMany(models.ArticleCountageHistory, {
      onDelete: "cascade",
    });
    ArticleCountage.belongsTo(models.User, {
      foreignkey: {
        allowNull: false,
      },
    });
  };

  return ArticleCountage;
};
