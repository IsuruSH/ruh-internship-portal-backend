const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure folders exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "uploads/";

    if (file.fieldname === "profileImage") {
      folder += "profile/";
    } else if (file.fieldname === "cvLink") {
      folder += "cv/";
    }

    ensureDir(folder); // Make sure the folder exists
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const baseName = file.fieldname === "cvLink" ? "cv" : "profile";
    const uniqueName = `${baseName}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "cvLink") {
    // Now file.buffer will be available
    cb(null, true);
  } else if (file.fieldname === "profileImage") {
    cb(null, true);
  } else {
    cb(new Error("Invalid fieldname"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
