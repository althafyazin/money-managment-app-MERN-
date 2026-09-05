const expenseService = require('../services/expenseService');
const { sendSuccess } = require('../utils/response');

/**
 * Create Expense Controller
 */
const createExpense = async (req, res, next) => {
  try {
    const expense = await expenseService.createExpense(req.user._id, req.body);
    return sendSuccess(res, 201, 'Expense created successfully', { expense });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Expenses List Controller (with Pagination & Filtering)
 */
const getExpenses = async (req, res, next) => {
  try {
    const result = await expenseService.getExpenses(req.user._id, req.query);
    return sendSuccess(res, 200, 'Expenses retrieved successfully', result);
  } catch (error) {
    next(error);
  }
};

/**
 * Get Single Expense Details Controller
 */
const getExpenseById = async (req, res, next) => {
  try {
    const expense = await expenseService.getExpenseById(req.user._id, req.params.id);
    return sendSuccess(res, 200, 'Expense details retrieved successfully', { expense });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Expense Controller
 */
const updateExpense = async (req, res, next) => {
  try {
    const updatedExpense = await expenseService.updateExpense(req.user._id, req.params.id, req.body);
    return sendSuccess(res, 200, 'Expense updated successfully', { expense: updatedExpense });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Expense Controller
 */
const deleteExpense = async (req, res, next) => {
  try {
    await expenseService.deleteExpense(req.user._id, req.params.id);
    return sendSuccess(res, 200, 'Expense record deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
};
