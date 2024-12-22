const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => console.error('DB Connection Error:', err));

// API Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// WebSocket Events
wss.on('connection', (ws) => {
    console.log('New WebSocket connection');

    ws.on('message', (data) => {
        const message = JSON.parse(data);
        console.log('Message received:', message);
        ws.send(JSON.stringify({ message: 'Message received!' }));
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed');
    });
});

// Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
