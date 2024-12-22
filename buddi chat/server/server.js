const express = require('express');
const http = require('http');
const { setupWebSocket } = require('./sockets/socket');

const app = express();
const server = http.createServer(app);

setupWebSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
