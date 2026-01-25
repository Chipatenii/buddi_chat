import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '.env') });

const MONGO_URI = process.env.MONGO_URI;

console.log('Attempting to connect to:', MONGO_URI.replace(/:([^:@]+)@/, ':****@'));

async function test() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connection Successful!');
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));
        process.exit(0);
    } catch (err) {
        console.error('❌ Connection Failed:', err.message);
        if (err.message.includes('authentication failed')) {
            console.log('TIP: Check if the password contains special characters that need encoding.');
        }
        process.exit(1);
    }
}

test();
