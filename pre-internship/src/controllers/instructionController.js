const Instruction = require('../models/Instruction');

exports.getAllInstructions = async (req, res) => {
  try {
    const instructions = await Instruction.findAll();
    res.json(instructions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getInstruction = async (req, res) => {
  try {
    const instruction = await Instruction.findByPk(req.params.id);
    if (!instruction) {
      return res.status(404).json({ message: 'Instruction not found' });
    }
    res.json(instruction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createInstruction = async (req, res) => {
  try {
    const instruction = await Instruction.create(req.body);
    res.status(201).json(instruction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateInstruction = async (req, res) => {
  try {
    const instruction = await Instruction.findByPk(req.params.id);
    if (!instruction) {
      return res.status(404).json({ message: 'Instruction not found' });
    }
    await instruction.update(req.body);
    res.json(instruction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteInstruction = async (req, res) => {
  try {
    const instruction = await Instruction.findByPk(req.params.id);
    if (!instruction) {
      return res.status(404).json({ message: 'Instruction not found' });
    }
    await instruction.destroy();
    res.json({ message: 'Instruction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};