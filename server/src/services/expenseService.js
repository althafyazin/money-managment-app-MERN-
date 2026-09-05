const Expense = require('../models/Expense');
const Category = require('../models/Category');
const AppError = require('../utils/AppError');

class ExpenseService {
  /**
   * Creates a new expense record for the logged-in user.
   * @param {String} userId - Mongo ObjectId of user
   * @param {Object} expenseData - { title, amount, category, date, paymentMethod, notes, isRecurring, recurringFrequency }
   * @returns {Object} Created & populated expense document
   */
  async createExpense(userId, expenseData) {
    const { title, amount, category, date, paymentMethod, notes, isRecurring, recurringFrequency } = expenseData;

    if (!title || !amount || !category) {
      throw new AppError('Title, amount, and category are required fields.', 400);
    }

    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      throw new AppError('Specified expense category does not exist.', 404);
    }

    const expense = await Expense.create({
      user: userId,
      title,
      amount,
      category,
      date: date || new Date(),
      paymentMethod: paymentMethod || 'debit_card',
      notes: notes || '',
      isRecurring: isRecurring || false,
      recurringFrequency: isRecurring ? recurringFrequency : undefined,
    });

    // Return populated expense object
    return await expense.populate('category', 'name icon color type');
  }

  /**
   * Retrieves user expenses with pagination, filtering, sorting, and summary metrics.
   * @param {String} userId - Mongo ObjectId of user
   * @param {Object} queryParams - Filtering and pagination options
   * @returns {Object} { expenses, pagination, summary }
   */
  async getExpenses(userId, queryParams) {
    const {
      page = 1,
      limit = 10,
      startDate,
      endDate,
      categoryId,
      paymentMethod,
      search,
      sortBy = 'date',
      sortOrder = 'desc',
    } = queryParams;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    // 1. Build Base Match Filter Query
    const filter = { user: userId };

    // Date Range Filter
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }

    // Category Filter
    if (categoryId) {
      filter.category = categoryId;
    }

    // Payment Method Filter
    if (paymentMethod) {
      filter.paymentMethod = paymentMethod;
    }

    // Search Filter (matches title or notes case-insensitively)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
      ];
    }

    // Build Sorting Config
    const sortConfig = {};
    sortConfig[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // 2. Fetch Paginated Records
    const expenses = await Expense.find(filter)
      .populate('category', 'name icon color type')
      .sort(sortConfig)
      .skip(skip)
      .limit(limitNum);

    // 3. Count Total Matching Documents
    const totalRecords = await Expense.countDocuments(filter);
    const totalPages = Math.ceil(totalRecords / limitNum) || 1;

    // 4. Aggregate Total Sum of Filtered Expenses
    const summaryAggregate = await Expense.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalExpenseAmount: { $sum: '$amount' },
        },
      },
    ]);

    const totalExpenseAmount = summaryAggregate.length > 0 ? summaryAggregate[0].totalExpenseAmount : 0;

    return {
      expenses,
      pagination: {
        totalRecords,
        totalPages,
        currentPage: pageNum,
        limit: limitNum,
      },
      summary: {
        totalExpenseAmount: Number(totalExpenseAmount.toFixed(2)),
      },
    };
  }

  /**
   * Retrieves a single expense by ID owned by user.
   * @param {String} userId - Mongo ObjectId of user
   * @param {String} expenseId - Expense Mongo ObjectId
   * @returns {Object} Expense document
   */
  async getExpenseById(userId, expenseId) {
    const expense = await Expense.findOne({ _id: expenseId, user: userId }).populate(
      'category',
      'name icon color type'
    );

    if (!expense) {
      throw new AppError('Expense record not found.', 404);
    }

    return expense;
  }

  /**
   * Updates an expense record owned by user.
   * @param {String} userId - Mongo ObjectId of user
   * @param {String} expenseId - Expense Mongo ObjectId
   * @param {Object} updateData - Fields to update
   * @returns {Object} Updated expense document
   */
  async updateExpense(userId, expenseId, updateData) {
    if (updateData.category) {
      const categoryExists = await Category.findById(updateData.category);
      if (!categoryExists) {
        throw new AppError('Specified expense category does not exist.', 404);
      }
    }

    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: expenseId, user: userId },
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('category', 'name icon color type');

    if (!updatedExpense) {
      throw new AppError('Expense record not found or unauthorized.', 404);
    }

    return updatedExpense;
  }

  /**
   * Deletes an expense record owned by user.
   * @param {String} userId - Mongo ObjectId of user
   * @param {String} expenseId - Expense Mongo ObjectId
   */
  async deleteExpense(userId, expenseId) {
    const deletedExpense = await Expense.findOneAndDelete({ _id: expenseId, user: userId });

    if (!deletedExpense) {
      throw new AppError('Expense record not found or unauthorized.', 404);
    }
  }
}

module.exports = new ExpenseService();
