import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import Joi from 'joi';
import rateLimit from 'express-rate-limit';
import User from '../models/User.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Security configuration
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET environment variable not configured');

const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY || '1h';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Rate limiting configuration
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});

// File upload configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// Validation schemas
const userSchema = Joi.object({
  realName: Joi.string().trim().min(2).max(50).required(),
  username: Joi.string().trim().alphanum().min(3).max(30).required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$'))
    .message('Password must contain at least one uppercase letter, one lowercase letter, and one number')
    .required(),
});

const loginSchema = Joi.object({
  username: Joi.string().trim().required(),
  password: Joi.string().required(),
});

// Utility functions
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      sessionId: uuidv4(), // Unique session identifier
      role: user.role || 'user',
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY, algorithm: 'HS256' }
  );
};

const sanitizeUser = (user) => ({
  id: user._id,
  realName: user.realName,
  username: user.username,
  email: user.email,
  role: user.role,
  profilePicture: user.profilePicture?.toString('base64'),
  createdAt: user.createdAt,
});

// Registration endpoint
router.post('/register', authLimiter, upload.single('profilePicture'), async (req, res) => {
  try {
    // Validate input
    const { error } = userSchema.validate(req.body);
    if (error) return res.status(422).json({ 
      code: 'VALIDATION_ERROR', 
      message: error.details[0].message 
    });

    if (!req.file) return res.status(422).json({
      code: 'FILE_REQUIRED',
      message: 'Profile picture is required'
    });

    // Check existing users
    const existingUser = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }]
    });

    if (existingUser) {
      const field = existingUser.username === req.body.username ? 'username' : 'email';
      return res.status(409).json({
        code: `${field.toUpperCase()}_EXISTS`,
        message: `${field} is already registered`
      });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const newUser = new User({
      ...req.body,
      password: hashedPassword,
      profilePicture: req.file.buffer,
      lastLogin: null,
      loginAttempts: 0,
    });

    await newUser.save();

    // Generate token
    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      token,
      user: sanitizeUser(newUser)
    });

  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({
      code: 'SERVER_ERROR',
      message: 'Could not complete registration'
    });
  }
});

// Login endpoint
router.post('/login', authLimiter, async (req, res) => {
  try {
    // Validate input
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(422).json({
      code: 'VALIDATION_ERROR',
      message: error.details[0].message
    });

    // Find user with security considerations
    const user = await User.findOne({ 
      username: req.body.username 
    }).select('+password +loginAttempts +lockedUntil');

    if (!user || user.lockedUntil > Date.now()) {
      return res.status(401).json({
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid username or password'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      user.loginAttempts += 1;
      if (user.loginAttempts >= 5) {
        user.lockedUntil = Date.now() + 15 * 60 * 1000; // 15 minute lock
      }
      await user.save();
      return res.status(401).json({
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid username or password'
      });
    }

    // Reset security counters
    user.loginAttempts = 0;
    user.lockedUntil = null;
    user.lastLogin = Date.now();
    await user.save();

    // Generate token
    const token = generateToken(user);

    return res.json({
      success: true,
      token,
      user: sanitizeUser(user)
    });

  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({
      code: 'SERVER_ERROR',
      message: 'Could not process login'
    });
  }
});

// User info endpoint
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({
      code: 'UNAUTHORIZED',
      message: 'Authentication required'
    });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
    
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({
      code: 'USER_NOT_FOUND',
      message: 'User account not found'
    });

    return res.json({
      success: true,
      user: sanitizeUser(user)
    });

  } catch (error) {
    console.error('User Info Error:', error);
    
    const code = error.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' :
                error.name === 'JsonWebTokenError' ? 'INVALID_TOKEN' : 'SERVER_ERROR';

    return res.status(401).json({
      code,
      message: error.message
    });
  }
});

export default authRoutes = router;

