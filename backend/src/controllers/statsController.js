//getting all the stats
const { InternshipStatus, CompanySupervisor, Student } = require("../models");
const { Op } = require("sequelize");

// Get all the student details of a batch
exports.getBatchStudentDetails = async (req, res) => {
  try {
    const batchId = req.params.batchId;

    const students = await Student.findAll({
      where: { academic_year: batchId },
      include: [
        {
          model: InternshipStatus,
          as: "statusTimeline",
          required: false,
        },
        {
          model: CompanySupervisor,
          as: "companyDetails",
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
