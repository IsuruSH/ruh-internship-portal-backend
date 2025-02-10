const Student = require("../models/Student");
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
    const student = await Student.findByPk(req.params.id);
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
    res.status(201).json(student);
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
    await student.update(req.body);
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
      { id: student.student_id, email: student.email },
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

    return res.status(200).json({ login: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
