const db = require('../config/database');

const Project = {
    async create({ description, name }) {
        const sql = `INSERT INTO Projects (Name) VALUES (?)`;
        const [result] = await db.execute(sql, [description, name]);
        return result.insertId;
    },

    async findById(id) {
        const sql = `SELECT * FROM Projects WHERE Id = ?`;
        const [rows] = await db.execute(sql, [id]);
        return rows[0];
    },

    async update(id, updates) {
        const { name } = updates; // Destructure the fields to update
        const query = 'UPDATE projects SET name = ? WHERE id = ?';
        const [result] = await db.execute(query, [name, id]);
        return result.affectedRows > 0; // Return true if a row was updated
      },
    
      // Delete method
      async delete(id) {
        const query = 'DELETE FROM projects WHERE id = ?';
        const [result] = await db.execute(query, [id]);
        return result.affectedRows > 0; // Return true if a row was deleted
      },
};

module.exports = Project;