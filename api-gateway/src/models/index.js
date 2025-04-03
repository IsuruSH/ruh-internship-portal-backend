// models/index.js
const Sequelize = require("sequelize");
const sequelize = require("../config/database");

// Import model functions
const Company = require("./Company");
const Internship = require("./Internship");
const Preference = require("./Preference");
const PreferenceCompany = require("./PreferenceCompany");
const PreferenceForm = require("./PreferenceForm");

// Initialize models
const models = {
  Company: Company(sequelize),
  Internship: Internship(sequelize),
  Preference: Preference(sequelize),
  PreferenceCompany: PreferenceCompany(sequelize),
  PreferenceForm: PreferenceForm(sequelize),
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
