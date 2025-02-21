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


      const [rows] = await db.execute(sql, [threadId]);

      return rows;
    } catch (err) {
      console.error("Error fetching messages:", err);
      throw err;
    }
  }

  static async update(messageId, userId, newContent) {
    try {
      const [result] = await db.execute(
        "UPDATE messages SET content = ? WHERE id = ? AND user_id = ?",
        [newContent, messageId, userId]
      );

      return result.affectedRows > 0; 
    } catch (err) {
      console.error("Error updating message:", err);
      throw new Error("Could not update message");
    }
  }

  static async delete(messageId, userId) {
    try {
      const [result] = await db.execute(
        "DELETE FROM messages WHERE id = ? AND user_id = ?",
        [messageId, userId]
      );

      return result.affectedRows > 0; // Returns true if the deletion was successful
    } catch (err) {
      console.error("Error deleting message:", err);
      throw new Error("Could not delete message");
    }
  }

}

module.exports = Message;