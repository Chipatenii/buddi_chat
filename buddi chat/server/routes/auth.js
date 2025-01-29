const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const Joi = require('joi'); // For input validation
const User = require('../models/User');
require('dotenv').config();

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET || 'default-secret';

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware to authenticate JWT token
const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from headers

    if (!token) {
        return res.status(401).json({ message: 'Access denied. Token missing or invalid.' });
    }

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token.' });
        }
        req.user = user; // Attach user data to request object
        next();
    });
};

// Input validation schemas
const userSchema = Joi.object({
    realName: Joi.string().required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

// Register endpoint
router.post('/register', upload.single('profilePicture'), async (req, res) => {
    const { realName, username, email, password } = req.body;
    const profilePicture = req.file;

    // Validate input
    const { error } = userSchema.validate({ realName, username, email, password });
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    if (!profilePicture) {
        return res.status(400).json({ message: 'Profile picture is required' });
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

        res.status(201).json({ message: 'User registered successfully', authtoken });
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

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username },
            jwtSecret,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Login Error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Endpoint to fetch the logged-in user information
router.get('/api/loggedInUser', authenticateJWT, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId); // Fetch the user from the database using the userId from the token
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the user data, excluding the password
        res.json({
            id: user._id,
            realName: user.realName,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture, // Assuming the profile picture is stored as a buffer
        });
    } catch (error) {
        console.error('Error fetching logged-in user:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;