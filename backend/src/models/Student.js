// models/Student.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
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
        // unique: true,
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
      gpa: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      first_login: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      profileImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      cvLink: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "Student", // Kept the same table name
      timestamps: false, // Maintained your existing setting
      paranoid: false, // Added for consistency (you can enable if needed)
    }
  );

  Student.associate = (models) => {
    Student.hasMany(models.StudentPreference, {
      foreignKey: "student_fkid",
    });
    Student.hasOne(models.StudentCVText, {
      foreignKey: "student_id",
    });
    Student.hasOne(models.CompanySupervisor, {
      foreignKey: "student_id",
    });
    Student.hasMany(models.InternshipStatus, {
      foreignKey: "student_id",
    });
  };

  return Student;
};
