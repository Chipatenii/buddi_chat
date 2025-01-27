const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];

        // Check if the Authorization header is present and properly formatted
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. Token missing or invalid.',
            });
        }

        // Extract the token from the Authorization header
        const token = authHeader.split(' ')[1];

        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded user information to the request object
        req.user = decoded;

        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        // Differentiate between expired and invalid tokens
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired. Please log in again.',
            });
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(403).json({
                success: false,
                message: 'Invalid token. Access denied.',
            });
        }

        // Handle other unexpected errors
        console.error('Token verification error:', err.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while verifying the token.',
        });
    }
};

module.exports = authenticateToken;