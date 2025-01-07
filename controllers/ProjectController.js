const Project = require('../models/Project');

const ProjectController = {
  // Create a new project
  async create(req, res) {
    const { description, name } = req.body;
    try {
      const projectId = await Project.create({ description, name });
      res.status(201).send(`Project created with ID: ${projectId}`);
    } catch (error) {
      res.status(500).send('Error creating project');
    }
  },

  // Show a specific project
  async show(req, res) {
    const { id } = req.params;
    try {
      const project = await Project.findById(id);
      if (!project) return res.status(404).send('Project not found');
      res.status(200).json(project);
    } catch (error) {
      res.status(500).send('Error fetching project');
    }
  },

  // Edit a project
  async edit(req, res) {
    const { id } = req.params;
    const { description, name } = req.body;
    try {
      await Project.update(id, { description, name });
      res.status(200).send('Project updated successfully');
    } catch (error) {
      res.status(500).send('Error updating project');
    }
  },

  // Delete a project
  async destroy(req, res) {
    const { id } = req.params;
    try {
      await Project.delete(id);
      res.status(200).send('Project deleted successfully');
    } catch (error) {
      res.status(500).send('Error deleting project');
    }
  },
};

module.exports = ProjectController;