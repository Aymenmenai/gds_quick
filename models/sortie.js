const { Op } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Sortie = sequelize.define(
    "Sortie",
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
      total_price: {
        type: DataTypes.FLOAT,
        default: 0,
      },
    },
    {
      paranoid: true,
    }
  );

  Sortie.associate = (models) => {
    Sortie.hasMany(models.SortieHistory, {
      onDelete: "cascade",
    });

    // Sortie.hasMany(models.Order, {});
    Sortie.hasMany(models.ArticleQuiSort, {
      onDelete: "cascade",
    });
    Sortie.belongsTo(models.Beneficiare, {
      foreignkey: {
        allowNull: false,
      },
    });
    Sortie.belongsTo(models.Vehicule, {
      foreignkey: {
        allowNull: false,
      },
    });
    Sortie.belongsTo(models.User, {
      foreignkey: {
        allowNull: false,
      },
    });
    Sortie.belongsTo(models.Magazin, {
      foreignkey: {
        allowNull: false,
      },
    });
  };

  Sortie.beforeCreate(async (sortie, options) => {
    const year = new Date(sortie.date).getFullYear();

    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    const latest = await sequelize.models.Sortie.findOne({
      where: {
        date: {
          [Op.between]: [startDate, endDate],
        },
        MagazinId: sortie.MagazinId,
      },
      order: [["number", "DESC"]],
      attributes: ["number"],
      transaction: options.transaction,
    });

    sortie.number = (latest?.number || 0) + 1;
  });
  return Sortie;
};
