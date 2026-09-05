const Category = require('../models/Category');
const AppError = require('../utils/AppError');

class CategoryService {
  /**
   * Fetches all categories accessible to the current user (defaults + user custom).
   * @param {String} userId - Mongo ObjectId of authenticated user
   * @param {String} [type] - Optional category type filter ('expense' or 'income')
   * @returns {Array} List of category documents
   */
  async getCategories(userId, type) {
    const filter = {
      $or: [{ user: null }, { user: userId }],
    };

    if (type) {
      if (!['expense', 'income'].includes(type)) {
        throw new AppError('Invalid category type filter. Must be expense or income.', 400);
      }
      filter.type = type;
    }

    const categories = await Category.find(filter).sort({ isCustom: 1, name: 1 });
    return categories;
  }

  /**
   * Creates a custom category for the authenticated user.
   * @param {String} userId - Mongo ObjectId of authenticated user
   * @param {Object} categoryData - { name, type, icon, color }
   * @returns {Object} Created category document
   */
  async createCustomCategory(userId, { name, type, icon, color }) {
    if (!name || !type) {
      throw new AppError('Category name and type are required.', 400);
    }

    if (!['expense', 'income'].includes(type)) {
      throw new AppError('Category type must be either expense or income.', 400);
    }

    // Check if category with same name already exists for this user or system defaults
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
      $or: [{ user: null }, { user: userId }],
    });

    if (existingCategory) {
      throw new AppError(`Category '${name}' already exists.`, 409);
    }

    const newCategory = await Category.create({
      name,
      type,
      icon: icon || 'tag',
      color: color || '#6B7280',
      isCustom: true,
      user: userId,
    });

    return newCategory;
  }

  /**
   * Deletes a user custom category. System default categories cannot be deleted.
   * @param {String} userId - Mongo ObjectId of authenticated user
   * @param {String} categoryId - Mongo ObjectId of category to delete
   */
  async deleteCustomCategory(userId, categoryId) {
    const category = await Category.findById(categoryId);

    if (!category) {
      throw new AppError('Category not found.', 404);
    }

    // System default category protection check
    if (!category.isCustom || category.user === null) {
      throw new AppError('System default categories cannot be deleted.', 403);
    }

    // Ownership verification check
    if (category.user.toString() !== userId.toString()) {
      throw new AppError('You do not have permission to delete this category.', 403);
    }

    await Category.findByIdAndDelete(categoryId);
  }
}

module.exports = new CategoryService();
