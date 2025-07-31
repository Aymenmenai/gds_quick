module.exports = (sequelize, DataTypes) => {
    const AttributeHistory = sequelize.define(
      "AttributeHistory",
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
  
    AttributeHistory.associate = (models) => {
      AttributeHistory.belongsTo(models.Attribute, { foreignKey: "AttributeId" });
      AttributeHistory.belongsTo(models.User, {
        foreignkey: {
          allowNull: false,
        },
      });
    };
  
    return AttributeHistory;
  };
  