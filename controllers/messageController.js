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
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.delete(id);
    res.json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};