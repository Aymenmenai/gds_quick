// const sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
    {
      alert: {
        type: DataTypes.ENUM("not important", "important"),
        defaultValue: "not important",
        allowNull: false,
      },
      details: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      paranoid: true,
    }
  );

  Comment.associate = (models) => {
    Comment.hasMany(models.CommentHistory, {
      onDelete: "cascade",
    });
    Comment.belongsTo(models.Article, {
      foreignKey: {
        allowNull: false,
      },
    });
    Comment.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
      },
    });
    Comment.belongsTo(models.Magazin, {
      foreignkey: {
        allowNull: false,
      },
    });
  };

  return Comment;
};
