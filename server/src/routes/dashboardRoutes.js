const express = require('express');
const { getSummary, getCharts, getRecent } = require('../controllers/dashboardController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Protect all dashboard endpoints with JWT authentication middleware
router.use(protect);

/**
 * @route   GET /api/v1/dashboard/summary
 * @desc    Get financial summary KPIs (lifetime, current month, MoM growth)
 * @access  Private
 */
router.get('/summary', getSummary);

/**
 * @route   GET /api/v1/dashboard/charts
 * @desc    Get chart datasets (category breakdown pie chart & monthly trends area chart)
 * @access  Private
 */
router.get('/charts', getCharts);

/**
 * @route   GET /api/v1/dashboard/recent
 * @desc    Get recent unified transactions feed (expenses + incomes)
 * @access  Private
 */
router.get('/recent', getRecent);

module.exports = router;
