// Company.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Company = sequelize.define(
    "Company",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      person: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      note: {
        type: DataTypes.TEXT, // Changed to TEXT for longer notes
        allowNull: true,
      },
    },
    {
      paranoid: true,
      deletedAt: "deletedAt",
      tableName: "Companies", // Explicit table name in plural
    }
  );

  Company.associate = (models) => {
    Company.hasMany(models.PreferenceCompany, {
      foreignKey: "company_id",
      as: "preferenceCompanies", // Optional: adds alias for eager loading
    });

    // Add other associations here if needed
    // For example, if you have Internship model:
    // Company.hasMany(models.Internship, { foreignKey: 'company_id' });
  };

  return Company;
};
