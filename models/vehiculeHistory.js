module.exports = (sequelize, DataTypes) => {
    const VehiculeHistory = sequelize.define(
      "VehiculeHistory",
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
  
    VehiculeHistory.associate = (models) => {
      VehiculeHistory.belongsTo(models.Vehicule, {
        foreignKey: "VehiculeId",
      });
      VehiculeHistory.belongsTo(models.User, {
        foreignkey: {
          allowNull: false,
        },
      });
    };
  
    return VehiculeHistory;
  };
  