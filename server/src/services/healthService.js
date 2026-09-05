const mongoose = require('mongoose');

/**
 * Health Service
 * Encapsulates system health checks and database status diagnostics.
 */
class HealthService {
  /**
   * Retrieves overall system health parameters.
   * @returns {Object} System health info object
   */
  async getSystemHealth() {
    // Mongoose connection state: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    const dbStateMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    const dbStatus = dbStateMap[mongoose.connection.readyState] || 'unknown';

    return {
      status: 'online',
      uptime: `${process.uptime().toFixed(2)} seconds`,
      timestamp: new Date().toISOString(),
      database: {
        status: dbStatus,
        host: mongoose.connection.host || 'N/A',
        name: mongoose.connection.name || 'N/A',
      },
    };
  }
}

module.exports = new HealthService();
