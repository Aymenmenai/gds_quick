module.exports = (sequelize, DataTypes) => {
  const VehiculeType = sequelize.define(
    "VehiculeType",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, 
      },
    },
    {
      paranoid: true,
    }
  );

  VehiculeType.associate = (models) => {
    VehiculeType.hasMany(models.VehiculeTypeHistory, {
      onDelete: "cascade",
    });

    VehiculeType.hasMany(models.Vehicule, {
      onDelete: "cascade",
    });

    VehiculeType.belongsTo(models.User, {
      foreignkey: {
        allowNull: false,
      },
    });
    VehiculeType.belongsTo(models.Brand, {
      foreignkey: {
        allowNull: false,
      },
    });
  };

  return VehiculeType;
};
