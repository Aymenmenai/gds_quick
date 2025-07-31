module.exports = (sequelize, DataTypes) => {
  const Reference = sequelize.define(
    "Reference",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      alert: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      is_alerted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      paranoid: true,
    }
  );

  Reference.associate = (models) => {
    Reference.hasMany(models.Ref, {});
    Reference.hasMany(models.ReferenceHistory, {});

    Reference.belongsTo(models.User, {
      foreignkey: {
        allowNull: false,
      },
    });
    Reference.belongsTo(models.Magazin, {
      foreignkey: {
        allowNull: false,
      },
    });
  };

  return Reference;
};
