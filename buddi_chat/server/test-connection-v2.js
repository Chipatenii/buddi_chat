import mongoose from 'mongoose';

const host = 'buddichat.i6vfdov.mongodb.net';
const user = 'innocentmanda70';
const pass = '@Eleanor0422';
const dbName = 'buddi_chat';

async function test() {
    try {
        const uri = `mongodb+srv://${host}/?appName=buddichat`;
        console.log(`Connecting to ${host} as ${user}...`);

        await mongoose.connect(uri, {
            user: user,
            pass: pass,
            dbName: dbName
        });

        console.log('✅ Connection Successful!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Connection Failed:', err.message);
        process.exit(1);
    }
}

test();
