import 'dotenv/config';
import express from 'express';
console.log('1. Express imported');
import http from 'http';
console.log('2. HTTP imported');
import mongoose from 'mongoose';
console.log('3. Mongoose imported');
import { logger } from './utils/logger.js';
console.log('4. Logger imported');
import authRoutes from './routes/auth.js';
console.log('5. Auth routes imported');

const app = express();
console.log('6. App initialized');
const server = http.createServer(app);
console.log('7. Server created');

console.log('Attempting to connect to MongoDB:', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/buddi_chat')
    .then(() => {
        console.log('8. MongoDB connected');
        server.listen(5001, () => {
            console.log('9. Server listening on port 5001');
            process.exit(0);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });
