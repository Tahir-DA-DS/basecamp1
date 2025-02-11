const jwt = require('jsonwebtoken');

function isAdmin(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.SECRET);

        if (!decoded.isAdmin) {
            return res.status(403).json({ message: 'Forbidden: Admin access required' });
        }

        req.user = decoded; // Attach user data to request
        
        
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Unauthorized: Token expired' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = isAdmin;