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
    const sql = `SELECT * FROM projects WHERE id = ?`;
    const [rows] = await db.execute(sql, [id]);
    return rows[0]; // Return the first row (project) or undefined
  },

  // Get all projects
  async getAll() {
    try {
      const sql = `SELECT * FROM projects`;
      const [rows] = await db.execute(sql);
      return rows; // Return all rows (projects)
    } catch (error) {
      console.error('Error fetching projects:', error.message);
      throw new Error('Error fetching projects');
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
    const query = 'SELECT * FROM projects WHERE userId = ?';
    const [rows] = await db.execute(query, [userId]);
    return rows;
  }
};

module.exports = Project;