module.exports = (sequelize, DataTypes) => {
    const BeneficiareHistory = sequelize.define(
      "BeneficiareHistory",
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
  
    BeneficiareHistory.associate = (models) => {
      BeneficiareHistory.belongsTo(models.Beneficiare, { foreignKey: "BeneficiareId" });
      BeneficiareHistory.belongsTo(models.User, {
        foreignkey: {
          allowNull: false,
        },
      });
    };
  
    return BeneficiareHistory;
  };
  