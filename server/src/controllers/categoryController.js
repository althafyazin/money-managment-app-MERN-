const categoryService = require('../services/categoryService');
const { sendSuccess } = require('../utils/response');

/**
 * Get Categories Controller
 */
const getCategories = async (req, res, next) => {
  try {
    const { type } = req.query;
    const categories = await categoryService.getCategories(req.user._id, type);
    return sendSuccess(res, 200, 'Categories retrieved successfully', { categories });
  } catch (error) {
    next(error);
  }
};

/**
 * Create Custom Category Controller
 */
const createCategory = async (req, res, next) => {
  try {
    const { name, type, icon, color } = req.body;
    const category = await categoryService.createCustomCategory(req.user._id, {
      name,
      type,
      icon,
      color,
    });
    return sendSuccess(res, 201, 'Custom category created successfully', { category });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Custom Category Controller
 */
const deleteCategory = async (req, res, next) => {
  try {
    await categoryService.deleteCustomCategory(req.user._id, req.params.id);
    return sendSuccess(res, 200, 'Category deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
  deleteCategory,
};
