const multer = require("multer");
const path = require("path");

// Set storage engine
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter (only allow PNG, JPG, PDF, TXT)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/png", "image/jpeg", "application/pdf", "text/plain"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PNG, JPG, PDF, and TXT are allowed."), false);
  }
};

// Upload middleware
const upload = multer({ storage, fileFilter });

module.exports = upload;