const express = require('express');
const {
  getCategories,
  createCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Apply protection middleware to all category endpoints
router.use(protect);

/**
 * @route   GET /api/v1/categories
 * @desc    Fetch categories accessible to user (system default + custom)
 * @access  Private
 */
router.get('/', getCategories);

/**
 * @route   POST /api/v1/categories
 * @desc    Create a custom category
 * @access  Private
 */
router.post('/', createCategory);

/**
 * @route   DELETE /api/v1/categories/:id
 * @desc    Delete a custom category
 * @access  Private
 */
router.delete('/:id', deleteCategory);

module.exports = router;
