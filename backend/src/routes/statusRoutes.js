const express = require("express");
const router = express.Router();
const statusController = require("../controllers/statusController");

// Get full status timeline
router.get("/:id", statusController.getStudentStatus);

// Get only current status
router.get("/current", statusController.getCurrentStatus);

// Add new status
router.post("/", statusController.addStatus);

router.post("/update-status/:id", statusController.updateStatus);

// Update company details
router.post("/company/:id", statusController.addCompanyDetails);

module.exports = router;
