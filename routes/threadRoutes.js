const express = require("express");
const { createThread, deleteThread, getAll, getThreadById } = require("../controllers/threadController");
const authMiddleware = require("../middleware/authenticate");
const authAdmin = require("../middleware/isAdmin");

const router = express.Router();

// Get all threads
router.get("/api/thread", authMiddleware, getAll);

// Get a single thread by ID
router.get("/api/thread/:id", authMiddleware, getThreadById);

// Create a thread (Admin only)
router.post("/api/thread", authMiddleware, authAdmin, createThread);

// Delete a thread by ID (Admin only)
router.delete("/api/thread/:id", authMiddleware, authAdmin, deleteThread);

module.exports = router;
