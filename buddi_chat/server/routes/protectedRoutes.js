const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// ======================== Configuration ========================
const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator'
};

const ROUTE_LIMITER = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});

// ======================== Middlewares ========================
// Enhanced security headers
router.use(helmet());
router.use(helmet.hsts({
  maxAge: 63072000, // 2 years in seconds
  includeSubDomains: true,
  preload: true
}));

// Structured logging middleware
router.use((req, res, next) => {
  const start = Date.now();
  const requestId = uuidv4();
  
  res.on('finish', () => {
    console.log(JSON.stringify({
      requestId,
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: Date.now() - start + 'ms',
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      userId: req.user?.id || 'anonymous'
    }));
  });
  
  next();
});

// ======================== Utility Functions ========================
const handleAsync = (fn) => (req, res, next) => 
  Promise.resolve(fn(req, res, next)).catch(next);

const createRoleCheck = (...allowedRoles) => (req, res, next) => {
  if (!req.user?.role || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      code: 'FORBIDDEN',
      message: 'Insufficient permissions',
      requiredRoles: allowedRoles,
      currentRole: req.user?.role
    });
  }
  next();
};

// ======================== Routes ========================
/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get current user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 */
router.get('/profile', ROUTE_LIMITER, authenticateToken, handleAsync(async (req, res) => {
  const userProfile = {
    id: req.user.id,
    username: req.user.username,
    email: req.user.email,
    role: req.user.role,
    createdAt: req.user.createdAt,
    lastLogin: req.user.lastLogin
  };

  res.status(200).json({
    success: true,
    data: userProfile,
    meta: {
      requestId: res.locals.requestId,
      timestamp: new Date().toISOString()
    }
  });
}));

/**
 * @swagger
 * /admin:
 *   get:
 *     summary: Admin dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin access granted
 */
router.get('/admin', 
  ROUTE_LIMITER,
  authenticateToken,
  createRoleCheck(ROLES.ADMIN, ROLES.MODERATOR),
  handleAsync(async (req, res) => {
    res.status(200).json({
      success: true,
      data: {
        message: 'Admin dashboard',
        sensitiveActions: [],
        auditLog: []
      },
      meta: {
        userRole: req.user.role,
        accessLevel: 'admin'
      }
    });
  })
);

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Get current user details
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details
 */
router.get('/me', 
  ROUTE_LIMITER,
  authenticateToken,
  handleAsync(async (req, res) => {
    // Example of fetching fresh data from DB
    const freshUserData = await User.findById(req.user.id)
      .select('-password -loginAttempts -lockedUntil')
      .lean();

    res.status(200).json({
      success: true,
      data: freshUserData,
      meta: {
        cache: false,
        requestedAt: new Date().toISOString()
      }
    });
  })
);

// ======================== Error Handling ========================
router.use((err, req, res, next) => {
  console.error('Route Error:', {
    error: err.stack,
    userId: req.user?.id,
    path: req.path,
    params: req.params
  });

  res.status(err.status || 500).json({
    success: false,
    code: err.code || 'SERVER_ERROR',
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = router;