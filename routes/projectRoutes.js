const express = require('express');
const ProjectController = require('../controllers/ProjectController');
const router = express.Router();
const authenticate = require('../middleware/authenticate')

// Project management
router.post('/projects', authenticate, ProjectController.create); // Create a new project
router.get('/projects/:id', authenticate, ProjectController.show); // Show a specific project
router.put('/projects/:id', authenticate, ProjectController.edit); // Edit a project
router.delete('/projects/:id',authenticate,  ProjectController.destroy); // Delete a project
router.get('/projects', authenticate, ProjectController.showAll); //get all projects

module.exports = router;