const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const PreferenceCompany = sequelize.define(
    "PreferenceCompany",
    {
      preference_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      paranoid: true,
      deletedAt: "deletedAt",
      tableName: "PreferenceCompanies",
    }
  );

  PreferenceCompany.associate = (models) => {
    PreferenceCompany.belongsTo(models.Preference, {
      foreignKey: "preference_id",
    });
    PreferenceCompany.belongsTo(models.Company, {
      foreignKey: "company_id",
    });
  };

  return PreferenceCompany;
};
