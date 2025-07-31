module.exports = (sequelize, DataTypes) => {
  const SousFamilyHistory = sequelize.define(
    "SousFamilyHistory",
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

  SousFamilyHistory.associate = (models) => {
    SousFamilyHistory.belongsTo(models.SousFamily, {
      foreignKey: "SousFamilyId",
    });
    SousFamilyHistory.belongsTo(models.User, {
      foreignkey: {
        allowNull: false,
      },
    });
  };

  return SousFamilyHistory;
};
