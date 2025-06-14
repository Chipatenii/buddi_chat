import { createClient } from 'redis';
import { logger } from './logger.js';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        logger.error('Redis max retries reached');
        return new Error('Redis max retries reached');
      }
      return Math.min(retries * 100, 3000);
    }
  }
});

redisClient.on('error', (err) => logger.error('Redis Client Error:', err));
redisClient.on('connect', () => logger.info('Redis Client Connected'));

await redisClient.connect();

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
    res.json = function(data) {
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