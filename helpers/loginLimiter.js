const rateLimit = require('express-rate-limit');
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Maximum 5 requests per IP per window
    message: 'Too many login attempts, please try again later'
  });

module.exports = loginLimiter