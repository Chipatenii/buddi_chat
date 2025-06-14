import WebSocket from 'ws';
import { logger } from '../utils/logger.js';
import { getCache, setCache } from '../utils/cache.js';

class WebSocketManager {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map();
    this.messageQueue = new Map();
    this.batchInterval = 100; // ms
    this.maxBatchSize = 50;
    
    this.init();
  }

  init() {
    this.wss.on('connection', (ws, req) => {
      const userId = this.getUserIdFromRequest(req);
      if (!userId) {
        ws.close(1008, 'Unauthorized');
        return;
      }

      this.clients.set(userId, ws);
      this.setupMessageHandling(ws, userId);
      this.setupPingPong(ws);
      this.setupErrorHandling(ws, userId);
    });

    // Start message batching
    setInterval(() => this.processMessageBatches(), this.batchInterval);
  }

  getUserIdFromRequest(req) {
    // Extract user ID from request (implement based on your auth system)
    return req.headers['user-id'];
  }

  setupMessageHandling(ws, userId) {
    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data);
        
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

        // Broadcast to room members
        this.broadcastToRoom(roomId, {
          type: 'message_batch',
          messages
        });

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

  broadcastToRoom(roomId, data) {
    const message = JSON.stringify(data);
    this.clients.forEach((ws, userId) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    });
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