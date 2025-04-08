const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const StudentCVText = sequelize.define(
    "StudentCVText",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      text: {
        type: DataTypes.TEXT("long"), // For large text content
        allowNull: false,
      },
    },
    {
      tableName: "student_cv_texts",
      timestamps: true, // Adds createdAt and updatedAt
      paranoid: false, // Set to true if you want soft deletes
    }
  );

  // Define associations
  StudentCVText.associate = (models) => {
    StudentCVText.belongsTo(models.Student, {
      foreignKey: {
        name: "student_id",
        allowNull: false,
      },
      targetKey: "id",
      onDelete: "CASCADE", // Delete CV text when student is deleted
    });
  };

  return StudentCVText;
};
