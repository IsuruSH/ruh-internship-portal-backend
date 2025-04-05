const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Preference = sequelize.define(
    "Preference",
    {
      form_id: {
        type: DataTypes.INTEGER,
        references: { model: "PreferenceForms", key: "id" },
        onDelete: "CASCADE",
      },
      name: { type: DataTypes.STRING, allowNull: false },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      tableName: "Preferences",
      timestamps: false,
    }
  );

  Preference.associate = (models) => {
    Preference.belongsTo(models.PreferenceForm, {
      foreignKey: "form_id",
      onDelete: "CASCADE",
    });
    Preference.hasMany(models.PreferenceCompany, {
      foreignKey: "preference_id",
    });
    Preference.belongsToMany(models.Company, {
      through: models.PreferenceCompany,
      foreignKey: "preference_id",
      otherKey: "company_id",
    });
    Preference.hasMany(models.StudentPreference, {
      foreignKey: "preference_id",
      onDelete: "CASCADE",
    });
  };

  return Preference;
};
