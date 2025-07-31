module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define(
    "Article",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW, // ✅ Correct usage
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      initial_quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      price: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      tax: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        validate: {
          max: 1,
          min: 0,
        },
      },
      discount: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        validate: {
          max: 1,
          min: 0,
        },
      },
      place: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
    },
    {
      paranoid: true,
    }
  );

  Article.associate = (models) => {
    Article.hasMany(models.ArticleCountage, {
      onDelete: "cascade",
    });
    Article.hasOne(models.ExpiredDay, {
      onDelete: "cascade",
    });

    Article.hasMany(models.Attribute, {
      onDelete: "cascade",
    });
    Article.hasMany(models.ArticleQuiSort, {
      onDelete: "cascade",
    });
    Article.hasMany(models.ArticleHistory, {
      onDelete: "cascade",
    });
    Article.hasMany(models.Comment, {
      onDelete: "cascade",
    });
    Article.belongsTo(models.Entree, {
      foreignKey: "EntreeId",
    });
    Article.belongsTo(models.Unit, {
      foreignKey: "UnitId", // ✅ Fix casing
    });
    Article.belongsTo(models.SousFamily, {
      foreignKey: "SousFamilyId",
    });
    Article.belongsTo(models.Ref, {
      foreignKey: "RefId",
    });
    Article.belongsTo(models.Tag, {
      foreignKey: "TagId",
    });
    Article.belongsTo(models.Brand, {
      foreignKey: "BrandId",
    });
    Article.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
      },
    });
    Article.belongsTo(models.Magazin, {
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return Article;
};
