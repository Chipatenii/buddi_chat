const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Create a new user
router.post('/', async (req, res) => {
    try {
        const { username, bio, profilePicture } = req.body;
        const user = new User({ username, bio, profilePicture });
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Error creating user' });
    }
});

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});

module.exports = router;
