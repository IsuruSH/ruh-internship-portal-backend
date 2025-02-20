const Company = require("../models/Company");

exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll();
    res.status(200).json({ companies });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCompany = async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCompany = async (req, res) => {
  console.log(req.body);
  try {
    const company = await Company.create(req.body);
    res.status(201).json({ message: "Company created successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    await company.update(req.body);
    res.json(company);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    await company.destroy();
    res.json({ message: "Company deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCompanyNames = async (req, res) => {
  console.log(req);
  try {
    const companies = await Company.findAll({
      attributes: ["name"],
    });

    const companyNames = companies.map((company) => company.name);

    res.json(companyNames);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
