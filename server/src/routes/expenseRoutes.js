const express = require('express');
const {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} = require('../controllers/expenseController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Guard all expense endpoints with JWT authentication middleware
router.use(protect);

/**
 * @route   POST /api/v1/expenses
 * @desc    Create a new expense record
 * @access  Private
 */
router.post('/', createExpense);

/**
 * @route   GET /api/v1/expenses
 * @desc    Get user expenses with pagination & filters
 * @access  Private
 */
router.get('/', getExpenses);

/**
 * @route   GET /api/v1/expenses/:id
 * @desc    Get details of a single expense record
 * @access  Private
 */
router.get('/:id', getExpenseById);

/**
 * @route   PUT /api/v1/expenses/:id
 * @desc    Update an existing expense record
 * @access  Private
 */
router.put('/:id', updateExpense);

/**
 * @route   DELETE /api/v1/expenses/:id
 * @desc    Delete an expense record
 * @access  Private
 */
router.delete('/:id', deleteExpense);

module.exports = router;
