const Thread = require("../models/thread");

exports.createThread = async (req, res) => {
  try {
    if (req.user.isAdmin !== 1) {
      return res.status(403).json({ message: "Only admins can create threads" });
    }

    const { projectId, title } = req.body;
    const userId = req.userid;

    const threadId = await Thread.create(projectId, userId, title);

    res.status(201).json({ message: "Thread created", threadId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const threads = await Thread.getAllThreads(); // Fixed method name

    if (!threads || threads.length === 0) {
      return res.status(404).json({ message: "Threads not found" });
    }

    res.status(200).json(threads);
  } catch (error) {
    console.error("Error fetching threads:", error.message);
    res.status(500).json({ message: "Error fetching threads" });
  }
};

exports.deleteThread = async (req, res) => {
  try {
    if (req.user.isAdmin !== 1) {
      return res.status(403).json({ message: "Only admins can delete threads" });
    }

    const { id } = req.params;
    await Thread.delete(id);
    res.json({ message: "Thread deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
