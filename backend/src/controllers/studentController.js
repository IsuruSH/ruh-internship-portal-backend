const { Student, StudentCVText } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { getStudentResultsByYear } = require("./resultsController");
const { Op } = require("sequelize");
const CVParser = require("../services/cvParser");

const deleteFileIfExists = (fileUrl) => {
  if (!fileUrl) return;

  const filePath = path.join(
    __dirname,
    "../../",
    fileUrl.replace(/^.*\/uploads\//, "uploads/")
  );

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`Deleted old file: ${filePath}`);
  }
};

exports.getAllStudents = async (req, res) => {
  console.log(req.user);
  try {
    const students = await Student.findAll();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStudent = async (req, res) => {
  try {
    const resstudent = await Student.findByPk(req.params.id, {
      attributes: {
        exclude: ["password", "updatedAt"], // Attributes to exclude
      }, // Replace with the attributes you want to send
    });
    if (!resstudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    let resultsByYear;
    try {
      resultsByYear = await getStudentResultsByYear(resstudent.student_id);
    } catch (error) {
      console.error("Error fetching results by year:", error);
      resultsByYear = [];
    }

    const student = resstudent.get({ plain: true });
    student.resultsByYear = resultsByYear;

    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStudentRecommendations = async (req, res) => {
  try {
    const resstudent = await Student.findByPk(req.params.id, {
      attributes: ["id", "student_id"], // only what you need
    });

    if (!resstudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    let resultsByYear;
    try {
      resultsByYear = await getStudentResultsByYear(resstudent.student_id);
    } catch (error) {
      console.error("Error fetching results by year:", error);
      resultsByYear = [];
    }

    const cvText = await StudentCVText.findOne({
      where: { student_id: resstudent.id },
    });

    const student = resstudent.get({ plain: true });

    if (cvText?.text) {
      try {
        const recommendationResponse = await fetch(
          `${process.env.RECOMMENDATION_SERVER_URL}/recommend`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              resultsByYear: resultsByYear,
              cv_text: cvText.text,
            }),
          }
        );

        const recommendationData = await recommendationResponse.json();
        student.recommendations = recommendationData;
      } catch (apiError) {
        console.error("Recommendation API error:", apiError);
        student.recommendations = null;
      }
    } else {
      student.recommendations = null;
    }

    res.json(student);
  } catch (error) {
    console.error("Error fetching student recommendations:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.createStudent = async (req, res) => {
  try {
    // Check if student with the same email already exists
    const existingStudent = await Student.findOne({
      where: {
        [Op.or]: [
          { email: req.body.email },
          { student_id: req.body.student_id },
        ],
      },
    });

    if (existingStudent) {
      // Determine which field caused the conflict
      const conflictField =
        existingStudent.email === req.body.email ? "Email" : "Student ID";
      return res.status(400).json({
        message: `${conflictField} already exists`,
      });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const student = await Student.create({
      ...req.body,
      password: hashedPassword,
    });
    res.status(200).json({ message: "Student created successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const st_id = req.params.id;
    const student = await Student.findByPk(st_id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const dataToUpdate = { ...req.body, first_login: false };

    if (req.files?.profileImage) {
      const image = req.files.profileImage[0];

      // Delete old profile image
      if (student.profileImage) {
        deleteFileIfExists(student.profileImage);
      }

      dataToUpdate.profileImage = `/uploads/profile/${image.filename}`;
    }

    if (req.files?.cvLink) {
      const cv = req.files.cvLink[0];

      if (!cv.mimetype.includes("pdf")) {
        return res
          .status(400)
          .json({ error: "Only PDF files are allowed for CV" });
      }

      const fileBuffer = fs.readFileSync(cv.path);
      const text = await CVParser.extractTextFromBuffer(
        fileBuffer,
        cv.originalname
      );
      const cleanedText = CVParser.cleanText(text);

      // Check if CV text already exists for this student
      const existingCVText = await StudentCVText.findOne({
        where: { student_id: st_id },
      });

      if (existingCVText) {
        // Update existing record
        await existingCVText.update({
          text: cleanedText,
          updatedAt: new Date(), // Ensure updatedAt is refreshed
        });
        console.log("Updated existing CV text record");
      } else {
        // Create new record
        await StudentCVText.create({
          student_id: st_id,
          text: cleanedText,
        });
        console.log("Created new CV text record");
      }

      // Delete old CV
      if (student.cvLink) {
        deleteFileIfExists(student.cvLink);
      }

      dataToUpdate.cvLink = `/uploads/cv/${cv.filename}`;
    }

    await student.update(dataToUpdate);

    res.json({
      message: "Student updated successfully",
      profileImage: dataToUpdate.profileImage,
      cvLink: dataToUpdate.cvLink,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed", details: error.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    await student.destroy();
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginStudent = async (req, res) => {
  try {
    const student = await Student.findOne({
      where: { email: req.body.email },
    });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    const valid = await bcrypt.compare(req.body.password, student.password);
    if (!valid) {
      return res
        .status(401)
        .json({ login: false, message: "Invalid password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      {
        id: student.id,
        email: student.email,
        name: student.first_name,
        student_id: student.student_id,
        batch: student.academic_year,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("token", token, {
      // httpOnly: true,
      // secure: process.env.NODE_ENV === "production", // Set true in production
      sameSite: "Lax", //Allows cross-origin navigation with cookies
      domain: "localhost", // Set the domain to localhost
      maxAge: 3600000, // 1 hour
    });

    return res.status(200).json({ login: true, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.logoutStudent = async (req, res) => {
  try {
    res.clearCookie("token"); // If using cookies for auth
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
