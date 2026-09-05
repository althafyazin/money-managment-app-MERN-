const express = require('express');
const {
  createIncome,
  getIncomes,
  getIncomeById,
  updateIncome,
  deleteIncome,
} = require('../controllers/incomeController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Guard all income endpoints with JWT protection middleware
router.use(protect);

/**
 * @route   POST /api/v1/incomes
 * @desc    Create a new income record
 * @access  Private
 */
router.post('/', createIncome);

/**
 * @route   GET /api/v1/incomes
 * @desc    Get user incomes with pagination & filters
 * @access  Private
 */
router.get('/', getIncomes);

/**
 * @route   GET /api/v1/incomes/:id
 * @desc    Get details of a single income record
 * @access  Private
 */
router.get('/:id', getIncomeById);

/**
 * @route   PUT /api/v1/incomes/:id
 * @desc    Update an existing income record
 * @access  Private
 */
router.put('/:id', updateIncome);

/**
 * @route   DELETE /api/v1/incomes/:id
 * @desc    Delete an income record
 * @access  Private
 */
router.delete('/:id', deleteIncome);

module.exports = router;
