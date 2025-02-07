function isAdmin(req, res, next) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ message: 'Unauthorized' });
  
      const decoded = jwt.verify(token, process.env.SECRET);
      if (!decoded.isAdmin) {
        return res.status(403).json({ message: 'Forbidden: Admin access required' });
      }
  
      req.user = decoded; // Store decoded data in request
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  }

  module.exports = isAdmin