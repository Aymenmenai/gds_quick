module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("boss", "admin", "supervisor", "operator", "dfc"),
        defaultValue: "supervisor",
      },
    },
    {
      paranoid: true,
    }
  );

  User.associate = (models) => {
    User.belongsTo(models.Magazin, {
      foreignkey: {
        name: "magazinId",
        allowNull: false,
      },
    });

    User.hasMany(models.Countage, {
      onDelete: "cascade",
    });
    User.hasMany(models.CountageHistory, {
      onDelete: "cascade",
    });
    User.hasMany(models.ArticleCountage, {
      onDelete: "cascade",
    });
    User.hasMany(models.ArticleCountageHistory, {
      onDelete: "cascade",
    });
    // TAG
    User.hasMany(models.ExpiredDay, {
      onDelete: "cascade",
    });
    User.hasMany(models.ExpiredDayHistory, {
      onDelete: "cascade",
    });

    // TAG
    User.hasMany(models.Tag, {
      onDelete: "cascade",
    });
    User.hasMany(models.Feedback, {
      onDelete: "cascade",
    });
    User.hasMany(models.TagHistory, {
      onDelete: "cascade",
    });

    // BRAND
    User.hasMany(models.Brand, {
      onDelete: "cascade",
    });
    User.hasMany(models.BrandHistory, {
      onDelete: "cascade",
    });

    // ATTRIBUTE
    User.hasMany(models.Attribute, {
      onDelete: "cascade",
    });
    User.hasMany(models.AttributeHistory, {
      onDelete: "cascade",
    });

    // ARTICLE
    User.hasMany(models.Article, {
      onDelete: "cascade",
    });
    User.hasMany(models.ArticleHistory, {
      onDelete: "cascade",
    });

    // ARTICLE QUI SORT
    User.hasMany(models.ArticleQuiSort, {
      onDelete: "cascade",
    });
    User.hasMany(models.ArticleQuiSortHistory, {
      onDelete: "cascade",
    });

    // BENEFICIARE
    User.hasMany(models.Beneficiare, {
      onDelete: "cascade",
    });
    User.hasMany(models.BeneficiareHistory, {
      onDelete: "cascade",
    });

    // SORTIE
    User.hasMany(models.Sortie, {
      onDelete: "cascade",
    });
    User.hasMany(models.SortieHistory, {
      onDelete: "cascade",
    });
    // GASOIL
    User.hasMany(models.GasoilSortie, {
      onDelete: "cascade",
    });
    User.hasMany(models.GasoilSortieHistory, {
      onDelete: "cascade",
    });
    // EnG
    User.hasMany(models.GasoilEntree, {
      onDelete: "cascade",
    });
    User.hasMany(models.GasoilEntreeHistory, {
      onDelete: "cascade",
    });
    User.hasMany(models.GasoilElement, {
      onDelete: "cascade",
    });
    User.hasMany(models.GasoilElementHistory, {
      onDelete: "cascade",
    });

    // FOURNISSEUR
    User.hasMany(models.Fournisseur, {
      onDelete: "cascade",
    });
    User.hasMany(models.FournisseurHistory, {
      onDelete: "cascade",
    });

    // COMMENT
    User.hasMany(models.Comment, {
      onDelete: "cascade",
    });
    User.hasMany(models.CommentHistory, {
      onDelete: "cascade",
    });

    // ENTREE
    User.hasMany(models.Entree, {
      onDelete: "cascade",
    });
    User.hasMany(models.EntreeHistory, {
      onDelete: "cascade",
    });

    // UNIT
    User.hasMany(models.Unit, {
      onDelete: "cascade",
    });
    User.hasMany(models.UnitHistory, {
      onDelete: "cascade",
    });

    // FAMILY
    User.hasMany(models.Family, {
      onDelete: "cascade",
    });
    User.hasMany(models.FamilyHistory, {
      onDelete: "cascade",
    });

    // SOUS FAMILY
    User.hasMany(models.SousFamily, {
      onDelete: "cascade",
    });
    User.hasMany(models.SousFamilyHistory, {
      onDelete: "cascade",
    });

    // VEHICULE
    User.hasMany(models.Vehicule, {
      onDelete: "cascade",
    });
    User.hasMany(models.VehiculeHistory, {
      onDelete: "cascade",
    });

    // REFERENECE
    User.hasMany(models.Reference, {
      onDelete: "cascade",
    });
    User.hasMany(models.ReferenceHistory, {
      onDelete: "cascade",
    });

    // REF
    User.hasMany(models.Ref, {
      onDelete: "cascade",
    });
    User.hasMany(models.RefHistory, {
      onDelete: "cascade",
    });
  };

  return User;
};
