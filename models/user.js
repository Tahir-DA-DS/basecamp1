const db = require('../config/database');
const bcrypt = require('bcryptjs');

const User = {
  // Create a new user
  async create({ email, password, firstname, lastname }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `INSERT INTO User (Email, Password, Firstname, Lastname) VALUES (?, ?, ?, ?)`;
    const [result] = await db.execute(sql, [email, hashedPassword, firstname, lastname]);
    return result.insertId; // Return the ID of the newly created user
  },

  // Find a user by email
  async findByEmail(email) {
    const sql = `SELECT * FROM User WHERE Email = ?`;
    const [rows] = await db.execute(sql, [email]);
    return rows.length ? rows[0] : null; // Return the user or null if not found
  },

  // Find a user by ID
  async findById(id) {
    const sql = `SELECT * FROM User WHERE Id = ?`;
    const [rows] = await db.execute(sql, [id]);
    return rows.length ? rows[0] : null; // Return the user or null if not found
  },

  // Get all users
  async getAllUsers() {
    try {
      const sql = `SELECT * FROM User`;
      const [rows] = await db.query(sql);
      return rows; // Return all rows (users)
    } catch (error) {
      console.error('Error fetching users:', error.message);
      throw new Error('Error fetching users');
    }
  },

  // Delete a user by ID
  async delete(id) {
    const sql = `DELETE FROM User WHERE Id = ?`;
    const [result] = await db.execute(sql, [id]);
    return result.affectedRows > 0; // Return true if a row was deleted
  },

  // Validate user credentials
  async validateCredentials(email, password) {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    const isPasswordValid = await bcrypt.compare(password, user.Password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }
    return user;
  },

  // Assign a role to a user (requires an IsAdmin column in the schema)
  async setRole(userId, role) {
    const isAdmin = role === 'admin' ? 1 : 0;
    const sql = `UPDATE User SET IsAdmin = ? WHERE Id = ?`;
    const [result] = await db.execute(sql, [isAdmin, userId]);
    return result.affectedRows > 0; // Return true if the update succeeded
  },
};

module.exports = User;