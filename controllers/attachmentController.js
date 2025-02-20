const Attachment = require("../models/Attachment");
const fs = require("fs");
const path = require("path");

exports.uploadAttachment = async (req, res) => {
  try {
    const { projectId } = req.body;
    const userId = req.userid;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Extract file extension safely
    const filetype = path.extname(file.originalname).toLowerCase().replace(".", "");

    // Validate file type
    const allowedTypes = ["png", "jpg", "pdf", "txt"];
    if (!allowedTypes.includes(filetype)) {
      return res.status(400).json({ message: "Invalid file type." });
    }

    // Save to database
    const attachmentId = await Attachment.create(
      projectId,
      userId,
      file.originalname,
      file.path,
      filetype
    );

    res.status(201).json({ message: "File uploaded successfully", attachmentId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllAttachments = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Fetch all attachments for the project
    const attachments = await Attachment.findByProject(projectId);
    
    if (!attachments.length) {
      return res.status(404).json({ message: "No attachments found for this project" });
    }

    res.status(200).json(attachments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const attachments = await Attachment.getAll();

    if (!attachments.length) {
      return res.status(404).json({ message: "Attachments not found" });
    }

    res.status(200).json(attachments);
  } catch (error) {
    console.error("Error fetching attachments:", error.message);
    res.status(500).json({ message: "Error fetching attachments" });
  }
};

exports.deleteAttachment = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the attachment by ID
    const [attachment] = await Attachment.findById(id); // Fixed method call
    if (!attachment) return res.status(404).json({ message: "Attachment not found" });

    // Delete file from storage asynchronously
    fs.unlink(path.join(__dirname, "../", attachment.filepath), async (err) => {
      if (err) {
        console.error("Error deleting file:", err.message);
        return res.status(500).json({ message: "Error deleting file" });
      }

      // Delete from database
      await Attachment.delete(id);
      res.json({ message: "Attachment deleted successfully" });
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
