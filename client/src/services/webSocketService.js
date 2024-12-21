const WEBSOCKET_URL = 'ws://localhost:3000'; // Replace with your backend WebSocket URL

let socket = null;

export const connectWebSocket = () => {
    if (!socket) {
        socket = new WebSocket(WEBSOCKET_URL);

        socket.onopen = () => {
            console.log('WebSocket connection established.');
        };

        socket.onmessage = (event) => {
            console.log('Message received:', event.data);
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed.');
        };
    }
};

export const sendMessage = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
    } else {
        console.error('WebSocket is not connected.');
    }
};

export const closeWebSocket = () => {
    if (socket) {
        socket.close();
        socket = null;
    }
};
