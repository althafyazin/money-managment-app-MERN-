const app = require('./src/app');
const config = require('./src/config/env');
const connectDB = require('./src/config/db');

// Connect to Database
connectDB();

// Start HTTP Server
const server = app.listen(config.port, () => {
  console.log(`==================================================`);
  console.log(`🚀 FinanceFlow Server running in [${config.nodeEnv.toUpperCase()}] mode`);
  console.log(`📡 URL: http://localhost:${config.port}`);
  console.log(`🏥 Health Check: http://localhost:${config.port}/api/v1/health`);
  console.log(`==================================================`);
});

// Handle Unhandled Promise Rejections gracefully
process.on('unhandledRejection', (err) => {
  console.error(`[CRITICAL ERROR] Unhandled Promise Rejection: ${err.message}`);
  // Gracefully close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
  console.error(`[CRITICAL ERROR] Uncaught Exception: ${err.message}`);
  process.exit(1);
});
