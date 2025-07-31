module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define(
    "Tag",
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

  Tag.associate = (models) => {
    Tag.hasMany(models.TagHistory, {
      onDelete: "cascade",
    });

    Tag.hasMany(models.Article, {});
    Tag.belongsTo(models.User, {
      foreignkey: {
        allowNull: false,
      },
    });
    Tag.belongsTo(models.Magazin, {
      foreignkey: {
        allowNull: false,
      },
    });
  };

  return Tag;
};
