const db = require('../config/database');

const Project = {
  // Create a new project
  async create({ name, description, userId }) {
    const sql = `INSERT INTO projects (name, description, userId) VALUES (?, ?, ?)`;
    const [result] = await db.execute(sql, [name, description, userId]);
    return result.insertId; // Return the ID of the newly created project
  },

  // Find a project by its ID
  async findById(id) {
    const sql = `
      SELECT 
        p.id, p.name, p.description, p.userId, 
        a.filename, a.filepath 
      FROM projects p 
      LEFT JOIN attachments a ON p.id = a.project_id
      WHERE p.id = ?
    `;
    const [rows] = await db.execute(sql, [id]);
    return rows[0]; // Return the first project with attachment details
  },

  // Get all projects
  async getAll() {
    try {
      const sql = `
        SELECT 
          p.id, p.name, p.description, p.userId, 
          a.filename, a.filepath 
        FROM projects p 
        LEFT JOIN attachments a ON p.id = a.project_id
      `;
      const [rows] = await db.execute(sql);
      return rows;
    } catch (error) {
      console.error("Error fetching projects:", error.message);
      throw new Error("Error fetching projects");
    }
  },

  // Update a project by its ID
  async update(id, updates) {
    const { name, description } = updates; // Destructure fields to update
    const sql = `UPDATE projects SET name = ?, description = ? WHERE id = ?`;
    const [result] = await db.execute(sql, [name, description, id]);
    return result.affectedRows > 0; // Return true if a row was updated
  },

  // Delete a project by its ID
  async delete(id) {
    const sql = `DELETE FROM projects WHERE id = ?`;
    const [result] = await db.execute(sql, [id]);
    return result.affectedRows > 0; // Return true if a row was deleted
  },

  async findByUserId(userId) {
    const query = `
      SELECT projects.*, attachments.filename, attachments.filepath
      FROM projects 
      LEFT JOIN attachments ON projects.id = attachments.project_id
      WHERE projects.userId = ?
    `;
    
    const [rows] = await db.execute(query, [userId]);
    return rows;
  }
};

module.exports = Project;