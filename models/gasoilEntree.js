module.exports = (sequelize, DataTypes) => {
  const GasoilEntree = sequelize.define(
    "GasoilEntree",
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
      facture: {
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

  GasoilEntree.associate = (models) => {
    GasoilEntree.belongsTo(models.Fournisseur, {
      foreignKey: {
        allowNull: false,
      },
    });

    GasoilEntree.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return GasoilEntree;
};
