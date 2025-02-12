const express = require('express');
const UserController = require('../controllers/UserController');
const router = express.Router();
const isAuthenticated = require('../middleware/authenticate')
const isAdmin = require('../middleware/isAdmin') 

// User registration
router.post('/users', UserController.register); // Create a new user
//loginlogout
router.post('/sessions/sign_in', UserController.login); // Log in a user
router.post('/sessions/sign_out', UserController.logout); // Log out a user

router.get('/users', isAuthenticated, isAdmin, UserController.showAll);
router.get('/me', isAuthenticated, isAdmin, UserController.authUser)
router.get('/users/:id', UserController.getById); // Show user details
router.delete('/users/:id', isAuthenticated, isAdmin, UserController.destroy); // Delete a user

// Admin role management
router.put('/users/:id/setAdmin', isAuthenticated, isAdmin, UserController.promoteUser)
router.put('/users/:id/removeAdmin', isAuthenticated, isAdmin, UserController.removeAdmin); // Remove admin privileges

module.exports = router;