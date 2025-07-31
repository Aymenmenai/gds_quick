module.exports = (sequelize, DataTypes) => {
  const GasoilEntreeHistory = sequelize.define(
    "GasoilEntreeHistory",
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

  GasoilEntreeHistory.associate = (models) => {
    GasoilEntreeHistory.belongsTo(models.GasoilEntree, {
      foreignKey: "GasoilEntreeId",
    });
    GasoilEntreeHistory.belongsTo(models.User, {
      foreignkey: {
        allowNull: false,
      },
    });
  };

  return GasoilEntreeHistory;
};
