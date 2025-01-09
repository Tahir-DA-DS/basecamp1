const express = require('express');
const ProjectController = require('../controllers/ProjectController');
const router = express.Router();

// Project management
router.post('/projects', ProjectController.create); // Create a new project
router.get('/projects/:id', ProjectController.show); // Show a specific project
router.put('/projects/:id', ProjectController.edit); // Edit a project
router.delete('/projects/:id', ProjectController.destroy); // Delete a project
router.get('/projects', ProjectController.showAll); //get all projects

module.exports = router;