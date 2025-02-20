const db = require("../config/database");

class Thread {
  static async create(projectId, userId, title) {
    const [result] = await db.execute(
      "INSERT INTO threads (project_id, user_id, title) VALUES (?, ?, ?)",
      [projectId, userId, title]
    );
    return result.insertId;
  }

  static async getAllThreads() {
    try {
      const sql = "SELECT * FROM threads";
      const [rows] = await db.execute(sql);
      return rows; // Return all threads
    } catch (error) {
      console.error("Error fetching threads:", error.message);
      throw new Error("Error fetching threads");
    }
  }

  static async delete(id) {
    await db.execute("DELETE FROM threads WHERE id = ?", [id]);
  }
}

module.exports = Thread;