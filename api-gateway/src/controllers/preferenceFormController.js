// controllers/preferenceFormController.js
const {
  PreferenceForm,
  Preference,
  PreferenceCompany,
  Company,
} = require("../models");

module.exports = {
  // Create a new preference form
  async createForm(req, res) {
    try {
      const { batch, instructions, deadline, preferences } = req.body;

      const form = await PreferenceForm.create({
        batch,
        instructions,
        deadline,
      });

      if (preferences && preferences.length > 0) {
        await Promise.all(
          preferences.map(async (pref) => {
            const preference = await Preference.create({
              form_id: form.id,
              name: pref.name,
            });

            if (pref.companies && pref.companies.length > 0) {
              await PreferenceCompany.bulkCreate(
                pref.companies.map((companyId) => ({
                  preference_id: preference.id,
                  company_id: companyId,
                }))
              );
            }
          })
        );
      }

      const createdForm = await PreferenceForm.findByPk(form.id, {
        include: [
          {
            model: Preference,
            attributes: ["id", "name"],
            include: [
              {
                model: Company,
                attributes: ["id", "name"],
                through: { attributes: [] }, // This hides the join table attributes
              },
            ],
          },
        ],
      });

      res
        .status(201)
        .json({ message: "Form created successfully", createdForm });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get all forms
  async getAllForms(req, res) {
    try {
      const forms = await PreferenceForm.findAll({
        include: [
          {
            model: Preference,
            attributes: ["id", "name"],
            include: [
              {
                model: Company,
                attributes: ["id", "name"],
                through: { attributes: [] }, // This hides the join table attributes
              },
            ],
          },
        ],
      });
      res.json(forms);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get form by ID
  async getFormById(req, res) {
    try {
      const form = await PreferenceForm.findByPk(req.params.id, {
        include: [
          {
            model: Preference,
            attributes: ["id", "name"],
            include: [
              {
                model: Company,
                attributes: ["id", "name"],
                through: { attributes: [] }, // This hides the join table attributes
              },
            ],
          },
        ],
      });
      if (!form) {
        return res.status(404).json({ error: "Form not found" });
      }
      res.json(form);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update form
  async updateForm(req, res) {
    try {
      const { batch, instructions, deadline } = req.body;
      const form = await PreferenceForm.findByPk(req.params.id);

      if (!form) {
        return res.status(404).json({ error: "Form not found" });
      }

      await form.update({ batch, instructions, deadline });
      res.json(form);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete form
  async deleteForm(req, res) {
    try {
      const form = await PreferenceForm.findByPk(req.params.id);
      if (!form) {
        return res.status(404).json({ error: "Form not found" });
      }

      await form.destroy();
      res.json({ message: "Form deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Add preference to form
  async addPreference(req, res) {
    try {
      const { name } = req.body;
      const preference = await Preference.create({
        form_id: req.params.formId,
        name,
      });

      res.status(201).json(preference);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update preference
  async updatePreference(req, res) {
    try {
      const { name } = req.body;
      const preference = await Preference.findOne({
        where: {
          id: req.params.preferenceId,
          form_id: req.params.formId,
        },
      });

      if (!preference) {
        return res.status(404).json({ error: "Preference not found" });
      }

      await preference.update({ name });
      res.json(preference);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete preference
  async deletePreference(req, res) {
    try {
      const preference = await Preference.findOne({
        where: {
          id: req.params.preferenceId,
          form_id: req.params.formId,
        },
      });

      if (!preference) {
        return res.status(404).json({ error: "Preference not found" });
      }

      await preference.destroy();
      res.json({ message: "Preference deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Add company to preference
  async addCompanyToPreference(req, res) {
    try {
      const { companyId } = req.body;

      // Check if company exists
      const company = await Company.findByPk(companyId);
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }

      // Check if already added
      const existing = await PreferenceCompany.findOne({
        where: {
          preference_id: req.params.preferenceId,
          company_id: companyId,
        },
      });

      if (existing) {
        return res
          .status(400)
          .json({ error: "Company already added to this preference" });
      }

      const preferenceCompany = await PreferenceCompany.create({
        preference_id: req.params.preferenceId,
        company_id: companyId,
      });

      res.status(201).json(preferenceCompany);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Remove company from preference
  async removeCompanyFromPreference(req, res) {
    try {
      const preferenceCompany = await PreferenceCompany.findOne({
        where: {
          preference_id: req.params.preferenceId,
          company_id: req.params.companyId,
        },
      });

      if (!preferenceCompany) {
        return res
          .status(404)
          .json({ error: "Company not found in this preference" });
      }

      await preferenceCompany.destroy();
      res.json({ message: "Company removed from preference" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Student submits preferences
  async submitPreferences(req, res) {
    try {
      const { studentId, selections } = req.body; // selections: [{preferenceId, companyId}]
      const form = await PreferenceForm.findByPk(req.params.formId);

      if (!form) {
        return res.status(404).json({ error: "Form not found" });
      }

      // Check if deadline has passed
      if (new Date() > new Date(form.deadline)) {
        return res
          .status(400)
          .json({ error: "Submission deadline has passed" });
      }

      // Validate selections
      const preferences = await Preference.findAll({
        where: { form_id: form.id },
        include: [Company],
      });

      // Check all preferences are covered
      if (preferences.length !== selections.length) {
        return res
          .status(400)
          .json({ error: "Must select one company for each preference" });
      }

      // Validate each selection
      for (const selection of selections) {
        const preference = preferences.find(
          (p) => p.id === selection.preferenceId
        );
        if (!preference) {
          return res.status(400).json({
            error: `Invalid preference ID: ${selection.preferenceId}`,
          });
        }

        const companyExists = preference.Companies.some(
          (c) => c.id === selection.companyId
        );
        if (!companyExists) {
          return res.status(400).json({
            error: `Company ${selection.companyId} not available for preference ${selection.preferenceId}`,
          });
        }
      }

      // Here you would typically save the student's selections to the database
      // For example, create records in a StudentPreference model
      // await StudentPreference.bulkCreate(selections.map(s => ({
      //   student_id: studentId,
      //   preference_id: s.preferenceId,
      //   company_id: s.companyId,
      //   form_id: form.id
      // })));

      res.json({ message: "Preferences submitted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
