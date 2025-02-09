const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const Student = sequelize.define(
  "Student",
  {
    student_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "Student ID already exists",
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact_number: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    academic_year: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    current_gpa: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    first_login: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "Student",
    timestamps: false,
  }
);

module.exports = Student;
