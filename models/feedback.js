module.exports = (sequelize, DataTypes) => {
  const Feedback = sequelize.define(
    "Feedback",
    {
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isFixed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      paranoid: true,
    }
  );

  Feedback.associate = (models) => {
    Feedback.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return Feedback;
};
