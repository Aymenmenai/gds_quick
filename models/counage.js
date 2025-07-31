module.exports = (sequelize, DataTypes) => {
  const Countage = sequelize.define(
    "Countage",
    {
      quantity: {
        type: DataTypes.INTEGER,
      },
      comment: {
        type: DataTypes.STRING,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Date.now(),
      },
    },
    {
      paranoid: true,
    }
  );

  Countage.associate = (models) => {
    Countage.belongsTo(models.Ref, {
      foreignkey: {
        allowNull: false,
      },
    });
    Countage.hasMany(models.CountageHistory, {
      onDelete: "cascade",
    });
    Countage.belongsTo(models.User, {
      foreignkey: {
        allowNull: false,
      },
    });
  };

  return Countage;
};
