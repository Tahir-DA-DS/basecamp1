const Project = require('../models/Project');
const ProjectUser = require('../models/ProjectUser');

const ProjectController = {
  // Create a new project and assign it to the user
  async create(req, res) {
    const { description, name } = req.body;
    const userId = req.user.id; // Assume `req.user` contains the authenticated user's information

    
    try {
      const projectId = await Project.create({ description, name });

      // Assign the project to the user in the `ProjectUser` table
      await ProjectUser.assign(userId, projectId);

      res.status(201).send(`Project created with ID: ${projectId}`);
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).send('Error creating project');
    }
  },

  // Show all projects for the authenticated user
  async showAll(req, res) {
    const userId = req.user.id;

    try {
      const projects = await Project.getAllByUserId(userId); // Fetch projects belonging to the user
      res.status(200).json(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ message: 'Error fetching projects' });
    }
  },

  // Show a specific project
  async show(req, res) {
    const { id } = req.params;
    const userId = req.user.id;

    try {
      const project = await Project.findByIdAndUserId(id, userId); // Ensure the project belongs to the user
      if (!project) return res.status(404).send('Project not found or unauthorized');
      res.status(200).json(project);
    } catch (error) {
      console.error('Error fetching project:', error);
      res.status(500).send('Error fetching project');
    }
  },

  // Edit a project (only if the user owns it)
  async edit(req, res) {
    const { id } = req.params;
    const { description, name } = req.body;
    const userId = req.user.id;

    try {
      const project = await Project.findByIdAndUserId(id, userId); // Ensure the project belongs to the user
      if (!project) return res.status(404).send('Project not found or unauthorized');

      await Project.update(id, { description, name });
      res.status(200).send('Project updated successfully');
    } catch (error) {
      console.error('Error updating project:', error);
      res.status(500).send('Error updating project');
    }
  },

  // Delete a project (only if the user owns it)
  async destroy(req, res) {
    const { id } = req.params;
    const userId = req.user.id;

    try {
      const project = await Project.findByIdAndUserId(id, userId); // Ensure the project belongs to the user
      if (!project) return res.status(404).send('Project not found or unauthorized');

      await Project.delete(id);
      res.status(200).send('Project deleted successfully');
    } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).send('Error deleting project');
    }
  },
};

module.exports = ProjectController;