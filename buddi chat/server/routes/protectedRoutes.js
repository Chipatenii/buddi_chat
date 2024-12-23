const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Example of a protected route
router.get('/profile', authenticateToken, (req, res) => {
    res.status(200).json({ message: `Welcome, ${req.user.username}!` });
});

module.exports = router;
