module.exports = (sequelize, DataTypes) => {
  const Magazin = sequelize.define(
    "Magazin",
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

  Magazin.associate = (models) => {
    Magazin.hasMany(models.User, {
      onDelete: "cascade",
    });

    Magazin.hasMany(models.ExpiredDay, {
      onDelete: "cascade",
    });

    // TAG
    Magazin.hasMany(models.Tag, {
      onDelete: "cascade",
    });



    // ARTICLE
    Magazin.hasMany(models.Article, {
      onDelete: "cascade",
    });

    // ARTICLE QUI SORT
    Magazin.hasMany(models.ArticleQuiSort, {
      onDelete: "cascade",
    });

    // // ENGINE
    // Magazin.hasMany(models.Engine, {
    //   onDelete: "cascade",
    // });

    // SORTIE
    Magazin.hasMany(models.Sortie, {
      onDelete: "cascade",
    });

    // FOURNISSEUR
    Magazin.hasMany(models.Fournisseur, {
      onDelete: "cascade",
    });

    // COMMENT
    Magazin.hasMany(models.Comment, {
      onDelete: "cascade",
    });

    // ENTREE
    Magazin.hasMany(models.Entree, {
      onDelete: "cascade",
    });

    // FAMILY
    Magazin.hasMany(models.Family, {
      onDelete: "cascade",
    });


    // REFERENECE
    Magazin.hasMany(models.Reference, {
      onDelete: "cascade",
    });
        // REFERENECE
    Magazin.hasMany(models.Ref, {
      onDelete: "cascade",
    });
  };

  return Magazin;
};
