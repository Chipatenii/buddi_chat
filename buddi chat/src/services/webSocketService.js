let socket; // WebSocket instance
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5; // Maximum number of reconnection attempts
const RECONNECT_DELAY = 3000; // Delay (in ms) between reconnection attempts

let heartbeatInterval; // Heartbeat interval ID
const HEARTBEAT_INTERVAL = 10000; // Interval (in ms) for sending pings

/**
 * Connect to the WebSocket server.
 */
export const connectWebSocket = () => {
  console.log('Attempting to connect to WebSocket server...');
  const token = localStorage.getItem('token');

  // Include the token in the WebSocket connection if available
  const wsURL = `ws://localhost:5000?token=${token || ''}`;
  socket = new WebSocket(wsURL);

  socket.onopen = () => {
    console.log('Connected to WebSocket server.');
    reconnectAttempts = 0; // Reset reconnect attempts
    startHeartbeat(); // Start heartbeat mechanism
  };

  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      console.log('Received:', message);
      handleWebSocketMessage(message);
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  };

  socket.onclose = (event) => {
    console.warn(`WebSocket closed: ${event.reason || 'Unknown reason'}`);
    stopHeartbeat(); // Stop heartbeat mechanism
    attemptReconnect();
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
    socket.close(); // Close the socket to trigger reconnection
  };
};

/**
 * Handle incoming WebSocket messages.
 * @param {Object} message - The parsed WebSocket message.
 */
const handleWebSocketMessage = (message) => {
  switch (message.type) {
    case 'ping': // Example: Server ping acknowledgment
      console.log('Ping acknowledged by server.');
      break;
    case 'notification': // Handle notification messages
      console.log('Notification:', message.data);
      break;
    default:
      console.warn('Unhandled WebSocket message type:', message.type);
  }
};

/**
 * Send a message through the WebSocket connection.
 * @param {Object} message - The message to send.
 */
export const sendMessage = (message) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  } else {
    console.warn('WebSocket is not open. Message not sent:', message);
  }
};

/**
 * Close the WebSocket connection.
 */
export const closeWebSocket = () => {
  if (socket) {
    console.log('Closing WebSocket connection...');
    socket.close();
    stopHeartbeat(); // Stop heartbeat mechanism
  }
};

/**
 * Attempt to reconnect the WebSocket after a delay.
 */
const attemptReconnect = () => {
  if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
    reconnectAttempts++;
    console.log(`Reconnecting... (attempt ${reconnectAttempts})`);
    setTimeout(connectWebSocket, RECONNECT_DELAY);
  } else {
    console.error('Max reconnect attempts reached. Unable to reconnect.');
  }
};

/**
 * Start the heartbeat mechanism to keep the WebSocket connection alive.
 */
const startHeartbeat = () => {
  stopHeartbeat(); // Clear any existing interval
  heartbeatInterval = setInterval(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'ping' })); // Send a ping message
    }
  }, HEARTBEAT_INTERVAL);
};

/**
 * Stop the heartbeat mechanism.
 */
const stopHeartbeat = () => {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
};

// Cleanup on window unload
window.addEventListener('beforeunload', () => {
  closeWebSocket();
});