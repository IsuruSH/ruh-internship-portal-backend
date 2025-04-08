const express = require("express");
const router = express.Router();
const statsController = require("../controllers/statsController");

router.get("/dashboardcount", statsController.dashboardCountByBatch);
router.get("/getbatchstudentdetails", statsController.getBatchStudentDetails);
router.get("/getbatchstatistics", statsController.getBatchStatistics);

module.exports = router;
