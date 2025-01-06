const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const router = express.Router();

const jwtSecret = process.env.JWT_SECRET || 'default-secret';

// Registration endpoint
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
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
        const newUser = new User({ username, email, password: hashedPassword });
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

// Login endpoint
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        try {
            const token = jwt.sign(
                { userId: user._id, username: user.username },
                jwtSecret,
                { expiresIn: '1h' }
            );
            res.status(200).json({ token, username: user.username });
        } catch (err) {
            console.error('JWT Signing Error:', err.message);
            res.status(500).json({ message: 'Token generation failed' });
        }
    } catch (error) {
        console.error('Login Error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;