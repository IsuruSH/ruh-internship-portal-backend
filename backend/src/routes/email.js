const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const path = require("path");
let exphbs;
import("nodemailer-express-handlebars")
  .then((module) => {
    exphbs = module.default;
  })
  .catch((err) => console.error(err));
const archiver = require("archiver");
const fs = require("fs");
const os = require("os");
const { Student } = require("../models");

// Configure transporter with pooling
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // maxConnections: 5,
  // maxMessages: 100,
  // rateLimit: 10,
  pool: true,
});

// Configure templates
async function configureEmailTemplates() {
  try {
    const exphbs = (await import("nodemailer-express-handlebars")).default;

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
  } catch (err) {
    console.error("Failed to configure email templates:", err);
  }
}

// Call the async configuration
configureEmailTemplates();

router.post("/send-email", async (req, res) => {
  const { to, cc, bcc, companyId, companyName, studentIds } = req.body;

  try {
    // 1. Get students with email addresses
    const students = await Student.findAll({
      where: { id: studentIds },
      attributes: ["id", "cvLink", "first_name", "last_name", "email"],
      raw: true,
    });

    // 2. Create ZIP
    const zipFileName = `${companyName.replace(/\s+/g, "_")}_Student_CVs.zip`;
    const zipFilePath = path.join(os.tmpdir(), zipFileName);

    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver("zip", {
      zlib: { level: 6 },
      highWaterMark: 1024 * 1024,
    });

    archive.pipe(output);

    // 3. Process files and collect valid students
    const validStudents = [];
    await Promise.all(
      students.map(async (student) => {
        if (!student.cvLink) return;

        try {
          const cvPath = path.join(
            process.cwd(),
            student.cvLink.replace(/^\//, "")
          );

          if (fs.existsSync(cvPath)) {
            const fileName = `${student.first_name}_${student.last_name}${
              path.extname(student.cvLink) || ".pdf"
            }`;

            archive.append(fs.createReadStream(cvPath), { name: fileName });
            validStudents.push(student);
          }
        } catch (err) {
          console.error(`Skipping ${student.first_name}:`, err);
        }
      })
    );

    // Check if we have any valid CVs
    if (validStudents.length === 0) {
      return res.status(400).json({
        error: "No valid CVs found to send",
      });
    }

    // Finalize ZIP
    let resolve, reject;
    const finishPromise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    output.once("finish", resolve);
    output.once("error", reject);
    await archive.finalize();
    await finishPromise;

    // 4. Send email to company
    await transporter.sendMail({
      from: '"University of Ruhuna Internship Office" <internships@ruh.ac.lk>',
      to,
      cc,
      bcc,
      subject: `Student CVs for ${companyName}`,
      template: "company-notification",
      context: {
        companyName,
        students: validStudents.map((s) => ({
          name: `${s.first_name} ${s.last_name}`,
        })),
      },
      attachments: [
        {
          filename: zipFileName,
          path: zipFilePath,
          contentType: "application/zip",
        },
      ],
    });

    // 5. Send notifications to each student
    await Promise.all(
      validStudents.map(async (student) => {
        try {
          await transporter.sendMail({
            from: '"University of Ruhuna Internship Office" <internships@ruh.ac.lk>',
            to: student.email,
            subject: `Your CV has been shared with ${companyName}`,
            template: "student-notification",
            context: {
              studentName: `${student.first_name} ${student.last_name}`,
              companyName,
              date: new Date().toLocaleDateString(),
            },
          });
        } catch (err) {
          console.error(`Failed to notify student ${student.email}:`, err);
        }
      })
    );

    // Clean up
    fs.unlink(zipFilePath, () => {});

    res.status(200).json({
      success: true,
      notifiedStudents: validStudents.length,
    });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({
      error: "Failed to send emails",
      details: error.message,
    });
  }
});

module.exports = router;
