// PreferenceForm.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const PreferenceForm = sequelize.define(
    "PreferenceForm",
    {
      batch: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      instructions: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      deadline: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "PreferenceForms",
      timestamps: false,
    }
  );

  PreferenceForm.associate = (models) => {
    PreferenceForm.hasMany(models.Preference, {
      foreignKey: "form_id",
      onDelete: "CASCADE",
    });
    PreferenceForm.hasMany(models.PreferenceCompany, {
      foreignKey: "form_id",
      onDelete: "CASCADE",
    });
  };

  return PreferenceForm;
};
