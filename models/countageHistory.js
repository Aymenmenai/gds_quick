module.exports = (sequelize, DataTypes) => {
  const CountageHistory = sequelize.define("CountageHistory", {
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
  });

  CountageHistory.associate = (models) => {
    CountageHistory.belongsTo(models.Countage, { foreignKey: "CountageId" });
    CountageHistory.belongsTo(models.User, {
      foreignkey: {
        allowNull: false,
      },
    });
  };

  return CountageHistory;
};
