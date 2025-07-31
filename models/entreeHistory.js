module.exports = (sequelize, DataTypes) => {
  const EntreeHistory = sequelize.define(
    "EntreeHistory",
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

  EntreeHistory.associate = (models) => {
    EntreeHistory.belongsTo(models.Entree, { foreignKey: "EntreeId" });
    EntreeHistory.belongsTo(models.User, {
      foreignkey: {
        allowNull: false,
      },
    });
  };

  return EntreeHistory;
};
