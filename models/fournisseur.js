module.exports = (sequelize, DataTypes) => {
  const Fournisseur = sequelize.define(
    "Fournisseur",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
      fax: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
    },
    {
      paranoid: true,
    }
  );

  Fournisseur.associate = (models) => {
    Fournisseur.hasMany(models.FournisseurHistory, {
      onDelete: "cascade",
    });

    Fournisseur.hasMany(models.Entree, {});

    Fournisseur.hasMany(models.GasoilEntree, {});
    Fournisseur.belongsTo(models.User, {
      foreignkey: "UserId",
    });
    Fournisseur.belongsTo(models.Magazin, {
      foreignkey: {
        allowNull: false,
      },
    });
  };

  return Fournisseur;
};
