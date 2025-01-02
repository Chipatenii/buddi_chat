const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors
const { setupWebSocket } = require('./sockets/socket');
const protectedRoutes = require('./routes/protectedRoutes');
const authRoutes = require('./routes/auth'); // Import auth routes
require('dotenv').config();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Enable CORS
app.use(cors());

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/buddi_chat';
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// Use auth routes
app.use('/api/auth', authRoutes);

// Use protected routes
app.use('/api/protected', protectedRoutes);

const server = http.createServer(app);

setupWebSocket(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});