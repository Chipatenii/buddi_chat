const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Joi = require('joi');
const rateLimit = require('express-rate-limit');
const { validateRequest } = require('../middleware/validation');

const router = express.Router();

// Rate limiting configuration
const createAccountLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 account creation requests per window
  message: 'Too many accounts created from this IP, please try again after 15 minutes',
  standardHeaders: true,
});

// Validation schemas
const userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$')).required(),
});

// Enhanced authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ 
      code: 'MISSING_TOKEN',
      message: 'Authorization header with Bearer token required' 
    });
  }

  const token = authHeader.split(' ')[1];
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        code: 'INVALID_TOKEN',
        message: err.name === 'TokenExpiredError' 
          ? 'Token expired' 
          : 'Invalid authentication token'
      });
    }

    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };
    next();
  });
};

// Create new user with improved error handling
router.post('/', createAccountLimiter, validateRequest(userSchema), async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check for existing users
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      const conflictField = existingUser.username === username ? 'username' : 'email';
      return res.status(409).json({
        code: `${conflictField.toUpperCase()}_EXISTS`,
        message: `${conflictField} already in use`
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Omit sensitive data from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      data: userResponse
    });

  } catch (err) {
    console.error('User creation error:', err);
    res.status(500).json({
      code: 'SERVER_ERROR',
      message: 'Failed to create user'
    });
  }
});

// Get all users (protected, admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        code: 'FORBIDDEN',
        message: 'Insufficient privileges'
      });
    }

    const users = await User.find().select('-password');
    res.json({
      success: true,
      data: users
    });

  } catch (err) {
    console.error('User fetch error:', err);
    res.status(500).json({
      code: 'SERVER_ERROR',
      message: 'Failed to retrieve users'
    });
  }
});

// Get logged-in user details with proper error handling
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password -__v')
      .lean();

    if (!user) {
      return res.status(404).json({
        code: 'USER_NOT_FOUND',
        message: 'User account not found'
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (err) {
    console.error('User fetch error:', err);
    res.status(500).json({
      code: 'SERVER_ERROR',
      message: 'Failed to retrieve user data'
    });
  }
});

export default router;
