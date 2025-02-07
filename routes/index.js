const express = require('express');
const userRoutes = require('./userRoutes');
const projectRoutes = require('./projectRoutes');
const router = express.Router();

// Combine routes
router.use(userRoutes);
router.use(projectRoutes);

module.exports = router;