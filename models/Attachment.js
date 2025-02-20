const db = require("../config/database");

class Attachment {
    static async create(projectId, userId, filename, filepath, filetype) {
        const [result] = await db.execute(
            "INSERT INTO attachments (project_id, user_id, filename, filepath, filetype) VALUES (?, ?, ?, ?, ?)",
            [projectId, userId, filename, filepath, filetype]
        );
        return result.insertId;
    }

    static async findByProject(projectId) {
        const [rows] = await db.execute("SELECT * FROM attachments WHERE project_id = ?", [projectId]);
        return rows;
    }

    static async getAll() {
        try {
            const sql = "SELECT * FROM attachments";
            const [rows] = await db.execute(sql);
            return rows;
        } catch (error) {
            console.error("Error fetching attachments:", error.message);
            throw new Error("Error fetching attachments");
        }
    }

    static async delete(attachmentId) {
        await db.execute("DELETE FROM attachments WHERE id = ?", [attachmentId]);
    }
}

module.exports = Attachment;