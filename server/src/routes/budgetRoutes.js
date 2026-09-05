const express = require('express');
const {
  createOrUpdateBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
} = require('../controllers/budgetController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Guard all budget routes with JWT authentication middleware
router.use(protect);

/**
 * @route   POST /api/v1/budgets
 * @desc    Create or upsert a category budget target
 * @access  Private
 */
router.post('/', createOrUpdateBudget);

/**
 * @route   GET /api/v1/budgets
 * @desc    Get user budgets for a specified month/year with spending progress
 * @access  Private
 */
router.get('/', getBudgets);

/**
 * @route   PUT /api/v1/budgets/:id
 * @desc    Update a budget's limit amount
 * @access  Private
 */
router.put('/:id', updateBudget);

/**
 * @route   DELETE /api/v1/budgets/:id
 * @desc    Delete a budget record
 * @access  Private
 */
router.delete('/:id', deleteBudget);

module.exports = router;
