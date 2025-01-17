const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer'); // For file uploads
require('dotenv').config();
const { setupWebSocket } = require('./sockets/socket');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protectedRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Enable CORS
app.use(cors());

// Static folder for uploaded files
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/buddi_chat';
mongoose
    .connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

// Route handlers
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/user', userRoutes);

// Create the HTTP server
const server = http.createServer(app);

// Initialize WebSocket functionality
setupWebSocket(server);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
