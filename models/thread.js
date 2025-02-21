const db = require("../config/database");

class Thread {
  static async create(projectId, userId, title) {
    try {
      const [result] = await db.execute(
        "INSERT INTO threads (project_id, user_id, title) VALUES (?, ?, ?)",
        [projectId, userId, title]
      );
      return result.insertId;
    } catch (error) {
      console.error("Error creating thread:", error.message);
      throw new Error("Error creating thread");
    }
  }

  static async getAllThreads() {
    try {
      const sql = "SELECT * FROM threads";
      const [rows] = await db.execute(sql);
      return rows.length ? rows : []; // Ensure empty array if no threads found
    } catch (error) {
      console.error("Error fetching threads:", error.message);
      throw new Error("Error fetching threads");
    }
  }

  static async getThreadById(id) {
    try {
      const sql = "SELECT * FROM threads WHERE id = ?";
      const [rows] = await db.execute(sql, [id]);
      if (rows.length === 0) {
        throw new Error("Thread not found");
      }
      return rows[0];
    } catch (error) {
      console.error("Error fetching thread by ID:", error.message);
      throw new Error("Error fetching thread by ID");
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.execute("DELETE FROM threads WHERE id = ?", [id]);
      if (result.affectedRows === 0) {
        throw new Error("Thread not found or already deleted");
      }
      return true;
    } catch (error) {
      console.error("Error deleting thread:", error.message);
      throw new Error("Error deleting thread");
    }
  }
}

module.exports = Thread;