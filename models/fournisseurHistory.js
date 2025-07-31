module.exports = (sequelize, DataTypes) => {
  const FournisseurHistory = sequelize.define("FournisseurHistory", {
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
  });

  FournisseurHistory.associate = (models) => {
    FournisseurHistory.belongsTo(models.Fournisseur, {
      foreignKey: "FournisseurId",
    });
    FournisseurHistory.hasMany(models.Entree, { foreignKey: "FournisseurId" });
    FournisseurHistory.belongsTo(models.User, {
      foreignkey: {
        allowNull: false,
      },
    });
  };

  return FournisseurHistory;
};
