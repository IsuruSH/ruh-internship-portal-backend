// models/InternshipStatus.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const InternshipStatus = sequelize.define(
    "InternshipStatus",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      status: {
        type: DataTypes.ENUM(
          "application_submitted",
          "interview_invitation",
          "interview_completed",
          "selection_decision",
          "internship_started",
          "internship_completed"
        ),
        allowNull: false,
      },
      date_achieved: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "InternshipStatus",
      timestamps: false,
    }
  );

  InternshipStatus.associate = (models) => {
    InternshipStatus.belongsTo(models.Student, {
      foreignKey: "student_id",
    });
  };

  return InternshipStatus;
};
