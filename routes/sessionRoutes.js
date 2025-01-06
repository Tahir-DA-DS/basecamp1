const express = require('express');
const SessionController = require('../controllers/SessionController');
const router = express.Router();

// User session management
router.post('/sessions/sign_in', SessionController.signIn); // Log in a user
router.post('/sessions/sign_out', SessionController.signOut); // Log out a user

module.exports = router;