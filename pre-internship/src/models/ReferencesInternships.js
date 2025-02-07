const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const StudentPreference = require("./StudentPreference");
const Internship = require("./Internship");

const ReferencesInternships = sequelize.define(
  "ReferencesInternships",
  {
    preference_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: StudentPreference,
        key: "preference_id",
      },
    },
    internship_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Internship,
        key: "internship_id",
      },
    },
  },
  {
    tableName: "References_Internships",
    timestamps: false,
  }
);

ReferencesInternships.belongsTo(StudentPreference, {
  foreignKey: "preference_id",
});
ReferencesInternships.belongsTo(Internship, { foreignKey: "internship_id" });

module.exports = ReferencesInternships;
