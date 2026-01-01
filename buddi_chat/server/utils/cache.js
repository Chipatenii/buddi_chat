import { createClient } from 'redis';
import { logger } from './logger.js';

// Create main client
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        return new Error('Redis connection failed permanently');
      }
      return Math.min(retries * 100, 3000); // Exponential backoff up to 3s
    }
  }
});

// Create separate subscriber client
export const subClient = redisClient.duplicate();

redisClient.on('error', (err) => logger.error('Redis Client Error:', err));
subClient.on('error', (err) => logger.error('Redis Sub Client Error:', err));

// Connect both clients in the background
const connectRedis = async () => {
  try {
    await Promise.all([
      redisClient.connect(),
      subClient.connect()
    ]);
    logger.info('✅ Redis connected successfully');
  } catch (error) {
    logger.error('❌ Redis connection failed. Caching and Pub/Sub will be disabled:', error.message);
  }
};

connectRedis();

// Cache middleware
export const cacheMiddleware = (duration = 300) => async (req, res, next) => {
  if (req.method !== 'GET') {
    return next();
  }

  const key = `cache:${req.originalUrl}`;

  try {
    const cachedResponse = await redisClient.get(key);
    if (cachedResponse) {
      return res.json(JSON.parse(cachedResponse));
    }

    // Store original res.json
    const originalJson = res.json;
    res.json = function (data) {
      redisClient.setEx(key, duration, JSON.stringify(data))
        .catch(err => logger.error('Cache set error:', err));
      return originalJson.call(this, data);
    };

    next();
  } catch (error) {
    logger.error('Cache middleware error:', error);
    next();
  }
};

// Cache invalidation
export const invalidateCache = async (pattern) => {
  try {
    const keys = await redisClient.keys(`cache:${pattern}`);
    if (keys.length > 0) {
      await redisClient.del(keys);
      logger.info(`Invalidated ${keys.length} cache entries for pattern: ${pattern}`);
    }
  } catch (error) {
    logger.error('Cache invalidation error:', error);
  }
};

// Cache helper functions
export const getCache = async (key) => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error('Cache get error:', error);
    return null;
  }
};

export const setCache = async (key, value, duration = 300) => {
  try {
    await redisClient.setEx(key, duration, JSON.stringify(value));
  } catch (error) {
    logger.error('Cache set error:', error);
  }
};

export default redisClient; 
