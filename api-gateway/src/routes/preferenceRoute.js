const express = require("express");
const router = express.Router();
const preferenceController = require("../controllers/preferenceController");

router.get("/", preferenceController.getAllPreferenceForms);
router.get("/:id", preferenceController.getPreferenceForm);
router.post("/", preferenceController.createPreferenceForm);
router.put("/:id", preferenceController.updatePreferenceForm);
router.delete("/:id", preferenceController.deletePreferenceForm);
router.get("/batch/:batch", preferenceController.getPreferenceFormByBatch);

module.exports = router;
