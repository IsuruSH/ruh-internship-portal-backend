// models/Internship.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Internship = sequelize.define(
    "Internship",
    {
      designation: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      duration: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      paranoid: true,
      deletedAt: "deletedAt",
      tableName: "Internships", // Explicit table name in plural
    }
  );

  Internship.associate = (models) => {
    Internship.belongsTo(models.Company, {
      foreignKey: "companyId",
      as: "company", // Optional: adds alias for eager loading
    });
  };

  return Internship;
};
