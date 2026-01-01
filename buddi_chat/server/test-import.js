async function testImports() {
    const scripts = [
        'dotenv/config',
        'express',
        'http',
        'mongoose',
        'cors',
        'helmet',
        'express-rate-limit',
        'express-mongo-sanitize',
        'cookie-parser',
        'compression',
        './utils/logger.js',
        './utils/cache.js',
        './sockets/WebSocketManager.js',
        './routes/auth.js',
        './routes/userRoutes.js',
        './routes/chatRoutes.js',
        './middleware/validation.js',
        './middleware/authMiddleware.js',
        './middleware/csrfMiddleware.js'
    ];

    for (const script of scripts) {
        try {
            console.log(`Testing import of: ${script}`);
            await import(script);
            console.log(`✅ Success: ${script}`);
        } catch (err) {
            console.error(`❌ FAILED: ${script}`);
            console.error(err);
            // Don't exit, try others
        }
    }
}

testImports();
