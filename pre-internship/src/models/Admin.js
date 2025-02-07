const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Admin = sequelize.define(
  "Admin",
  {
    admin_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // Add other admin fields as needed
  },
  {
    tableName: "Admin",
    timestamps: false,
  }
);

module.exports = Admin;
