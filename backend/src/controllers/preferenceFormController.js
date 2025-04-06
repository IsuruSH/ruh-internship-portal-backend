// controllers/preferenceFormController.js
const {
  PreferenceForm,
  Preference,
  PreferenceCompany,
  Company,
  StudentPreference,
  Student,
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
      res.json({ forms });
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
      const { batch, instructions, deadline, preferences } = req.body;
      const form = await PreferenceForm.findByPk(req.params.id);

      if (!form) {
        return res.status(404).json({ error: "Form not found" });
      }

      await form.update({ batch, instructions, deadline });

      // Delete existing preferences
      await Preference.destroy({ where: { form_id: form.id } });

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
      res.status(200).json(form);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get form by batch
  async getFormByBatch(req, res) {
    try {
      const batch = req.query.batch;
      const forms = await PreferenceForm.findOne({
        where: { batch: batch },
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
      if (!forms) {
        return res.status(404).json({ error: "Form not found" });
      }
      res.json({ forms });
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
      const { student_id, preferences } = req.body;
      const form = await PreferenceForm.findByPk(req.params.formId);

      if (!form) {
        return res.status(404).json({ error: "Form not found" });
      }

      if (new Date() > new Date(form.deadline)) {
        return res.status(400).json({
          error: "Submission deadline has passed",
          deadline: form.deadline,
        });
      }

      // Get all valid preferences for this form
      const formPreferences = await Preference.findAll({
        where: { form_id: form.id },
        include: [
          {
            model: Company,
            through: { attributes: [] }, // Exclude join table attributes
          },
        ],
      });

      // Check if all required preferences are covered
      if (formPreferences.length !== preferences.length) {
        return res.status(400).json({
          error: "Must select one company for each preference",
          requiredPreferences: formPreferences.map((p) => ({
            id: p.id,
            name: p.name,
          })),
        });
      }

      // Validate each selection
      const invalidPreferences = [];
      const invalidCompanies = [];

      for (const selection of preferences) {
        const validPreference = formPreferences.find(
          (p) => p.id === selection.preference_id
        );

        if (!validPreference) {
          invalidPreferences.push(selection.preference_id);
          continue;
        }

        const validCompany = validPreference.Companies.some(
          (c) => c.id === selection.company_id
        );

        if (!validCompany) {
          invalidCompanies.push({
            preferenceId: selection.preference_id,
            companyId: selection.company_id,
            validCompanyIds: validPreference.Companies.map((c) => c.id),
          });
        }
      }

      if (invalidPreferences.length > 0 || invalidCompanies.length > 0) {
        return res.status(400).json({
          error: "Invalid selections",
          ...(invalidPreferences.length > 0 && {
            invalidPreferences,
            validPreferenceIds: formPreferences.map((p) => p.id),
          }),
          ...(invalidCompanies.length > 0 && {
            invalidCompanies,
          }),
        });
      }

      // Delete existing submissions for this student+form combination
      await StudentPreference.destroy({
        where: {
          student_fkid: student_id,
          form_id: form.id,
        },
      });

      // Create new submissions
      await StudentPreference.bulkCreate(
        preferences.map((selection) => ({
          student_fkid: student_id,
          form_id: form.id,
          preference_id: selection.preference_id,
          company_id: selection.company_id,
          submitted_at: new Date(),
        }))
      );

      res.status(200).json({
        message: "Preferences submitted successfully",
        data: {
          formId: form.id,
          studentId: student_id,
          submittedAt: new Date(),
          preferences: preferences.map((p) => ({
            preferenceId: p.preference_id,
            companyId: p.company_id,
          })),
        },
      });
    } catch (error) {
      console.error("Error submitting preferences:", error);
      res.status(500).json({
        error: "Failed to submit preferences",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Add this to your form controller
  async checkSubmission(req, res) {
    try {
      const { student_id, form_id } = req.query;

      const studentId = parseInt(student_id);
      const formId = parseInt(form_id);

      const submission = await StudentPreference.findOne({
        where: {
          student_fkid: studentId,
          form_id: formId,
        },
      });

      if (!submission) {
        return res.json({ submitted: false });
      }

      // Get all preferences for this submission
      const preferences = await StudentPreference.findAll({
        where: {
          student_fkid: studentId,
          form_id: formId,
        },
        attributes: ["preference_id", "company_id"],
      });

      res.json({
        submitted: true,
        preferences: preferences.map((p) => ({
          preference_id: p.preference_id,
          company_id: p.company_id,
        })),
      });
    } catch (error) {
      console.error("Error in checkSubmission:", error);
      res.status(500).json({
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  },

  // Get all submissions
  async getAllSubmissions(req, res) {
    try {
      const { form_id } = req.query;

      const submissions = await StudentPreference.findAll({
        where: { form_id },
        include: [
          {
            model: Preference,
            attributes: ["id", "name"],
          },
          {
            model: Company,
            attributes: ["id", "name"],
          },
          {
            model: Student, // Include Student model to get student details
            attributes: [
              "student_id",
              "first_name",
              "last_name",
              "gpa",
              "cvLink",
            ],
          },
        ],
      });

      // Group submissions by student
      const studentsMap = new Map();

      submissions.forEach((submission) => {
        const studentId = submission.student_fkid;
        if (!studentsMap.has(studentId)) {
          const student = submission.Student;
          studentsMap.set(studentId, {
            id: studentId,
            name: `${student.first_name} ${student.last_name}`, // Combine first and last name
            scNumber: student.student_id, // Use student_id as scNumber
            gpa: student.gpa,
            cvLink: student.cvLink,
            companyIds: [],
          });
        }
        // Push company IDs (avoid duplicates if needed)
        if (submission.company_id) {
          studentsMap.get(studentId).companyIds.push(submission.company_id);
        }
      });

      // Convert Map to array
      const initialStudents = Array.from(studentsMap.values());

      res.json({ initialStudents });
    } catch (error) {
      console.error("Error fetching submissions:", error);
      res.status(500).json({
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  },

  async getFormCompanies(req, res) {
    try {
      const { form_id } = req.query;

      // Direct query to fetch companies linked to the form_id
      const companies = await Company.findAll({
        include: [
          {
            model: PreferenceCompany,
            required: true, // Ensures INNER JOIN (only companies with preferences)
            include: [
              {
                model: Preference,
                where: { form_id }, // Filter by the given form_id
                attributes: [], // Exclude Preference fields from results
              },
            ],
            attributes: [], // Exclude PreferenceCompany fields from results
          },
        ],
        attributes: ["id", "name", "email"], // Only return these company fields
      });

      // Format the result to match your desired structure
      const initialCompanies = companies.map((company) => ({
        id: company.id,
        name: company.name,
        email: company.email,
      }));

      res.json({ initialCompanies });
    } catch (error) {
      console.error("Error fetching companies:", error);
      res.status(500).json({
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  },

  //Get only batch field data from preference form table
  async getBatch(req, res) {
    try {
      const form = await PreferenceForm.findAll({
        attributes: ["batch"],
        raw: true, // Ensures only raw data is returned
      });
      const batches = form.map((batch) => batch.batch); // Extract batch values into an array
      res.json(batches);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
