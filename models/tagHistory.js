module.exports = (sequelize, DataTypes) => {
  const TagHistory = sequelize.define(
    "TagHistory",
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

  TagHistory.associate = (models) => {
    TagHistory.belongsTo(models.Tag, {
      foreignKey: "TagId",
    });
    TagHistory.belongsTo(models.User, {
      foreignkey: {
        allowNull: false,
      },
    });
  };

  return TagHistory;
};
