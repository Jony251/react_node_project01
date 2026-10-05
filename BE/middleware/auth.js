const jwt = require('jsonwebtoken');

// Signing secret comes from the environment; refuse to start without it.
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
}

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

const checkAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 1) {
        return res.status(403).json({ message: 'Unauthorized: Admin access required' });
    }
    next();
};

module.exports = {
    verifyToken,
    checkAdmin,
    JWT_SECRET // Export the secret key so we can use it in auth routes
};
