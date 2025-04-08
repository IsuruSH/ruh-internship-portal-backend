// models/CompanySupervisor.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const CompanySupervisor = sequelize.define(
    "CompanySupervisor",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      supervisorName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      supervisorEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      supervisorPhone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "CompanySupervisor",
      timestamps: false,
    }
  );

  CompanySupervisor.associate = (models) => {
    CompanySupervisor.belongsTo(models.Student, {
      foreignKey: "student_id",
    });
  };

  return CompanySupervisor;
};
