//getting all the stats
const { InternshipStatus, CompanySupervisor, Student } = require("../models");
const { Op } = require("sequelize");
const { calculateStatusPercentages } = require("../util/statusCalculator.js");

// Get all the student details of a batch
exports.getBatchStudentDetails = async (req, res) => {
  try {
    const { batch } = req.query;

    const students = await Student.findAll({
      where: { academic_year: batch },
      attributes: {
        exclude: [
          "password",
          "createdAt",
          "updatedAt",
          "cvLink",
          "first_login",
          "profileImage",
          "contact_number",
          "address",
        ],
      },
      include: [
        {
          model: InternshipStatus,
          order: [["date_achieved", "DESC"]],
          limit: 1,
          required: false,
        },
      ],
    });

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.dashboardCountByBatch = async (req, res) => {
  try {
    const { batch } = req.query;

    const studentsCount = await Student.count({
      where: { academic_year: batch },
    });

    const messagesCount = 0; // Placeholder for messages count, implement as needed
    const internshipsCount = 0;

    res.status(200).json({ studentsCount, messagesCount, internshipsCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// In your backend controller
exports.getBatchStatistics = async (req, res) => {
  try {
    const { batch } = req.query;

    // Get total student count
    const studentsCount = await Student.count({
      where: { academic_year: batch },
    });

    // Get all students with their latest status
    const students = await Student.findAll({
      where: { academic_year: batch },
      attributes: ["id"],
      include: [
        {
          model: InternshipStatus,
          order: [["date_achieved", "DESC"]],
          limit: 1,
          required: false,
        },
      ],
    });

    // Calculate status percentages
    const statusPercentages = calculateStatusPercentages(students);

    res.json({
      studentsCount,
      statusPercentages,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
