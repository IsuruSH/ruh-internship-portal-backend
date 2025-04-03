const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Adjust the path as needed

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
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    paranoid: true,
    deletedAt: "deletedAt",
  }
);

module.exports = Company;
