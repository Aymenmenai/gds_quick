module.exports = (sequelize, DataTypes) => {
  const Ref = sequelize.define(
    "Ref",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      initial_quantity: {
        type: DataTypes.INTEGER,
      },
      quantity: {
        type: DataTypes.INTEGER,
      },
    },
    {
      paranoid: true,
    }
  );

  Ref.associate = (models) => {
    Ref.hasMany(models.RefHistory, {
      onDelete: "cascade",
    });

    Ref.hasMany(models.Article, {});

    Ref.hasMany(models.Countage, {});

    Ref.belongsTo(models.Reference, {
      foreignkey: {
        allowNull: false,
      },
    });
    Ref.belongsTo(models.User, {
      foreignkey: {
        allowNull: false,
      },
    });
    Ref.belongsTo(models.Magazin, {
      foreignkey: {
        allowNull: false,
      },
    });
  };

  return Ref;
};
