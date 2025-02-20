const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll();
    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.params.id, {
      attributes: ["id", "username", "email"],
    });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const admin = await Admin.create({
      ...req.body,
      password: hashedPassword,
    });
    res.status(200).json({ message: "Admin created successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    await admin.update(req.body);
    res.json(admin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    await admin.destroy();
    res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const admin = await Admin.findOne({ where: { email: req.body.email } });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    const valid = await bcrypt.compare(req.body.password, admin.password);
    if (!valid) {
      return res.status(401).json({ login: false });
    }

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        username: admin.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("adminToken", token, {
      sameSite: "Lax",
      domain: "localhost",
      maxAge: 3600000,
    });
    return res.status(200).json({ login: true, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.logoutAdmin = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
