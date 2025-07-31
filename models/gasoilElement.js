module.exports = (sequelize, DataTypes) => {
  const GasoilElement = sequelize.define(
    "GasoilElement",
    {
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      price: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Date.now(),
      },
    },
    {
      paranoid: true,
    }
  );

  GasoilElement.associate = (models) => {
    GasoilElement.hasMany(models.GasoilElementHistory, {
      onDelete: "cascade",
    });
    GasoilElement.belongsTo(models.Vehicule, {
      foreignKey: {
        allowNull: false,
      },
    });

    GasoilElement.belongsTo(models.GasoilSortie, {
      foreignKey: {
        allowNull: false,
      },
    });

    GasoilElement.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return GasoilElement;
};
