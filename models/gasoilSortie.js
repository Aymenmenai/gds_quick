module.exports = (sequelize, DataTypes) => {
  const GasoilSortie = sequelize.define(
    "GasoilSortie",
    {
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Date.now(),
      },
      quantity: {
        type: DataTypes.FLOAT,
        default: 0,
      },
      number: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total_price: {
        type: DataTypes.FLOAT,
        default: 0,
      },
    },
    {
      paranoid: true,
    }
  );

  GasoilSortie.associate = (models) => {
    GasoilSortie.hasMany(models.GasoilSortieHistory, {
      onDelete: "cascade",
    });

    GasoilSortie.hasMany(models.GasoilElement, {
      onDelete: "cascade",
    });

    GasoilSortie.belongsTo(models.Beneficiare, {
      foreignkey: {
        allowNull: false,
      },
    });

    GasoilSortie.belongsTo(models.User, {
      foreignkey: {
        allowNull: false,
      },
    });
  };

  return GasoilSortie;
};
