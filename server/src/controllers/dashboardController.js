const dashboardService = require('../services/dashboardService');
const { sendSuccess } = require('../utils/response');

/**
 * Get Dashboard Financial Summary Controller
 */
const getSummary = async (req, res, next) => {
  try {
    const summary = await dashboardService.getFinancialSummary(req.user._id);
    return sendSuccess(res, 200, 'Financial summary retrieved successfully', summary);
  } catch (error) {
    next(error);
  }
};

/**
 * Get Dashboard Visual Charts Data Controller
 */
const getCharts = async (req, res, next) => {
  try {
    const { timeframe } = req.query;
    const monthsCount = timeframe === '12months' ? 12 : 6;
    const chartsData = await dashboardService.getChartData(req.user._id, monthsCount);
    return sendSuccess(res, 200, 'Dashboard charts data retrieved successfully', chartsData);
  } catch (error) {
    next(error);
  }
};

/**
 * Get Recent Transactions Feed Controller
 */
const getRecent = async (req, res, next) => {
  try {
    const { limit } = req.query;
    const transactions = await dashboardService.getRecentTransactions(req.user._id, limit);
    return sendSuccess(res, 200, 'Recent transactions retrieved successfully', { transactions });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSummary,
  getCharts,
  getRecent,
};
