module.exports = (sequelize, DataTypes) => {
  const RefHistory = sequelize.define(
    "RefHistory",
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

  RefHistory.associate = (models) => {
    RefHistory.belongsTo(models.Ref, {
      foreignKey: "RefId",
    });
    RefHistory.belongsTo(models.User, {
      foreignkey: {
        allowNull: false,
      },
    });
  };

  return RefHistory;
};
