// controllers/ProjectController.js
const Project = require('../models/Project');
const ProjectUser = require('../models/ProjectUser');
const Attachment = require("../models/Attachment");
const db = require("../config/database")

const ProjectController = {
  // Create a new project
  async create(req, res) {
    const connection = await db.getConnection(); // Start database connection
    try {
      await connection.beginTransaction(); // Begin transaction
  
      const { name, description } = req.body;
      const userId = req.userid; 
      const file = req.file; 
   
      // Create the project
      const projectId = await Project.create({ name, description, userId });
  
      // Associate user with the project
      await ProjectUser.assign(userId, projectId);
  
      if (file) {
        let filetype = file.mimetype.split("/")[1];

        if (filetype === "jpeg") {
          filetype = "jpg"; // Convert jpeg to jpg to match ENUM
        }
  
        // Validate file type
        const allowedTypes = ["png", "jpg", "jpeg", "pdf", "txt"];
        if (!allowedTypes.includes(filetype)) {
          await connection.rollback(); // Rollback if file type is invalid
          return res.status(400).json({ message: "Invalid file type." });
        }
      
        // Save attachment to database
        await Attachment.create(projectId, userId, file.originalname, file.path, filetype);
      
      }
  
      await connection.commit(); // Commit transaction
      res.status(201).json({ message: 'Project created successfully', projectId });
  
    } catch (error) {
      await connection.rollback(); // Rollback transaction in case of an error
      console.error('Error creating project:', error.message);
      res.status(500).json({ message: 'Error creating project' });
    } finally {
      connection.release(); // Release the database connection
    }
  },

  // Get all projects
  async getUniqueProject(req, res) {
    try {
      const userId = req.userid; 

      
      // Fetch projects associated with the user
      const projects = await Project.findByUserId(userId);
  
      // Send the projects as a JSON response with status 200 (OK)
      res.status(200).json(projects); 
    } catch (error) {

      // Send an error response with status 500 (Internal Server Error) and a message
      res.status(500).json({ message: 'Error fetching projects' }); 
    }
  },

  // Get a specific project
  async getAll(req, res) {
    try {
  
      const project = await Project.getAll();

      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      res.status(200).json(project);
    } catch (error) {
      console.error('Error fetching project:', error.message);
      res.status(500).json({ message: 'Error fetching project' });
    }
  },

  // Update a project
  async update(req, res) {
    try {
      const projectId  = req.params.id;

      console.log(projectId);
      
      const updates = req.body;

      // Update the project
      const updated = await Project.update(projectId, updates);

      if (!updated) {
        return res.status(404).json({ message: 'Project not found' });
      }

      res.status(200).json({ message: 'Project updated successfully' });
    } catch (error) {
      console.error('Error updating project:', error.message);
      res.status(500).json({ message: 'Error updating project' });
    }
  },

  // Delete a project
  async delete(req, res) {
    try {
      const { id } = req.params;

      // Delete the project
      const deleted = await Project.delete(id);

      if (!deleted) {
        return res.status(404).json({ message: 'Project not found' });
      }

      res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
      console.error('Error deleting project:', error.message);
      res.status(500).json({ message: 'Error deleting project' });
    }
  },
};

module.exports = ProjectController;