const Internship = require("../models/Internship");
const Company = require("../models/Company");

exports.getAllInternships = async (req, res) => {
  try {
    const internships = await Internship.findAll({
      include: {
        model: Company,
        attributes: ["name"], // Fetch only company ID and name
      },
    });
    res.status(200).json({ internships });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getInternship = async (req, res) => {
  try {
    const internship = await Internship.findByPk(req.params.id, {
      include: Company,
    });
    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }
    res.json(internship);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createInternship = async (req, res) => {
  try {
    const company = await Company.findByPk(req.body.companyId);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }
    const internship = await Internship.create(req.body);
    res.status(201).json({ message: "Internship created successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateInternship = async (req, res) => {
  try {
    const internship = await Internship.findByPk(req.params.id);
    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }
    await internship.update(req.body);
    res.status(200).json({ message: "Internship updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findByPk(req.params.id);
    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }
    await internship.destroy();
    res.status(200).json({ message: "Internship deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
