const { Student } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    const student = await Student.findByPk(req.params.id, {
      attributes: ["id", "student_id", "email", "first_login", "academic_year"], // Replace with the attributes you want to send
    });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createStudent = async (req, res) => {
  try {
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
    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    await student.update({ ...req.body, first_login: false });
    res.json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
      return res.status(401).json({ login: false });
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
