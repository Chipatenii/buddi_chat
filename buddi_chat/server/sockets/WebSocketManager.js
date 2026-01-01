import WebSocket from 'ws';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger.js';
import redisClient, { getCache, setCache, subClient } from '../utils/cache.js';

class WebSocketManager {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map();
    this.messageQueue = new Map();
    this.userMessageCounts = new Map(); // Track messages per user for rate limiting
    this.batchInterval = 100; // ms
    this.maxBatchSize = 50;
    this.rateLimitWindow = 60000; // 1 minute
    this.maxMessagesPerWindow = 60; // 1 message per second average

    this.init();
    this.setupPubSub();
  }

  init() {
    this.wss.on('connection', async (ws, req) => {
      const auth = this.authenticate(req);
      if (!auth.success) {
        ws.close(1008, auth.message);
        return;
      }

      const { userId } = auth;

      // Store user's room memberships on the socket object for fast filtering
      // You might want to fetch these from DB or keep them updated
      ws.userId = userId;

      this.clients.set(userId, ws);
      this.setupMessageHandling(ws, userId);
      this.setupPingPong(ws);
      this.setupErrorHandling(ws, userId);
    });

    // Start message batching
    setInterval(() => this.processMessageBatches(), this.batchInterval);
  }

  async setupPubSub() {
    try {
      await subClient.subscribe('chat_messages', (message) => {
        const payload = JSON.parse(message);
        this.broadcastToLocalClients(payload.roomId, payload.data);
      });
      logger.info('Connected to Redis Pub/Sub channel: chat_messages');
    } catch (error) {
      logger.error('Redis Pub/Sub setup error:', error);
    }
  }

  authenticate(req) {
    try {
      const url = new URL(req.url, `http://${req.headers.host}`);
      let token = url.searchParams.get('token');

      // Fallback to cookies if token isn't in query params
      if (!token && req.headers.cookie) {
        const cookies = Object.fromEntries(
          req.headers.cookie.split('; ').map(c => c.split('='))
        );
        token = cookies.token;
      }

      if (!token) {
        return { success: false, message: 'Authentication token missing' };
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET, {
        algorithms: ['HS256']
      });

      return {
        success: true,
        userId: decoded.userId || decoded.id, // Support both formats found in the app
        role: decoded.role
      };
    } catch (error) {
      logger.error('WebSocket Authentication Error:', error.message);
      return { success: false, message: 'Invalid or expired token' };
    }
  }

  checkRateLimit(userId) {
    const now = Date.now();
    const userStats = this.userMessageCounts.get(userId) || { count: 0, startTime: now };

    if (now - userStats.startTime > this.rateLimitWindow) {
      // Reset window
      userStats.count = 1;
      userStats.startTime = now;
    } else {
      userStats.count++;
    }

    this.userMessageCounts.set(userId, userStats);
    return userStats.count <= this.maxMessagesPerWindow;
  }

  setupMessageHandling(ws, userId) {
    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data);

        // Rate limiting check
        if (!this.checkRateLimit(userId)) {
          ws.send(JSON.stringify({
            type: 'error',
            payload: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many messages sent. Please slow down.' }
          }));
          return;
        }

        // Add to message queue for batching
        if (!this.messageQueue.has(message.roomId)) {
          this.messageQueue.set(message.roomId, []);
        }
        this.messageQueue.get(message.roomId).push({
          ...message,
          userId,
          timestamp: Date.now()
        });

        // Process immediately if queue is full
        if (this.messageQueue.get(message.roomId).length >= this.maxBatchSize) {
          await this.processMessageBatches();
        }
      } catch (error) {
        logger.error('WebSocket message handling error:', error);
      }
    });
  }

  async processMessageBatches() {
    for (const [roomId, messages] of this.messageQueue.entries()) {
      if (messages.length === 0) continue;

      try {
        // Cache the latest messages
        const cacheKey = `room:${roomId}:messages`;
        const cachedMessages = await getCache(cacheKey) || [];
        const updatedMessages = [...cachedMessages, ...messages].slice(-100); // Keep last 100 messages
        await setCache(cacheKey, updatedMessages);

        // Publish to Redis for cross-instance broadcasting
        await redisClient.publish('chat_messages', JSON.stringify({
          roomId,
          data: {
            type: 'message_batch',
            messages
          }
        }));

        // Clear the queue
        this.messageQueue.set(roomId, []);
      } catch (error) {
        logger.error('Message batch processing error:', error);
      }
    }
  }

  setupPingPong(ws) {
    ws.isAlive = true;
    ws.on('pong', () => {
      ws.isAlive = true;
    });
  }

  setupErrorHandling(ws, userId) {
    ws.on('error', (error) => {
      logger.error(`WebSocket error for user ${userId}:`, error);
    });

    ws.on('close', () => {
      this.clients.delete(userId);
      logger.info(`Client disconnected: ${userId}`);
    });
  }

  // Broadcast to local clients connected TO THIS INSTANCE
  async broadcastToLocalClients(roomId, data) {
    const message = JSON.stringify(data);

    // In a real app, you would check if the user is a member of the room
    // For now, we broadcast to all connected clients on this instance
    // To be more efficient, we could maintain a Map of roomId -> Set of userIds
    this.clients.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    });
  }

  // Legacy method replaced by Pub/Sub
  broadcastToRoom(roomId, data) {
    this.broadcastToLocalClients(roomId, data);
  }

  // Health check for connections
  startHealthCheck() {
    setInterval(() => {
      this.wss.clients.forEach((ws) => {
        if (ws.isAlive === false) {
          return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
      });
    }, 30000);
  }
}

export default WebSocketManager; 
