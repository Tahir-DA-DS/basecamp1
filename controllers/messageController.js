const Message = require("../models/message");

exports.createMessage = async (req, res) => {
  try {
    const { threadId, content } = req.body;
    const userId = req.userid;

    const messageId = await Message.create(threadId, userId, content);

    res.status(201).json({ message: "Message posted", messageId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMessagesByThread = async (req, res) => {
  try {
    const { threadId } = req.params;

    // Fetch all messages for the thread
    const messages = await Message.findByThread(threadId);

    if (!messages.length) {
      return res.status(404).json({ message: "No messages found for this thread" });
    }

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Update a message (only the owner can edit)
 */
exports.updateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.userid;

    const updated = await Message.update(id, userId, content);

    if (!updated) {
      return res.status(403).json({ message: "You are not authorized to edit this message" });
    }

    res.json({ message: "Message updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Delete a message (only the owner can delete)
 */
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userid;

    const deleted = await Message.delete(id, userId);

    if (!deleted) {
      return res.status(403).json({ message: "You are not authorized to delete this message" });
    }

    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};