const jwt = require('jsonwebtoken');
require('dotenv').config()

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  
  if (token==null) return res.status(401).json({ error: 'Access denied. No token provided.' });

  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
   
    req.userid = user.userId;
   

    
    next();
  });
};

module.exports = authenticate;