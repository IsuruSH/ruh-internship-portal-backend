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
      company_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Companies", // Referencing the Companies table
          key: "id",
        },
        onDelete: "CASCADE",
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
      foreignKey: "company_id",
    });
  };

  return Internship;
};
