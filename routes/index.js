const express = require('express');
const userRoutes = require('./userRoutes');
const sessionRoutes = require('./sessionRoutes');
const projectRoutes = require('./projectRoutes');
const router = express.Router();

// Combine routes
router.use(userRoutes);
router.use(sessionRoutes);
router.use(projectRoutes);

module.exports = router;