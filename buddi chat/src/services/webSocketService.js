let socket;

export const connectWebSocket = () => {
    socket = new WebSocket('ws://localhost:5000');

    socket.onopen = () => {
        console.log('Connected to WebSocket server');
    };

    socket.onmessage = (event) => {
        try {
            const message = JSON.parse(event.data);
            console.log('Received:', message);
        } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
        }
    };

    socket.onclose = () => {
        console.log('Disconnected from WebSocket server');
    };

    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
};

export const sendMessage = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
    } else {
        console.warn('WebSocket is not open. Message not sent:', message);
    }
};

export const closeWebSocket = () => {
    if (socket) {
        socket.close();
    }
};