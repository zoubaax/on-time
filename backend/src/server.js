import app from './app.js';
import dotenv from 'dotenv';
import { testConnection } from './config/database.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Start server
 */
const startServer = async () => {
    try {
        // Test database connection
        console.log('🔍 Testing Supabase connection...');
        await testConnection();

        // Start Express server
        app.listen(PORT, () => {
            console.log('');
            console.log('🚀 ================================ 🚀');
            console.log(`✅ Server running in ${NODE_ENV} mode`);
            console.log(`✅ Server listening on port ${PORT}`);
            console.log(`✅ API URL: http://localhost:${PORT}`);
            console.log(`✅ Health Check: http://localhost:${PORT}/api/health`);
            console.log('🚀 ================================ 🚀');
            console.log('');
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Promise Rejection:', err);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('👋 SIGINT received. Shutting down gracefully...');
    process.exit(0);
});

// Start the server
startServer();
