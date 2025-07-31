module.exports = (sequelize, DataTypes) => {
    const UnitHistory = sequelize.define(
      "UnitHistory",
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
  
    UnitHistory.associate = (models) => {
      UnitHistory.belongsTo(models.Unit, {
        foreignKey: "UnitId",
      });
      UnitHistory.belongsTo(models.User, {
        foreignkey: {
          allowNull: false,
        },
      });
    };
  
    return UnitHistory;
  };
  