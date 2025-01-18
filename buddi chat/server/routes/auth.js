const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const User = require('../models/User');
require('dotenv').config();

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET || 'default-secret';

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/register', upload.single('profilePicture'), async (req, res) => {
    const { realName, username, email, password } = req.body;
    const profilePicture = req.file;

    if (!realName || !username || !email || !password || !profilePicture) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingUserByUsername = await User.findOne({ username });
        if (existingUserByUsername) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const existingUserByEmail = await User.findOne({ email });
        if (existingUserByEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            realName,
            username,
            email,
            password: hashedPassword,
            profilePicture: profilePicture.buffer, // Store the profile picture as a buffer
        });
        await newUser.save();

        const token = jwt.sign(
            { userId: newUser._id, username: newUser.username },
            jwtSecret,
            { expiresIn: '1h' }
        );

        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        console.error('Registration Error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;