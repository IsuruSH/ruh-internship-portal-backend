const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Company = require("./Company"); // Import the Company model

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
      references: {
        model: Company,
        key: "id",
      },
    },
  },
  {
    paranoid: true,
    deletedAt: "deletedAt",
  }
);

// Define association: One Company has many Internships
Company.hasMany(Internship, { foreignKey: "companyId", onDelete: "CASCADE" });
Internship.belongsTo(Company, { foreignKey: "companyId" });

module.exports = Internship;
