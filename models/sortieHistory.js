module.exports = (sequelize, DataTypes) => {
  const SortieHistory = sequelize.define(
    "SortieHistory",
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

  SortieHistory.associate = (models) => {
    SortieHistory.belongsTo(models.Sortie, {
      foreignKey: "SortieId",
    });
    SortieHistory.belongsTo(models.User, {
      foreignkey: {
        allowNull: false,
      },
    });
  };

  return SortieHistory;
};
