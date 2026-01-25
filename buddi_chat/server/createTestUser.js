import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = 'mongodb+srv://innocentmanda70:%40Eleanor0422@buddichat.i6vfdov.mongodb.net/?appName=buddichat';

async function createTestUser() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const testUser = {
            name: 'Test Administrator',
            username: 'testadmin',
            email: 'testadmin@example.com',
            password: 'Password123!',
            role: 'admin',
            active: true,
            profilePicture: 'https://via.placeholder.com/150'
        };

        const existing = await User.findOne({ username: testUser.username });
        if (existing) {
            console.log('Test user already exists');
        } else {
            const user = new User(testUser);
            // Password hashing is handled by pre-save middleware in User.js
            await user.save();
            console.log('Test user created successfully');
        }

        process.exit(0);
    } catch (err) {
        console.error('Error creating test user:', err);
        process.exit(1);
    }
}

createTestUser();
