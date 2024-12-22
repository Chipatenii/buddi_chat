const WebSocket = require('ws');

let clients = [];

const setupWebSocket = (server) => {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log('New client connected');
        clients.push(ws);

        ws.on('message', (message) => {
            console.log(`Received: ${message}`);
            // Broadcast the message to all clients
            clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        });

        ws.on('close', () => {
            console.log('Client disconnected');
            clients = clients.filter((client) => client !== ws);
        });
    });
};

module.exports = { setupWebSocket };