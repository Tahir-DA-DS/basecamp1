const db = require("../config/database");

class Message {
  static async create(threadId, userId, content) {
    const [result] = await db.execute(
      "INSERT INTO messages (thread_id, user_id, content) VALUES (?, ?, ?)",
      [threadId, userId, content]
    );
    return result.insertId;
  }

  static async findByThread(threadId) {
    try {
      const sql = `
        SELECT messages.id, messages.content, messages.created_at, users.firstname 
        FROM messages 
        JOIN users ON messages.user_id = users.id
        WHERE messages.thread_id = ?
        ORDER BY messages.created_at ASC
      `;

      console.log("Fetching messages for threadId:", threadId); // Debug log

      const [rows] = await db.execute(sql, [threadId]);

      return rows;
    } catch (err) {
      console.error("Error fetching messages:", err);
      throw err;
    }
  }
}

module.exports = Message;