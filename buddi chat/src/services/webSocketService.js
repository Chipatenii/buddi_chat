`import logger from '../utils/logger';`.
import { fetchLoggedInUser } from './apiService';

const WS_CONFIG = {
  RECONNECT_BASE_DELAY: 1000,
  MAX_RECONNECT_ATTEMPTS: 5,
  HEARTBEAT_INTERVAL: 15000,
  PONG_TIMEOUT: 5000,
};

class WebSocketService {
  constructor() {
    this.socket = null;
    this.reconnectAttempts = 0;
    this.heartbeatTimer = null;
    this.pongTimeout = null;
    this.eventListeners = new Map();
    this.connectionId = null;
  }

  connect = async () => {
    if (this.socket) this.disconnect();

    try {
      const token = localStorage.getItem('authToken');
      const user = await fetchLoggedInUser();
      this.connectionId = crypto.randomUUID();
      
      const wsURL = new URL(import.meta.env.VITE_WS_URL || 'ws://localhost:5001');
      wsURL.searchParams.set('userId', user.id);
      wsURL.searchParams.set('connectionId', this.connectionId);
      
      this.socket = new WebSocket(wsURL.toString());
      this.setupEventHandlers();
    } catch (error) {
      logger.error('WebSocket connection failed:', error);
      this.scheduleReconnect();
    }
  };

  setupEventHandlers = () => {
    this.socket.onopen = () => {
      logger.info('WebSocket connected');
      this.reconnectAttempts = 0;
      this.startHeartbeat();
      this.emit('connected');
    };

    this.socket.onmessage = (event) => {
      try {
        const message = this.validateMessage(event.data);
        this.handleProtocolMessage(message);
        this.emit(message.type, message.payload);
      } catch (error) {
        logger.error('Message handling failed:', error);
      }
    };

    this.socket.onclose = (event) => {
      logger.warn(`WebSocket closed: ${event.code} - ${event.reason}`);
      this.cleanup();
      this.handleCloseEvent(event);
    };

    this.socket.onerror = (error) => {
      logger.error('WebSocket error:', error);
    };
  };

  validateMessage = (rawData) => {
    const message = JSON.parse(rawData);
    
    // Basic message validation schema
    if (!message.type || !message.payload) {
      throw new Error('Invalid message format');
    }
    
    return message;
  };

  handleProtocolMessage = (message) => {
    switch (message.type) {
      case 'pong':
        this.clearPongTimeout();
        break;
      case 'auth_challenge':
        this.handleAuthChallenge(message.payload);
        break;
      case 'session_expired':
        this.handleSessionExpired();
        break;
    }
  };

  handleAuthChallenge = async (challenge) => {
    try {
      const signature = await this.signChallenge(challenge);
      this.send('auth_response', { signature });
    } catch (error) {
      logger.error('Auth challenge failed:', error);
      this.disconnect();
    }
  };

  handleSessionExpired = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login?session_expired=true';
  };

  startHeartbeat = () => {
    this.heartbeatTimer = setInterval(() => {
      this.send('ping');
      this.pongTimeout = setTimeout(() => {
        logger.warn('Pong timeout - reconnecting...');
        this.disconnect();
      }, WS_CONFIG.PONG_TIMEOUT);
    }, WS_CONFIG.HEARTBEAT_INTERVAL);
  };

  clearPongTimeout = () => {
    if (this.pongTimeout) {
      clearTimeout(this.pongTimeout);
      this.pongTimeout = null;
    }
  };

  send = (type, payload = {}) => {
    if (this.socket?.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({
        type,
        payload: {
          ...payload,
          connectionId: this.connectionId,
          timestamp: Date.now()
        }
      });
      this.socket.send(message);
    }
  };

  on = (eventType, callback) => {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, new Set());
    }
    this.eventListeners.get(eventType).add(callback);
  };

  off = (eventType, callback) => {
    if (this.eventListeners.has(eventType)) {
      this.eventListeners.get(eventType).delete(callback);
    }
  };

  emit = (eventType, data) => {
    if (this.eventListeners.has(eventType)) {
      this.eventListeners.get(eventType).forEach(callback => callback(data));
    }
  };

  cleanup = () => {
    this.clearPongTimeout();
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  };

  disconnect = () => {
    if (this.socket) {
      this.socket.close(1000, 'Client initiated disconnect');
      this.socket = null;
    }
    this.cleanup();
  };

  handleCloseEvent = (event) => {
    if (![1000, 1001].includes(event.code)) {
      this.scheduleReconnect();
    }
  };

  scheduleReconnect = () => {
    if (this.reconnectAttempts < WS_CONFIG.MAX_RECONNECT_ATTEMPTS) {
      const delay = WS_CONFIG.RECONNECT_BASE_DELAY * Math.pow(2, this.reconnectAttempts);
      this.reconnectAttempts++;
      setTimeout(() => this.connect(), delay + Math.random() * 500);
    }
  };
}

// Singleton instance
export const webSocketService = new WebSocketService();

// Auto-reconnect when visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && !webSocketService.socket) {
    webSocketService.connect();
  }
});