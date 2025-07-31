module.exports = (sequelize, DataTypes) => {
  const Vehicule = sequelize.define(
    "Vehicule",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      motorisation: {
        type: DataTypes.STRING,
      },
      serialCode: {
        type: DataTypes.STRING,
      },
      matricule: {
        type: DataTypes.STRING,
        unique: true,
      },
    },
    {
      paranoid: true,
    }
  );

  Vehicule.associate = (models) => {
    Vehicule.hasMany(models.VehiculeHistory, {
      onDelete: "cascade",
    });

    Vehicule.hasMany(models.Sortie, {
      onDelete: "cascade",
    });

    Vehicule.hasMany(models.GasoilElement, {
      onDelete: "cascade",
    });

    Vehicule.belongsTo(models.User, {
      foreignkey: {
        allowNull: false,
      },
    });

    Vehicule.belongsTo(models.VehiculeType, {
      foreignkey: {
        allowNull: false,
      },
    });
    Vehicule.belongsTo(models.VehiculeClient, {
      foreignkey: {
        allowNull: false,
      },
    });
  };

  return Vehicule;
};
