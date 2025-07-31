module.exports = (sequelize, DataTypes) => {
  const GasoilElementHistory = sequelize.define(
    "GasoilElementHistory",
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

  GasoilElementHistory.associate = (models) => {
    GasoilElementHistory.belongsTo(models.GasoilElement, { foreignKey: "GasoilElementId" });
    GasoilElementHistory.belongsTo(models.User, {
      foreignkey: {
        allowNull: false,
      },
    });
  };

  return GasoilElementHistory;
};
