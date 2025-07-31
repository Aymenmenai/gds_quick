// const sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Attribute = sequelize.define(
    "Attribute",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      paranoid: true,
    }
  );

  Attribute.associate = (models) => {
    Attribute.hasMany(models.AttributeHistory, {
      onDelete: "cascade",
    });
    Attribute.belongsTo(models.Article, {
      foreignKey: {
        allowNull: false,
      },
    });
    Attribute.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return Attribute;
};
