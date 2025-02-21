const express = require("express");
const { 
  createMessage, 
  deleteMessage, 
  getMessagesByThread, 
  updateMessage 
} = require("../controllers/messageController");

const authMiddleware = require("../middleware/authenticate");

const router = express.Router();

// Create a new message
router.post("/api/messages", authMiddleware, createMessage);

// Get messages by thread ID
router.get("/api/messages/:threadId", authMiddleware, getMessagesByThread);

// Update a message (only the message owner can edit)
router.put("/api/messages/:id", authMiddleware, updateMessage);

// Delete a message (only the message owner can delete)
router.delete("/api/messages/:id", authMiddleware, deleteMessage);

module.exports = router;
