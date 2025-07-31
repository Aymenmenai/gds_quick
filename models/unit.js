module.exports = (sequelize, DataTypes) => {
  const Unit = sequelize.define(
    "Unit",
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

  Unit.associate = (models) => {
    Unit.hasMany(models.UnitHistory, {
      onDelete: "cascade",
    });
    // STOCK BOUGHT
    Unit.hasMany(models.Article, {});
    Unit.belongsTo(models.User, {
      foreignkey: {
        name: "userId",
        allowNull: false,
      },
    });
  };

  return Unit;
};
