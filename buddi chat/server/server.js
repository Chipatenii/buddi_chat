const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const { setupWebSocket } = require('./sockets/socket');
const protectedRoutes = require('./routes/protectedRoutes');

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/buddi_chat';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Use protected routes
app.use('/api/protected', protectedRoutes);

const server = http.createServer(app);

setupWebSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});