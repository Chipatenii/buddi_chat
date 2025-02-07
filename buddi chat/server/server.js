import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import { logger, morganStream } from "./utils/logger.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";  // Updated import
import { joiErrorHandler } from "./middleware/validation.js";
import authenticate from "./middleware/authMiddleware.js";

// Initialize Express app
const app = express();

// ======================== Database Configuration ========================
const mongooseConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: process.env.NODE_ENV === 'development',
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4, // Force IPv4
};

mongoose.connect(process.env.MONGO_URI, mongooseConfig)
  .then(() => logger.info('✅ MongoDB connection established'))
  .catch((err) => {
    logger.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

mongoose.connection.on('disconnected', () => 
  logger.warn('⚠️ MongoDB connection lost'));

// ======================== Security Middleware ========================
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "data:", "https://*.amazonaws.com"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 600,
  preflightContinue: false,
}));

// ======================== Rate Limiting ========================
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'test',
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded: ${req.ip}`);
    res.status(429).json({
      code: 'RATE_LIMITED',
      message: 'Too many requests, please try again later'
    });
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  skip: (req) => req.method === 'OPTIONS',
  keyGenerator: (req) => req.ip + req.body?.email,
});

// ======================== Application Middleware ========================
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));
app.use(mongoSanitize());
app.use((req, res, next) => {
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('X-Powered-By', 'Buddi Chat');
  next();
});

// ======================== Route Configuration ========================
// Public routes
app.use('/api/auth', authLimiter, authRoutes);

// Authenticated routes
app.use('/api/users', apiLimiter, authenticate, userRoutes);
app.use('/api/chat', apiLimiter, authenticate, chatRoutes);  // Updated route mounting

// ======================== Error Handling ========================
app.use(joiErrorHandler);
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';
  
  logger.error(`❗ ${statusCode} Error: ${err.message}`, {
    path: req.path,
    method: req.method,
    stack: isProduction ? undefined : err.stack
  });

  res.status(statusCode).json({
    success: false,
    code: err.code || 'INTERNAL_ERROR',
    message: isProduction && statusCode === 500 
      ? 'Internal server error' 
      : err.message,
    ...(!isProduction && { stack: err.stack })
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    code: 'NOT_FOUND',
    message: 'Resource not found'
  });
});

// ======================== Server Initialization ========================
const PORT = process.env.PORT || 5001;
const server = http.createServer(app);

const shutdown = async (signal) => {
  logger.info(`🛑 Received ${signal}, shutting down gracefully...`);
  try {
    await mongoose.connection.close();
    server.close(() => {
      logger.info('⏏️ Server and database connections closed');
      process.exit(0);
    });
  } catch (err) {
    logger.error('❌ Shutdown error:', err);
    process.exit(1);
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('uncaughtException', shutdown);
process.on('unhandledRejection', (reason) => {
  logger.error('💥 Unhandled Rejection:', reason);
  shutdown('unhandledRejection');
});

server.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.debug(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.debug(`Allowed origins: ${process.env.ALLOWED_ORIGINS}`);
});