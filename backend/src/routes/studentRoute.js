const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");

const studentController = require("../controllers/studentController");
const resultsController = require("../controllers/resultsController");

router.get("/", studentController.getAllStudents);
router.get("/:id", studentController.getStudent);
// router.post("/", studentController.createStudent);
router.put(
  "/:id",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "cvLink", maxCount: 1 },
  ]),
  studentController.updateStudent
);
router.delete("/:id", studentController.deleteStudent);

module.exports = router;
