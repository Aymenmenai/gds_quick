module.exports = (sequelize, DataTypes) => {
  const ExpiredDay = sequelize.define(
    "ExpiredDay",
    {
      ExpiredDay: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      paranoid: true,
    }
  );

  ExpiredDay.associate = (models) => {
    ExpiredDay.hasMany(models.ExpiredDayHistory, {
      onDelete: "cascade",
    });
    ExpiredDay.belongsTo(models.Article, {
      foreignKey: {
        allowNull: false,
      },
    });
    ExpiredDay.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
      },
    });
    ExpiredDay.belongsTo(models.Magazin, {
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return ExpiredDay;
};
