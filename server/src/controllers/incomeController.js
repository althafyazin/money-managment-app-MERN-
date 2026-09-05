const incomeService = require('../services/incomeService');
const { sendSuccess } = require('../utils/response');

/**
 * Create Income Controller
 */
const createIncome = async (req, res, next) => {
  try {
    const income = await incomeService.createIncome(req.user._id, req.body);
    return sendSuccess(res, 201, 'Income record created successfully', { income });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Incomes List Controller (with Pagination & Filtering)
 */
const getIncomes = async (req, res, next) => {
  try {
    const result = await incomeService.getIncomes(req.user._id, req.query);
    return sendSuccess(res, 200, 'Incomes retrieved successfully', result);
  } catch (error) {
    next(error);
  }
};

/**
 * Get Single Income Details Controller
 */
const getIncomeById = async (req, res, next) => {
  try {
    const income = await incomeService.getIncomeById(req.user._id, req.params.id);
    return sendSuccess(res, 200, 'Income details retrieved successfully', { income });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Income Controller
 */
const updateIncome = async (req, res, next) => {
  try {
    const updatedIncome = await incomeService.updateIncome(req.user._id, req.params.id, req.body);
    return sendSuccess(res, 200, 'Income updated successfully', { income: updatedIncome });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Income Controller
 */
const deleteIncome = async (req, res, next) => {
  try {
    await incomeService.deleteIncome(req.user._id, req.params.id);
    return sendSuccess(res, 200, 'Income record deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createIncome,
  getIncomes,
  getIncomeById,
  updateIncome,
  deleteIncome,
};
