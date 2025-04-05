const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const path = require("path");
const exphbs = require("nodemailer-express-handlebars");

// Configure transporter with pooling
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  maxConnections: 5,
  maxMessages: 100,
  rateLimit: 10,
  pool: true,
});

// Configure templates
transporter.use(
  "compile",
  exphbs({
    viewEngine: {
      extname: ".hbs",
      layoutsDir: path.join(__dirname, "../views/emails"),
      defaultLayout: "template",
      partialsDir: path.join(__dirname, "../views/emails/partials"),
    },
    viewPath: path.join(__dirname, "../views/emails"),
    extName: ".hbs",
  })
);

router.post("/send-email", async (req, res) => {
  const { to, cc, bcc, companyId, companyName, studentIds } = req.body;

  try {
    const students = await StudentModel.find({ _id: { $in: studentIds } });

    // 1. Send to company
    await transporter.sendMail({
      from: '"University of Ruhuna" <noreply@ruh.ac.lk>',
      to,
      cc,
      bcc,
      subject: "Student CVs from University of Ruhuna",
      template: "company-notification",
      context: {
        companyName,
        students: students.map((s) => ({
          name: s.name,
          scNumber: s.scNumber,
          gpa: s.gpa,
        })),
      },
    });

    // 2. Send to students
    for (const student of students) {
      if (student.email) {
        await transporter.sendMail({
          from: '"University of Ruhuna" <noreply@ruh.ac.lk>',
          to: student.email,
          subject: `Your CV shared with ${companyName}`,
          template: "student-notification",
          context: {
            studentName: student.name,
            companyName,
            date: new Date().toLocaleDateString(),
          },
        });
      }
    }

    // 3. Send to admin
    await transporter.sendMail({
      from: '"University of Ruhuna" <noreply@ruh.ac.lk>',
      to: "admin@ruh.ac.lk",
      subject: `[Notification] CVs shared with ${companyName}`,
      template: "admin-notification",
      context: {
        companyName,
        studentCount: students.length,
        date: new Date().toLocaleDateString(),
      },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({
      error: "Failed to send some emails",
      details: error.message,
    });
  }
});

module.exports = router;
