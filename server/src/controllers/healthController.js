const healthService = require('../services/healthService');
const { sendSuccess } = require('../utils/response');

/**
 * Health Controller
 * Thin controller responsible solely for request delegation and HTTP formatting.
 */
const getHealthStatus = async (req, res, next) => {
  try {
    const healthData = await healthService.getSystemHealth();
    return sendSuccess(res, 200, 'FinanceFlow system is running smoothly', healthData);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHealthStatus,
};
