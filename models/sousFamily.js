module.exports = (sequelize, DataTypes) => {
  const SousFamily = sequelize.define(
    "SousFamily",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      paranoid: true,
    }
  );

  SousFamily.associate = (models) => {
    SousFamily.hasMany(models.SousFamilyHistory, {
      onDelete: "cascade",
    });
    SousFamily.hasMany(models.Article, {});

    SousFamily.belongsTo(models.Family, {
      foreignkey: {
        allowNull: false,
      },
    });
    SousFamily.belongsTo(models.User, {
      foreignkey: {
        allowNull: false,
      },
    });
    SousFamily.belongsTo(models.Magazin, {
      foreignkey: {
        allowNull: false,
      },
    });
  };

  return SousFamily;
};
