const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Admin = require("./Admin");

const Internship = sequelize.define(
  "Internship",
  {
    internship_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    admin_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Admin,
        key: "admin_id",
      },
    },
    company_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    position: {
      type: DataTypes.STRING(50),
    },
    time_period: {
      type: DataTypes.STRING(50),
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Internship",
    timestamps: true,
  }
);

Internship.belongsTo(Admin, { foreignKey: "admin_id" });

module.exports = Internship;
