module.exports = (sequelize, DataTypes) => {
  const GasoilSortieHistory = sequelize.define(
    "GasoilSortieHistory",
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

  GasoilSortieHistory.associate = (models) => {
    GasoilSortieHistory.belongsTo(models.GasoilSortie, {
      foreignKey: "GasoilSortieId",
    });
    GasoilSortieHistory.belongsTo(models.User, {
      foreignkey: {
        allowNull: false,
      },
    });
  };

  return GasoilSortieHistory;
};
