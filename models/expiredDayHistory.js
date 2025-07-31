module.exports = (sequelize, DataTypes) => {
    const ExpiredDayHistory = sequelize.define(
      "ExpiredDayHistory",
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
  
    ExpiredDayHistory.associate = (models) => {
      ExpiredDayHistory.belongsTo(models.ExpiredDay, { foreignKey: "ExpiredDayId" });
      ExpiredDayHistory.belongsTo(models.User, {
        foreignkey: {
          allowNull: false,
        },
      });
    };
  
    return ExpiredDayHistory;
  };
  