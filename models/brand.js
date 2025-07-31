module.exports = (sequelize, DataTypes) => {
  const Brand = sequelize.define(
    "Brand",
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

  Brand.associate = (models) => {
    Brand.hasMany(models.BrandHistory, {
      onDelete: "cascade",
    });
    Brand.hasMany(models.Article, {});
    Brand.hasMany(models.VehiculeType, {});
    Brand.belongsTo(models.User, {
      foreignkey: {
        name: "userId",
        allowNull: false,
      },
    }); 
  };

  return Brand;
};
