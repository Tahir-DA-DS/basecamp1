const db = require('../config/database');
const bcrypt = require('bcryptjs');

const User = {
    async create({ email, password, firstname, lastname }) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = `INSERT INTO Users (Email, Password, Firstname, Lastname) VALUES (?, ?, ?, ?)`;
        const [result] = await db.execute(sql, [email, hashedPassword, firstname, lastname]);
        return result.insertId;
    },

    async findByEmail(email) {
        const sql = `SELECT * FROM Users WHERE Email = ?`;
        const [rows] = await db.execute(sql, [email]);
        return rows[0];
    },

    async findById(id) {
        const query = 'SELECT * FROM users WHERE id = ?';
        const [rows] = await db.execute(query, [id]);
        return rows.length ? rows[0] : null; // Return the user or null if not found
      },

      async getAllUsers() {
        try {
          const [rows] = await db.query('SELECT * FROM users');
          return rows;
        } catch (error) {
          console.error('Error fetching users:', error.message);
          throw new Error('Error fetching users');
        }
      },

      async delete(id) {
        const query = 'DELETE FROM users WHERE id = ?';
        const [result] = await db.execute(query, [id]);
        return result.affectedRows > 0; // Return true if a row was deleted, false otherwise
      },

    async validateCredentials(email, password) {
        const user = await this.findByEmail(email);
        if (user && (await bcrypt.compare(password, user.Password))) {
            return user;
        }
        return null;
    },

    async setRole(userId, role) {
        const isAdmin = role === 'admin' ? 1 : 0;
        const sql = `UPDATE Users SET IsAdmin = ? WHERE Id = ?`;
        await db.execute(sql, [isAdmin, userId]);
    },
};

module.exports = User;