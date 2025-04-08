const { Notice } = require("../models");

// Create a new notice
exports.createNotice = async (req, res) => {
  try {
    const { topic, content, isImportant, expiresAt } = req.body;

    const notice = await Notice.create({
      topic,
      content,
      isImportant: isImportant || false,
      expiresAt: expiresAt || null,
    });

    res.status(201).json({
      message: "Notice created successfully",
      notice,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all notices
exports.getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.findAll({
      order: [
        ["isImportant", "DESC"],
        ["createdAt", "DESC"],
      ],
    });
    res.status(200).json({ notices });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get active notices (not expired)
exports.getActiveNotices = async (req, res) => {
  try {
    const notices = await Notice.findAll({
      where: {
        [Op.or]: [{ expiresAt: null }, { expiresAt: { [Op.gt]: new Date() } }],
      },
      order: [
        ["isImportant", "DESC"],
        ["createdAt", "DESC"],
      ],
    });
    res.status(200).json({ notices });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get notice by ID
exports.getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findByPk(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }
    res.json(notice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update notice
exports.updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findByPk(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    const { topic, content, isImportant, expiresAt } = req.body;

    await notice.update({
      topic: topic || notice.topic,
      content: content || notice.content,
      isImportant: isImportant !== undefined ? isImportant : notice.isImportant,
      expiresAt: expiresAt !== undefined ? expiresAt : notice.expiresAt,
    });

    res.json({
      message: "Notice updated successfully",
      notice,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete notice (soft delete)
exports.deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByPk(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    await notice.destroy();
    res.status(200).json({ message: "Notice deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Restore soft-deleted notice
exports.restoreNotice = async (req, res) => {
  try {
    const notice = await Notice.findOne({
      where: { id: req.params.id },
      paranoid: false,
    });

    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    await notice.restore();
    res.json({ message: "Notice restored successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get important notices
exports.getImportantNotices = async (req, res) => {
  try {
    const notices = await Notice.findAll({
      where: { isImportant: true },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ notices });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
