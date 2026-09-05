const Category = require('../models/Category');

const defaultCategories = [
  // Income Categories
  { name: 'Salary', type: 'income', icon: 'wallet', color: '#10B981', isCustom: false, user: null },
  { name: 'Freelance & Side Hustle', type: 'income', icon: 'briefcase', color: '#3B82F6', isCustom: false, user: null },
  { name: 'Investments & Dividends', type: 'income', icon: 'trending-up', color: '#8B5CF6', isCustom: false, user: null },
  { name: 'Business Revenue', type: 'income', icon: 'building', color: '#6366F1', isCustom: false, user: null },
  { name: 'Gifts & Grants', type: 'income', icon: 'gift', color: '#EC4899', isCustom: false, user: null },
  { name: 'Other Income', type: 'income', icon: 'plus-circle', color: '#6B7280', isCustom: false, user: null },

  // Expense Categories
  { name: 'Food & Dining', type: 'expense', icon: 'utensils', color: '#EF4444', isCustom: false, user: null },
  { name: 'Rent & Housing', type: 'expense', icon: 'home', color: '#F59E0B', isCustom: false, user: null },
  { name: 'Utilities & Bills', type: 'expense', icon: 'zap', color: '#10B981', isCustom: false, user: null },
  { name: 'Transportation & Gas', type: 'expense', icon: 'car', color: '#3B82F6', isCustom: false, user: null },
  { name: 'Entertainment & Hobbies', type: 'expense', icon: 'film', color: '#8B5CF6', isCustom: false, user: null },
  { name: 'Health & Medical', type: 'expense', icon: 'heart-pulse', color: '#EC4899', isCustom: false, user: null },
  { name: 'Shopping & Apparel', type: 'expense', icon: 'shopping-bag', color: '#F43F5E', isCustom: false, user: null },
  { name: 'Education & Learning', type: 'expense', icon: 'book-open', color: '#0EA5E9', isCustom: false, user: null },
  { name: 'Personal Care', type: 'expense', icon: 'smile', color: '#14B8A6', isCustom: false, user: null },
  { name: 'Miscellaneous Expense', type: 'expense', icon: 'tag', color: '#6B7280', isCustom: false, user: null },
];

/**
 * Seeds default system categories if they do not exist in database.
 */
const seedDefaultCategories = async () => {
  try {
    const existingDefaultCount = await Category.countDocuments({ isCustom: false });

    if (existingDefaultCount === 0) {
      await Category.insertMany(defaultCategories);
      console.log('✅ [Database] System Default Categories seeded successfully.');
    }
  } catch (error) {
    console.error('❌ [Database Error] Failed to seed default categories:', error.message);
  }
};

module.exports = seedDefaultCategories;
