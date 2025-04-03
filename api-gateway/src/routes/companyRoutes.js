const express = require("express");
const router = express.Router();
const companyController = require("../controllers/companyController");

router.get("/", companyController.getAllCompanies);
router.get("/:id", companyController.getCompany);
router.post("/", companyController.createCompany);
router.put("/:id", companyController.updateCompany);
router.delete("/:id", companyController.deleteCompany);

router.get("/list/names", companyController.getCompanyNames);
router.get("/search", companyController.searchCompanies);

module.exports = router;
