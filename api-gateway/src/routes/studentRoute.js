const express = require("express");
const router = express.Router();
const validate = require("../middleware/validate");

const studentController = require("../controllers/studentController");

router.get("/", validate, studentController.getAllStudents);
router.get("/:id", studentController.getStudent);
// router.post("/", studentController.createStudent);
router.put("/:id", studentController.updateStudent);
router.delete("/:id", studentController.deleteStudent);

module.exports = router;
