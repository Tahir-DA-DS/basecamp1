const User = require('../models/user');
let bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken'); 
require('dotenv').config()

const UserController = {
  // Register a new user
  async register(req, res) {
    try {
      const { email, password, firstname, lastname } = req.body;
  
      // Check if the user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: 'User with this email already exists' }); 
      }
  
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10); 
  
      // Create the new user
      const newUser = await User.create({ 
        email, 
        password: hashedPassword, 
        firstname, 
        lastname 
      });
  
      res.status(201).json({ message: 'User registered successfully', user: newUser }); 
    } catch (error) {
      console.error('Error registering user:', error.message);
      res.status(500).json({ message: 'Error registering user' }); 
    }
  },

 

  async login(req, res) {
    try {
      const { email, password } = req.body;
  
      // Validate credentials
      const user = await User.validateCredentials(email, password);
  
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      // Token payload
      const payLoad = { 
        userId: user.Id,
        isAdmin: user.IsAdmin === 1  // Ensure it's a boolean
      };
  
      // Generate JWT token with expiration
      const token = jwt.sign(
        payLoad,
        process.env.SECRET,
        { expiresIn: '1h' } // Token expires in 1 hour
      );
  
      // Return token and user info
      res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user.Id,
          email: user.Email,
          isAdmin: user.IsAdmin === 1, // Ensure it's a boolean
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
      const { id } = req.params;

      const deleted = await User.delete(id);
      if (!deleted) {
        return res.status(404).json({ message: 'User not found or already deleted' });
      }

      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error.message);
      res.status(500).json({ message: 'Error deleting user' });
    }
  },


  // Remove admin privileges for a user
  async removeAdmin(req, res) {
    try {
      const { id } = req.params;

      const updated = await User.setRole(id, 'user');
      if (!updated) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ message: 'Admin privileges removed successfully' });
    } catch (error) {
      console.error('Error removing admin privileges:', error.message);
      res.status(500).json({ message: 'Error removing admin privileges' });
    }
  },

  async promoteUser(req, res){
    try {
      const userId = req.user.id;
  
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update the user's IsAdmin status
      user.IsAdmin = 1; // Assuming 1 means true for admin
      await user.save();
  
      res.status(200).json({ message: `User ${user.Email} promoted to admin.` });
    } catch (error) {
      console.error('Error promoting user:', error);
      res.status(500).json({ message: 'Error promoting user to admin' });
    }
  },
  
  async demoteUser (req, res){
    try {
      const userId = req.user.id

      // if (user.Id === req.user.id) {
      //   return res.status(403).json({ message: 'You cannot remove yourself as an admin.' });
      // }
  
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (user.IsAdmin === 0) {
        return res.status(400).json({ message: 'User is already a regular user.' });
      }
  
      // Update the user's IsAdmin status
      user.IsAdmin = 0; // 0 means non-admin
      await user.save();
  
      res.status(200).json({ message: `User ${user.Email} has been demoted.` });
    } catch (error) {
      console.error('Error demoting user:', error);
      res.status(500).json({ message: 'Error demoting user from admin' });
    }
  }
  

};
function generateRefreshToken(user){
  return jwt.sign(user, process.env.REFERESH_TOKEN, {expiresIn:'15m'})
} 

module.exports = UserController;