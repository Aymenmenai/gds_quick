const { Op } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Entree = sequelize.define(
    "Entree",
    {
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Date.NOW,
      },
      number: {
        type: DataTypes.INTEGER,
        // allowNull: false,
      },
      bon_de_livraison: {
        type: DataTypes.STRING,
        defaultValue: "/",
      },
      total_price: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      facture: {
        type: DataTypes.STRING,
      },
    },
    {
      paranoid: true,
    }
  );

  Entree.associate = (models) => {
    Entree.hasMany(models.EntreeHistory, {
      onDelete: "cascade",
    });

    Entree.belongsTo(models.Fournisseur, {
      foreignKey: "FournisseurId",
    });

    Entree.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
      },
    });

    Entree.belongsTo(models.Magazin, {
      foreignKey: {
        allowNull: false,
      },
    });

    Entree.hasMany(models.Article, {
      foreignKey: "EntreeId",
    });
  };

  Entree.beforeCreate(async (entree, options) => {
    const year = new Date(entree.date).getFullYear();

    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    const latest = await sequelize.models.Entree.findOne({
      where: {
        date: {
          [Op.between]: [startDate, endDate],
        },
        MagazinId: entree.MagazinId,
      },
      order: [["number", "DESC"]],
      attributes: ["number"],
      transaction: options.transaction,
    });

    entree.number = (latest?.number || 0) + 1;
  });

  return Entree;
};
