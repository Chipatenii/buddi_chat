const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const mongoSanitize = require("express-mongo-sanitize");
const { logger, morganStream } = require("./utils/logger");
const authRoutes = require("./routes/auth");
const protectedRoutes = require("./routes/protectedRoutes");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const { joiErrorHandler } = require("./middleware/validation");
const authenticate = require("./middleware/authMiddleware");

dotenv.config();
const app = express();

// ======================== Database Connection ========================
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/buddi_chat";

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: process.env.NODE_ENV !== 'production',
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
};

mongoose.connect(mongoURI, mongooseOptions)
  .then(() => logger.info("✅ MongoDB connected"))
  .catch(err => {
    logger.error("❌ DB Connection Error:", err);
    process.exit(1);
  });

mongoose.connection.on('disconnected', () => 
  logger.warn('MongoDB connection disconnected'));

// ======================== Middleware Configuration ========================
// Security Headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https://*.example.com"]
    }
  },
  hsts: {
    maxAge: 63072000,
    includeSubDomains: true,
    preload: true
  }
}));

// Request Logging
app.use(require('morgan')('combined', { stream: morganStream }));

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many login attempts, please try again later'
});

// CORS Configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(",") 
    : ["http://localhost:3000", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  maxAge: 86400
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Body Parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data Sanitization
app.use(mongoSanitize());

// ======================== Route Configuration ========================
// Public Routes
app.use("/api/auth", authLimiter, authRoutes);

// Protected Routes
app.use("/api/users", apiLimiter, authenticate, userRoutes);
app.use("/api/chat", apiLimiter, authenticate, chatRoutes);
app.use("/api/protected", apiLimiter, authenticate, protectedRoutes);

// ======================== Error Handling ========================
app.use(joiErrorHandler);
app.use((err, req, res, next) => {
  logger.error(`⚠️ Error: ${err.message}`, {
    path: req.path,
    method: req.method,
    stack: err.stack
  });

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Internal Server Error' : err.message;
  
  res.status(statusCode).json({
    success: false,
    code: err.code || 'SERVER_ERROR',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    code: 'NOT_FOUND',
    message: 'Resource not found' 
  });
});

// ======================== Server Initialization ========================
const server = http.createServer(app);
const PORT = process.env.PORT || 5001;

const shutdown = (signal) => {
  logger.info(`Received ${signal}, shutting down gracefully...`);
  server.close(async () => {
    await mongoose.connection.close();
    logger.info('🛑 Server and database connections closed');
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('unhandledRejection', (err) => {
  logger.error('🔥 Unhandled Promise Rejection:', err);
  shutdown('unhandledRejection');
});

server.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  if (process.env.NODE_ENV === 'development') {
    logger.debug('Development mode enabled');
  }
});