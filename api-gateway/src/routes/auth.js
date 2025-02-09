// login and signup routes
const express = require("express");

const router = express.Router();

const studentController = require("../controllers/studentController");

router.post("/signup/student", studentController.createStudent);
router.post("/login/student", studentController.loginStudent);

module.exports = router;
