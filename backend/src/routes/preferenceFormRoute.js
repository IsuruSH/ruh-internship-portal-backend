// routes/preferenceFormRoute.js
const express = require("express");
const router = express.Router();
const preferenceFormController = require("../controllers/preferenceFormController");
//const validate = require("../middleware/validate");

// Admin routes
router.post("/", preferenceFormController.createForm);
router.get("/", preferenceFormController.getAllForms);
router.get("/:id", preferenceFormController.getFormById);
router.put("/:id", preferenceFormController.updateForm);
router.delete("/:id", preferenceFormController.deleteForm);

// Get form by batch
router.get("/batch/batch", preferenceFormController.getFormByBatch);

// Preference management
router.post("/:formId/preferences", preferenceFormController.addPreference);
router.put(
  "/:formId/preferences/:preferenceId",
  preferenceFormController.updatePreference
);
router.delete(
  "/:formId/preferences/:preferenceId",
  preferenceFormController.deletePreference
);

// Company management for preferences
router.post(
  "/:formId/preferences/:preferenceId/companies",
  preferenceFormController.addCompanyToPreference
);
router.delete(
  "/:formId/preferences/:preferenceId/companies/:companyId",
  preferenceFormController.removeCompanyFromPreference
);

// Student submission
router.post("/:formId/submit", preferenceFormController.submitPreferences);

router.get("/submission/check", preferenceFormController.checkSubmission);
router.get("/submission/students", preferenceFormController.getAllSubmissions);
router.get("/submission/companies", preferenceFormController.getFormCompanies);

//get batches
router.get("/batch/batches", preferenceFormController.getBatch);

module.exports = router;
