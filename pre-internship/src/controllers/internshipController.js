const Internship = require('../models/Internship');

exports.getAllInternships = async (req, res) => {
  try {
    const internships = await Internship.findAll();
    res.json(internships);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getInternship = async (req, res) => {
  try {
    const internship = await Internship.findByPk(req.params.id);
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }
    res.json(internship);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createInternship = async (req, res) => {
  try {
    const internship = await Internship.create(req.body);
    res.status(201).json(internship);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateInternship = async (req, res) => {
  try {
    const internship = await Internship.findByPk(req.params.id);
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }
    await internship.update(req.body);
    res.json(internship);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findByPk(req.params.id);
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }
    await internship.destroy();
    res.json({ message: 'Internship deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};