// controllers/statusController.js
const { InternshipStatus, CompanySupervisor } = require("../models");

// Get current status timeline and company details
exports.getStudentStatus = async (req, res) => {
  try {
    const studentId = req.params.id;

    const statusTimeline = await InternshipStatus.findAll({
      where: { student_id: studentId },
      order: [["date_achieved", "ASC"]],
    });

    const companyDetails = await CompanySupervisor.findOne({
      where: { student_id: studentId },
    });

    res.status(200).json({
      statusTimeline,
      companyDetails: companyDetails
        ? {
            name: companyDetails.name,
            supervisorEmail: companyDetails.supervisorEmail,
            supervisorPhone: companyDetails.supervisorPhone,
            supervisorName: companyDetails.supervisorName,
          }
        : null,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add new status to timeline
exports.addStatus = async (req, res) => {
  try {
    const studentId = req.user.student_id;
    const { status } = req.body;

    const validStatuses = [
      "application_submitted",
      "interview_invitation",
      "interview_completed",
      "selection_decision",
      "internship_started",
      "internship_completed",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const newStatus = await InternshipStatus.create({
      student_id: studentId,
      status,
      date_achieved: new Date(),
    });

    res.status(201).json(newStatus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get current status (latest)
exports.getCurrentStatus = async (req, res) => {
  try {
    const studentId = req.user.student_id;

    const currentStatus = await InternshipStatus.findOne({
      where: { student_id: studentId },
      order: [["date_achieved", "DESC"]],
      limit: 1,
    });

    res.status(200).json(currentStatus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// controllers/statusController.js
exports.updateStatus = async (req, res) => {
  try {
    const studentId = req.params.id;
    const { status } = req.body;

    const updatedStatus = await InternshipStatus.findOne({
      where: { student_id: studentId },
    });

    // if (!updatedStatus) {
    //   return res.status(404).json({ error: "Status not found" });
    // }

    // Validate status
    const validStatuses = [
      "application_submitted",
      "interview_invitation",
      "interview_completed",
      "selection_decision",
      "internship_started",
      "internship_completed",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: "Invalid status",
        validStatuses, // Sending back valid options can help frontend debugging
      });
    }

    // Create new status record
    const newStatus = await InternshipStatus.create({
      student_id: studentId,
      status,
      date_achieved: new Date(),
    });

    // If this is a "selection_decision" status, expect company details
    if (status === "selection_decision") {
      return res.status(200).json({
        message: "Status updated. Please provide company details.",
        status: newStatus,
        requiresCompanyDetails: true,
      });
    }

    res.status(200).json({
      message: `${status} status updated successfully`,
      status: newStatus,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to update status",
      details: error.message,
    });
  }
};

//add new company details
exports.addCompanyDetails = async (req, res) => {
  try {
    const studentId = req.params.id;
    const { name, supervisorName, supervisorEmail, supervisorPhone } = req.body;

    // Validate required fields
    if (!name || !supervisorEmail || !supervisorPhone) {
      return res.status(400).json({
        error: "Company name, supervisor email and phone are required",
      });
    }

    // Check if record exists
    const existingRecord = await CompanySupervisor.findOne({
      where: { student_id: studentId },
    });

    let companyDetails;

    if (existingRecord) {
      // Update existing record
      companyDetails = await CompanySupervisor.update(
        {
          name: name,
          supervisorName: supervisorName || null,
          supervisorEmail: supervisorEmail,
          supervisorPhone: supervisorPhone,
        },
        {
          where: { student_id: studentId },
          returning: true,
          plain: true,
        }
      );
      companyDetails = companyDetails[1]; // Get the updated record
    } else {
      // Create new record
      companyDetails = await CompanySupervisor.create({
        student_id: studentId,
        name: name,
        supervisorName: supervisorName || null,
        supervisorEmail: supervisorEmail,
        supervisorPhone: supervisorPhone,
      });
    }

    res.status(200).json({
      message: existingRecord
        ? "Company details updated successfully"
        : "Company details created successfully",
      companyDetails,
    });
  } catch (error) {
    console.error("Error saving company details:", error);
    res.status(500).json({
      error: "Failed to save company details",
      details: error.message,
    });
  }
};
