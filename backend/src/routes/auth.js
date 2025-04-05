// login and signup routes
const express = require("express");

const router = express.Router();

const studentController = require("../controllers/studentController");
const adminController = require("../controllers/adminController");
const verifyToken = require("../middleware/validate");

router.post("/signup/student", studentController.createStudent);
router.post("/login/student", studentController.loginStudent);
router.get("/student/verify-token", verifyToken, (req, res) => {
  res.status(200).json({ authenticated: true, user: req.user });
});

router.post("/login/admin", adminController.loginAdmin);
router.get("/admin/verify-token", verifyToken, (req, res) => {
  res.status(200).json({ authenticated: true, user: req.user });
});

router.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token"); // If using cookies for auth
    res.clearCookie("adminToken"); // If using cookies
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
