module.exports = (sequelize, DataTypes) => {
  const VehiculeClient = sequelize.define(
    "VehiculeClient",
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

  VehiculeClient.associate = (models) => {
    VehiculeClient.hasMany(models.VehiculeClientHistory, {
      onDelete: "cascade",
    });
    VehiculeClient.hasMany(models.Vehicule, {});

    VehiculeClient.belongsTo(models.User, {
      foreignkey: {
        name: "userId",
        allowNull: false,
      },
    });
  };

  return VehiculeClient;
};
