const express = require("express");
const router = express.Router();
const statsController = require("../controllers/statsController");

router.get("/dashboardcount", statsController.dashboardCountByBatch);

module.exports = router;
