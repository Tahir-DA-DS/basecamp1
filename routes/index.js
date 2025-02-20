const express = require('express');
const userRoutes = require('./userRoutes');
const projectRoutes = require('./projectRoutes');
const attachmentRoute = require('./attachmentRoutes')
const threadRoute = require('./threadRoutes')
const messageRoutes = require('./messageRoutes')


const router = express.Router();

// Combine routes
router.use(userRoutes);
router.use(projectRoutes);
router.use(attachmentRoute)
router.use(threadRoute)
router.use(messageRoutes)


module.exports = router;