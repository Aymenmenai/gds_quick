module.exports = (sequelize, DataTypes) => {
  const FamilyHistory = sequelize.define(
    "FamilyHistory",
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

  FamilyHistory.associate = (models) => {
    FamilyHistory.belongsTo(models.Family, { foreignKey: "FamilyId" });
    FamilyHistory.belongsTo(models.User, {
      foreignkey: {
        allowNull: false,
      },
    });
  };

  return FamilyHistory;
};
