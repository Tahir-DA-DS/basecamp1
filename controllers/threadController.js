const Thread = require("../models/thread");

exports.createThread = async (req, res) => {
  try {
    if (!req.user || req.user.isAdmin !== 1) {
      return res.status(403).json({ message: "Only admins can create threads" });
    }

    const { projectId, title } = req.body;
    if (!projectId || !title) {
      return res.status(400).json({ message: "Project ID and title are required" });
    }

    const userId = req.userid; 
    const threadId = await Thread.create(projectId, userId, title);

    res.status(201).json({ message: "Thread created successfully", threadId });
  } catch (err) {
    console.error("Error creating thread:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAll = async (req, res) => {
  try {
    const threads = await Thread.getAllThreads();

    if (!threads.length) {
      return res.status(404).json({ message: "No threads found" });
    }

    res.status(200).json(threads);
  } catch (error) {
    console.error("Error fetching threads:", error.message);
    res.status(500).json({ message: "Error fetching threads" });
  }
};

exports.getThreadById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid thread ID" });
    }

    const thread = await Thread.getThreadById(id);
    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    res.status(200).json(thread);
  } catch (error) {
    console.error("Error fetching thread:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteThread = async (req, res) => {
  try {
    if (!req.user || req.user.isAdmin !== 1) {
      return res.status(403).json({ message: "Only admins can delete threads" });
    }

    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid thread ID" });
    }

    const thread = await Thread.getThreadById(id);
    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    await Thread.delete(id);
    res.status(200).json({ message: "Thread deleted successfully" });
  } catch (err) {
    console.error("Error deleting thread:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};