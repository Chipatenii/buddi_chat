const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Logger middleware for debugging
router.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Protected route to fetch user profile information
router.get('/profile', authenticateToken, (req, res) => {
    try {
        res.status(200).json({
            message: `Welcome, ${req.user.username}!`,
            user: {
                id: req.user.id,
                username: req.user.username,
                email: req.user.email, // If included in token
                role: req.user.role    // If applicable
            }
        });
    } catch (err) {
        console.error('Error in /profile route:', err.message);
        res.status(500).json({ message: 'An error occurred while fetching profile information.' });
    }
});

// Example role-based protected route
const checkRole = (role) => (req, res, next) => {
    if (req.user.role !== role) {
        return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next();
};

router.get('/admin', authenticateToken, checkRole('admin'), (req, res) => {
    res.status(200).json({ message: 'Welcome to the admin panel!' });
});

module.exports = router;