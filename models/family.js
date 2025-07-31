module.exports = (sequelize, DataTypes) => {
  const Family = sequelize.define(
    "Family",
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

  Family.associate = (models) => {
    Family.hasMany(models.FamilyHistory, {
      onDelete: "cascade",
    });
    Family.hasMany(models.SousFamily, {});

    Family.belongsTo(models.User, {
      foreignkey: {
        allowNull: false,
      },
    });
    Family.belongsTo(models.Magazin, {
      foreignkey: {
        allowNull: false,
      },
    });
  };

  return Family;
};
