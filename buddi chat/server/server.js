const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors
require('dotenv').config(); // Load environment variables
const { setupWebSocket } = require('./sockets/socket'); // WebSocket setup function
const authRoutes = require('./routes/auth'); // Auth routes
const protectedRoutes = require('./routes/protectedRoutes'); // Protected routes
const userRoutes = require('./routes/userRoutes'); // User routes

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Enable CORS (allow all origins for development; restrict in production)
app.use(cors());

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/buddi_chat';
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true, // Recommended options
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Route handlers
app.use('/api/auth', authRoutes); // Auth-related routes
app.use('/api/protected', protectedRoutes); // Protected routes
app.use('/api/user', userRoutes); // User-related routes

// Create the HTTP server
const server = http.createServer(app);

// Initialize WebSocket functionality
setupWebSocket(server);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});