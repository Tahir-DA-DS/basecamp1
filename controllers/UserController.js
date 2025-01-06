const User = require('../models/user');

const UserController = {
  // Create a new user (Sign up)
  async create(req, res) {
    const { email, password, firstname, lastname } = req.body;
  
    try {
      // Check if the user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }
  
      // Create the user
      const userId = await User.create({ email, password, firstname, lastname });
  
      // Send a structured JSON response
      res.status(201).json({ message: 'User created successfully', userId });
    } catch (error) {
      console.error('Error creating user:', error.message);
  
      // Send an error response
      res.status(500).json({ message: 'Error creating user', error: error.message });
    }
  },

  // Show a specific user
  async show(req, res) {
    const { id } = req.params;    
    try {
      const user = await User.findById(id);
      if (!user) return res.status(404).send('User not found');
      res.status(200).json(user);
    } catch (error) {
      res.status(500).send('Error fetching user');
    }
  },
   async getAllUser (req, res) {
    try {
      const users = await User.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching users' });
    }
  },
  // Delete a user
  async destroy(req, res) {
    const { id } = req.params;
    try {
      await User.delete(id);
      res.status(200).send('User deleted successfully');
    } catch (error) {
      res.status(500).send('Error deleting user');
    }
  },

  // Set a user as admin
  async setAdmin(req, res) {
    const { id } = req.params;
    try {
      await User.setRole(id, 'admin');
      res.status(200).send('User is now an admin');
    } catch (error) {
      res.status(500).send('Error setting admin');
    }
  },

  // Remove admin privileges
  async removeAdmin(req, res) {
    const { id } = req.params;
    try {
      await User.setRole(id, 'user');
      res.status(200).send('Admin privileges removed');
    } catch (error) {
      res.status(500).send('Error removing admin');
    }
  },
};

module.exports = UserController;
