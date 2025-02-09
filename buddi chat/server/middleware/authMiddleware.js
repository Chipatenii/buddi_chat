import jwt from 'jsonwebtoken';

// Centralized error messages
const ERROR_MESSAGES = {
  NO_TOKEN: 'Authentication required. Please provide a valid bearer token.',
  INVALID_TOKEN: 'Invalid or malformed authentication token.',
  EXPIRED_TOKEN: 'Session expired. Please log in again.',
  SERVER_ERROR: 'Authentication server error. Please try again later.',
};

const authenticateToken = (req, res, next) => {
  // Prefer lowercase header key for consistency
  const authHeader = req.headers.authorization;
  
  // Validate Authorization header structure
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      code: 'MISSING_CREDENTIALS',
      message: ERROR_MESSAGES.NO_TOKEN,
    });
  }

  // Extract and validate token
  const token = authHeader.split(' ')[1]?.trim();
  if (!token) {
    return res.status(401).json({
      success: false,
      code: 'MALFORMED_TOKEN',
      message: ERROR_MESSAGES.INVALID_TOKEN,
    });
  }

  // Verify token with additional security checks
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable not configured');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'], // Specify allowed algorithms
      ignoreExpiration: false, // Explicitly handle expiration
    });

    // Validate decoded payload structure
    if (!decoded?.id || typeof decoded.id !== 'string') {
      return res.status(401).json({
        success: false,
        code: 'INVALID_TOKEN_PAYLOAD',
        message: ERROR_MESSAGES.INVALID_TOKEN,
      });
    }

    // Attach minimal user information to request
    req.user = {
      id: decoded.id,
      // Add other safe-to-expose claims as needed
      role: decoded.role,
    };

    // Add authentication context to response locals
    res.locals.auth = {
      authenticatedAt: new Date().toISOString(),
      tokenExpires: decoded.exp ? new Date(decoded.exp * 1000).toISOString() : null,
    };

    // Log successful authentication in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Authenticated user ${decoded.id}`);
    }

    next();
  } catch (err) {
    // Handle specific JWT errors
    switch (err.name) {
      case 'TokenExpiredError':
        return res.status(401).json({
          success: false,
          code: 'TOKEN_EXPIRED',
          message: ERROR_MESSAGES.EXPIRED_TOKEN,
          expiresAt: err.expiredAt.toISOString(),
        });

      case 'JsonWebTokenError':
        return res.status(401).json({
          success: false,
          code: 'INVALID_TOKEN',
          message: ERROR_MESSAGES.INVALID_TOKEN,
          details: process.env.NODE_ENV === 'development' ? err.message : undefined,
        });

      case 'NotBeforeError':
        return res.status(401).json({
          success: false,
          code: 'TOKEN_INACTIVE',
          message: 'Token not yet valid',
          activeFrom: err.date.toISOString(),
        });

      default:
        // Log full error for server-side investigation
        console.error('Authentication Error:', {
          error: err.stack,
          token: token.substring(0, 16) + '...', // Partial token for debugging
          path: req.originalUrl,
        });

        return res.status(500).json({
          success: false,
          code: 'AUTH_SERVER_ERROR',
          message: ERROR_MESSAGES.SERVER_ERROR,
          details: process.env.NODE_ENV === 'development' ? err.message : undefined,
        });
    }
  }
};

export default authenticate;