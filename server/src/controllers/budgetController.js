const budgetService = require('../services/budgetService');
const { sendSuccess } = require('../utils/response');

/**
 * Create or Update Budget Controller
 */
const createOrUpdateBudget = async (req, res, next) => {
  try {
    const budget = await budgetService.createOrUpdateBudget(req.user._id, req.body);
    return sendSuccess(res, 201, 'Budget target set successfully', { budget });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Budgets with Progress Breakdown Controller
 */
const getBudgets = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const result = await budgetService.getBudgetsWithProgress(req.user._id, month, year);
    return sendSuccess(res, 200, 'Budgets retrieved successfully', result);
  } catch (error) {
    next(error);
  }
};

/**
 * Update Budget Controller
 */
const updateBudget = async (req, res, next) => {
  try {
    const { amountLimit } = req.body;
    const budget = await budgetService.updateBudget(req.user._id, req.params.id, amountLimit);
    return sendSuccess(res, 200, 'Budget limit updated successfully', { budget });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Budget Controller
 */
const deleteBudget = async (req, res, next) => {
  try {
    await budgetService.deleteBudget(req.user._id, req.params.id);
    return sendSuccess(res, 200, 'Budget record deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrUpdateBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
};
