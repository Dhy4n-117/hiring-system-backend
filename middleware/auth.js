const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Get token from header (Standard 'Authorization' header)
    const authHeader = req.header('Authorization');
    
    // Check if no token or if it doesn't start with Bearer
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify token using your secret from .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Match the payload you used in the controller (decoded.id)
        req.user = decoded.id; 
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};