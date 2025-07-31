module.exports = (sequelize, DataTypes) => {
  const GasoilHistory = sequelize.define(
    "GasoilHistory",
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

  GasoilHistory.associate = (models) => {
    GasoilHistory.belongsTo(models.Gasoil, {
      foreignKey: "GasoilId",
    });
    GasoilHistory.belongsTo(models.User, {
      foreignkey: {
        allowNull: false,
      },
    });
  };

  return GasoilHistory;
};
