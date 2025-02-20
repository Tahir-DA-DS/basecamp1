const express = require("express");
const { uploadAttachment, getAllAttachments, deleteAttachment, getAll } = require("../controllers/attachmentController");
const authMiddleware = require("../middleware/authenticate");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Upload attachment
router.post("/api/attachment", authMiddleware, upload.single("file"), uploadAttachment);

// Get all attachments
router.get("/api/attachment", authMiddleware, getAll);

// Get attachments by project ID
router.get("/api/attachment/:projectId", authMiddleware, getAllAttachments);


// Delete attachment by ID
router.delete("/api/attachment/:id", authMiddleware, deleteAttachment);

module.exports = router;