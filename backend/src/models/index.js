// models/index.js
const Sequelize = require("sequelize");
const sequelize = require("../config/database");

// Import model functions
const Company = require("./Company");
const Internship = require("./Internship");
const Preference = require("./Preference");
const PreferenceCompany = require("./PreferenceCompany");
const PreferenceForm = require("./PreferenceForm");
const StudentPreference = require("./StudentPreference");
const Student = require("./Student");
const StudentCVText = require("./StudentCVText");
const InternshipStatus = require("./InternshipStatus");
const CompanySupervisor = require("./CompanySupervisor");

// Initialize models
const models = {
  Company: Company(sequelize),
  Internship: Internship(sequelize),
  Preference: Preference(sequelize),
  PreferenceCompany: PreferenceCompany(sequelize),
  PreferenceForm: PreferenceForm(sequelize),
  StudentPreference: StudentPreference(sequelize),
  Student: Student(sequelize),
  StudentCVText: StudentCVText(sequelize),
  InternshipStatus: InternshipStatus(sequelize),
  CompanySupervisor: CompanySupervisor(sequelize),
};

// Set up associations
Object.keys(models).forEach((modelName) => {
  if (typeof models[modelName].associate === "function") {
    models[modelName].associate(models);
  }
});

module.exports = {
  ...models,
  sequelize,
  Sequelize,
};
