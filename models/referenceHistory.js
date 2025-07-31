module.exports = (sequelize, DataTypes) => {
  const ReferenceHistory = sequelize.define(
    "ReferenceHistory",
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

  ReferenceHistory.associate = (models) => {
    ReferenceHistory.belongsTo(models.Reference, {
      foreignKey: "ReferenceId",
    });
    ReferenceHistory.belongsTo(models.User, {
      foreignkey: {
        allowNull: false,
      },
    });
  };

  return ReferenceHistory;
};
