const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize, errors, json } = format;
const path = require('path');
const fs = require('fs');

// Create logs directory if it doesn't exist
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Custom format for development
const devFormat = printf(({ level, message, timestamp, stack }) => {
  let msg = `${timestamp} [${level}]: ${stack || message}`;
  return msg;
});

// Custom format for production
const prodFormat = printf(({ level, message, timestamp, ...metadata }) => {
  const metaString = Object.keys(metadata).length ? JSON.stringify(metadata) : '';
  return `${timestamp} [${level}] ${message} ${metaString}`;
});

// Base logger configuration
const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    process.env.NODE_ENV === 'production' ? json() : combine(colorize(), devFormat)
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: path.join(logDir, 'combined.log'),
      level: 'info'
    }),
    new transports.File({
      filename: path.join(logDir, 'errors.log'),
      level: 'error'
    })
  ],
  exceptionHandlers: [
    new transports.File({ filename: path.join(logDir, 'exceptions.log') })
  ],
  rejectionHandlers: [
    new transports.File({ filename: path.join(logDir, 'rejections.log') })
  ]
});

// Morgan stream for HTTP request logging
const morganStream = {
  write: (message) => {
    logger.info(message.trim());
  }
};

// If we're not in production, add debug transport
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.File({
    filename: path.join(logDir, 'debug.log'),
    level: 'debug',
    format: combine(
      timestamp(),
      prodFormat
    )
  }));
}

// Handle logger errors
logger.on('error', (error) => {
  console.error('Logger Error:', error);
});

module.exports = { 
  logger,
  morganStream 
};