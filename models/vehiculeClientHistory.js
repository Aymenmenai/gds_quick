module.exports = (sequelize, DataTypes) => {
  const VehiculeClientHistory = sequelize.define("VehiculeClientHistory", {
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

  VehiculeClientHistory.associate = (models) => {
    VehiculeClientHistory.belongsTo(models.VehiculeClient, { foreignKey: "VehiculeClientId" });
    VehiculeClientHistory.belongsTo(models.User, {
      foreignkey: {
        allowNull: false,
      },
    });
  };

  return VehiculeClientHistory;
};
