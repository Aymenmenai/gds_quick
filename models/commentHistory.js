module.exports = (sequelize, DataTypes) => {
  const CommentHistory = sequelize.define(
    "CommentHistory",
    {
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
    },
  );

  CommentHistory.associate = (models) => {
    CommentHistory.belongsTo(models.Comment, { foreignKey: "CommentId" });
    CommentHistory.belongsTo(models.User, {
      foreignkey: {
        allowNull: false,
      },
    });
  };

  return CommentHistory;
};
