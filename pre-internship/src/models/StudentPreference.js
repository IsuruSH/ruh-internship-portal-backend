const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const StudentPreference = sequelize.define(
  "StudentPreference",
  {
    preference_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    student_id: {
      type: DataTypes.STRING,
    },
    selected_internship_ids: {
      type: DataTypes.STRING,
    },
    submitted_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Student_Preference",
    timestamps: false,
  }
);

module.exports = StudentPreference;
