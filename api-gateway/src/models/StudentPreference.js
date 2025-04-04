// models/StudentPreference.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const StudentPreference = sequelize.define(
    "StudentPreference",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      student_fkid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Student", // Make sure you have a Students model
          key: "id",
        },
      },
      form_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "PreferenceForms",
          key: "id",
        },
      },
      preference_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Preferences",
          key: "id",
        },
      },
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Companies",
          key: "id",
        },
      },
      submitted_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      paranoid: true,
      deletedAt: "deletedAt",
      tableName: "StudentPreferences",
      indexes: [
        // Prevent duplicate submissions for same preference
        {
          unique: true,
          fields: ["student_fkid", "form_id", "preference_id"],
        },
        // For quick lookup of a student's submissions
        {
          fields: ["student_fkid", "form_id"],
        },
      ],
    }
  );

  StudentPreference.associate = (models) => {
    StudentPreference.belongsTo(models.Student, {
      foreignKey: "student_fkid",
    });
    StudentPreference.belongsTo(models.PreferenceForm, {
      foreignKey: "form_id",
    });
    StudentPreference.belongsTo(models.Preference, {
      foreignKey: "preference_id",
    });
    StudentPreference.belongsTo(models.Company, {
      foreignKey: "company_id",
    });
  };

  return StudentPreference;
};
