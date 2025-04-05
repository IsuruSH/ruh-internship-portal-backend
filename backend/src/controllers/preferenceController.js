const preference = require("../models/Preference");
const PreferenceForm = require("../models/PreferenceForm");

exports.getAllPreferenceForms = async (req, res) => {
  try {
    const preferenceForms = await PreferenceForm.findAll();
    res.status(200).json({ preferenceForms });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPreferenceForm = async (req, res) => {
  try {
    const preferenceForm = await PreferenceForm.findByPk(req.params.id);
    if (!preferenceForm) {
      return res.status(404).json({ message: "Preference Form not found" });
    }
    res.json(preferenceForm);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createPreferenceForm = async (req, res) => {
  try {
    const preferenceForm = await PreferenceForm.create(req.body);
    res.status(201).json({ message: "Preference Form created successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updatePreferenceForm = async (req, res) => {
  try {
    const preferenceForm = await PreferenceForm.findByPk(req.params.id);
    if (!preferenceForm) {
      return res.status(404).json({ message: "Preference Form not found" });
    }
    await preferenceForm.update(req.body);
    res.json(preferenceForm);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deletePreferenceForm = async (req, res) => {
  try {
    const preferenceForm = await PreferenceForm.findByPk(req.params.id);
    if (!preferenceForm) {
      return res.status(404).json({ message: "Preference Form not found" });
    }
    await preferenceForm.destroy();
    res.status(200).json({ message: "Preference Form deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPreferenceFormByBatch = async (req, res) => {
  try {
    const { batch } = req.query;
    const preferenceForms = await PreferenceForm.findAll({
      where: { batch },
      include: [{ model: preference, as: "preferences" }],
    });
    if (!preferenceForms.length) {
      return res
        .status(404)
        .json({ message: "No Preference Forms found for this batch" });
    }
    res.json(preferenceForms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
