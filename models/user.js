const db = require('../config/database');
const bcrypt = require('bcryptjs');

const User = {
  // Create a new user
  async create({ email, password, firstname, lastname }) {
    const sql = `INSERT INTO Users (Email, Password, Firstname, Lastname) VALUES (?, ?, ?, ?)`;
    const [result] = await db.execute(sql, [email, password, firstname, lastname]);
    return result.insertId; // Return the ID of the newly created user
  },

  // Find a user by email
  async findByEmail(email) {
    const sql = `SELECT * FROM Users WHERE Email = ?`;
    const [rows] = await db.execute(sql, [email]);
    return rows.length ? rows[0] : null; // Return the user or null if not found
  },

  // Find a user by ID
  async findById(id) {
    const sql = `SELECT * FROM Users WHERE Id = ?`;
    const [rows] = await db.execute(sql, [id]);
    return rows.length ? rows[0] : null; // Return the user or null if not found
  },

  // Get all users
  async getAllUsers() {
    try {
      const sql = `SELECT * FROM Users`;
      const [rows] = await db.execute(sql);
      return rows; // Return all rows (users)
    } catch (error) {
      console.error('Error fetching users:', error.message);
      throw new Error('Error fetching users');
    }
  },

  // Delete a user by ID
  async delete(id) {
    const sql = `DELETE FROM Users WHERE Id = ?`;
    const [result] = await db.execute(sql, [id]);
    return result.affectedRows > 0; // Return true if a row was deleted
  },

  // Validate user credentials
  // async validateCredentials(email, password) {
  //   const user = await this.findByEmail(email);

  //   if (!user) {
  //     throw new Error('User not found');
  //   }

  //   console.log("Entered Password:", password);
  //   console.log("Stored Hashed Password:", user.Password);

  //   const isPasswordValid = await bcrypt.compare(password.trim(), user.Password.trim());
    
    
  //   if (!isPasswordValid) {
  //     throw new Error('Invalid password');
  //   }
  //   return user;
  // },

//  async validateCredentials(email, password) {
//     try {
//       const user = await User.findByEmail(email); // Find the user by email
      
//       if (!user) {
//         return null; // User not found
//       }
//       console.log("Hash from DB (JSON.stringified):", JSON.stringify(user.Password));
      
//       const isPasswordValid = await bcrypt.compare(password, user.Password); // Compare passwords
     
//       if (isPasswordValid) {
//         return user; // Return the user object if passwords match
//       } else {
//         return null; // Passwords don't match
//       }
//     } catch (error) {
//       console.error("Error validating credentials:", error);
//       throw error; // Re-throw the error for handling in the login route
//     }
//   },

  async validateCredentials(email, password) {
    console.log("Validating Credentials for:", email);

    const user = await this.findByEmail(email);
    console.log("User from DB:", user);

    if (!user) {
        console.error("User not found!");
        throw new Error("User not found");
    }

    if (!user.Password) {
        console.error("User has no password stored!");
        throw new Error("No password found for user.");
    }

    if (!isPasswordValid) {
        console.error("Password does not match!");
        throw new Error("Invalid password");
    }

    return user;
},

  // Assign a role to a user (requires an IsAdmin column in the schema)
  async setRole(userId, role) {
    const isAdmin = role === 1 ? 1 : 0;
    const sql = `UPDATE Users SET IsAdmin = ? WHERE Id = ?`;
    const [result] = await db.execute(sql, [isAdmin, userId]);
    return result.affectedRows > 0; // Return true if the update succeeded
  },
};

module.exports = User;