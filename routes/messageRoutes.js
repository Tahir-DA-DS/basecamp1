const express = require("express");
const { createMessage, deleteMessage, getMessagesByThread} = require("../controllers/messageController");
const authMiddleware = require("../middleware/authenticate");

const router = express.Router();

router.post("/api/message", authMiddleware, createMessage);
router.get("/api/message/:threadId", authMiddleware, getMessagesByThread)
router.delete("/api/message/:id", authMiddleware, deleteMessage);

module.exports = router;