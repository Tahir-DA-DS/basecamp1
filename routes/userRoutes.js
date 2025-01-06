const express = require('express');
const UserController = require('../controllers/UserController');
const router = express.Router();

// User registration
router.post('/users', UserController.create); // Create a new user
router.get('/users/:id', UserController.show); // Show user details
router.delete('/users/:id', UserController.destroy); // Delete a user
router.get('/users', UserController.getAllUser);

// Admin role management
router.post('/users/:id/setAdmin', UserController.setAdmin); // Make user an admin
router.post('/users/:id/removeAdmin', UserController.removeAdmin); // Remove admin privileges

module.exports = router;