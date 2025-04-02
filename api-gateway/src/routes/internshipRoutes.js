const express = require("express");
const router = express.Router();
const internshipController = require("../controllers/internshipController");

router.get("/", internshipController.getAllInternships);
router.get("/:id", internshipController.getInternship);
router.post("/", internshipController.createInternship);
router.put("/:id", internshipController.updateInternship);
router.delete("/:id", internshipController.deleteInternship);

module.exports = router;
