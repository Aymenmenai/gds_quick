module.exports = (sequelize, DataTypes) => {
  const Gasoil = sequelize.define(
    "Gasoil",
    {
      number: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      price: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
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

  Gasoil.associate = (models) => {
    Gasoil.belongsTo(models.Beneficiare, {
      foreignKey: {
        allowNull: false,
      },
    });

    Gasoil.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return Gasoil;
};
