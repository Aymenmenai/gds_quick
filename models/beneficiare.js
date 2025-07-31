module.exports = (sequelize, DataTypes) => {
  const Beneficiare = sequelize.define(
    "Beneficiare",
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

  Beneficiare.associate = (models) => {
    Beneficiare.hasMany(models.BeneficiareHistory, {
      onDelete: "cascade",
    });
    Beneficiare.hasMany(models.Sortie, {});

    Beneficiare.hasMany(models.GasoilSortie, {});

    Beneficiare.belongsTo(models.User, {
      foreignkey: {
        name: "userId",
        allowNull: false,
      },
    });
  };

  return Beneficiare;
};
