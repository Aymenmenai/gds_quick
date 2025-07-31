module.exports = (sequelize, DataTypes) => {
  const BrandHistory = sequelize.define("BrandHistory", {
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

  BrandHistory.associate = (models) => {
    BrandHistory.belongsTo(models.Brand, { foreignKey: "BrandId" });
    BrandHistory.belongsTo(models.User, {
      foreignkey: {
        allowNull: false,
      },
    });
  };

  return BrandHistory;
};
