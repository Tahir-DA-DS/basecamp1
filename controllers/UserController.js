const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
require('dotenv').config()

const UserController = {
  async register(req, res) {
    try {
        let { email, password, firstname, lastname } = req.body;

        // Normalize input: trim spaces and lowercase email
        email = email.trim().toLowerCase();
        firstname = firstname.trim();
        lastname = lastname.trim();
        password = password.trim(); 

        // Check if the user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists' });
        }

        // Hash the password before saving
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, saltRounds);
        } catch (hashError) {
            console.error('Error hashing password:', hashError.message);
            return res.status(500).json({ message: 'Error hashing password' });
        }

        // Create the new user with the hashed password
        const newUser = await User.create({ 
            email, 
            password: hashedPassword, 
            firstname, 
            lastname 
        });
        // Return success response without sending the password
        res.status(201).json({ 
            message: 'User registered successfully', 
            user: {
                id: newUser.Id,
                email: newUser.email,
                firstname: newUser.firstname,
                lastname: newUser.lastname
            }
        }); 
    } catch (error) {
        console.error('Error registering user:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
},

 

async login(req, res) {
  try {
      const { email, password } = req.body;

      // Trim input
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();

      // Get user from database
      const user = await User.findByEmail(trimmedEmail);
      if (!user) {
          return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Ensure stored hash is correct and compare passwords
      const isPasswordValid = await bcrypt.compare(trimmedPassword, user.Password);


      if (!isPasswordValid) {
          return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Create JWT token
      const payLoad = { userId: user.Id, isAdmin: user.IsAdmin };
      const token = jwt.sign(payLoad, process.env.SECRET);

      res.status(200).json({
          message: 'Login successful',
          token,
          user: {
              id: user.Id,
              email: user.Email,
              name: `${user.Firstname} ${user.Lastname}`,
              isAdmin: user.IsAdmin,
          },
      });
  } catch (error) {
      console.error('Error logging in:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
  }
},

  // Logout a user
  logout(req, res) {
 
      res.clearCookie();
  
      res.status(200).json({ message: 'Logout successful' });
    },

  // Show all users
  async showAll(req, res) {
    try {
      const users = await User.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error.message);
      res.status(500).json({ message: 'Error fetching users' });
    }
  },

  async authUser(req, res) {
    try {
        res.json({ userId: req.user.userId, isAdmin: req.user.isAdmin });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving user details" });
    }
},
  // Get a user by ID
  async getById(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user:', error.message);
      res.status(500).json({ message: 'Error fetching user' });
    }
  },

  // Delete a user by ID
  async destroy(req, res) {
    try {
        const userId = req.params.id;
        const deleted = await User.delete(userId); 
        if (!deleted) {
            return res.status(404).json({ message: "User not found or already deleted" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error.message);
        res.status(500).json({ message: "Error deleting user" });
    }
},


  // Remove admin privileges for a user
  async removeAdmin(req, res) {
    try {
      const userId = req.params.id;

      const updated = await User.setRole(userId, 0);
      if (!updated) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ message: 'Admin privileges removed successfully' });
    } catch (error) {
      console.error('Error removing admin privileges:', error.message);
      res.status(500).json({ message: 'Error removing admin privileges' });
    }
  },

  async promoteUser(req, res) {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the user's IsAdmin status in the database
        const updated = await User.setRole(userId, 1); // Assuming 1 means admin

        if (!updated) {
            return res.status(500).json({ message: "Failed to promote user" });
        }

        res.status(200).json({ message: `User ${user.Email} promoted to admin.` });

    } catch (error) {
        console.error("Error promoting user:", error.message);
        res.status(500).json({ message: "Error promoting user to admin" });
    }
},
  

};


module.exports = UserController;