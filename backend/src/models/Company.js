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
    });

    Company.hasMany(models.Internship, {
      foreignKey: "company_id",

      onDelete: "CASCADE",
    });

    Company.belongsToMany(models.Preference, {
      through: models.PreferenceCompany,
      foreignKey: "company_id",
      otherKey: "preference_id",
    });

    Company.hasMany(models.StudentPreference, {
      foreignKey: "company_id",
      onDelete: "CASCADE",
    });
  };

  return Company;
};
