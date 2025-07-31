module.exports = (sequelize, DataTypes) => {
  const VehiculeTypeHistory = sequelize.define(
    "VehiculeTypeHistory",
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

  VehiculeTypeHistory.associate = (models) => {
    VehiculeTypeHistory.belongsTo(models.VehiculeType, {
      foreignKey: "VehiculeTypeId",
    });
    VehiculeTypeHistory.belongsTo(models.User, {
      foreignkey: {
        allowNull: false,
      },
    });
  };

  return VehiculeTypeHistory;
};
