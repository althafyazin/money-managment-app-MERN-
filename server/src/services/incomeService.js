const Income = require('../models/Income');
const Category = require('../models/Category');
const AppError = require('../utils/AppError');

class IncomeService {
  /**
   * Creates a new income record for the logged-in user.
   * @param {String} userId - Mongo ObjectId of user
   * @param {Object} incomeData - { source, amount, category, date, notes, isRecurring, recurringFrequency }
   * @returns {Object} Created & populated income document
   */
  async createIncome(userId, incomeData) {
    const { source, amount, category, date, notes, isRecurring, recurringFrequency } = incomeData;

    if (!source || !amount || !category) {
      throw new AppError('Source, amount, and category are required fields.', 400);
    }

    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      throw new AppError('Specified income category does not exist.', 404);
    }

    const income = await Income.create({
      user: userId,
      source,
      amount,
      category,
      date: date || new Date(),
      notes: notes || '',
      isRecurring: isRecurring || false,
      recurringFrequency: isRecurring ? recurringFrequency : undefined,
    });

    // Return populated income object
    return await income.populate('category', 'name icon color type');
  }

  /**
   * Retrieves user incomes with pagination, filtering, sorting, and summary metrics.
   * @param {String} userId - Mongo ObjectId of user
   * @param {Object} queryParams - Filtering and pagination options
   * @returns {Object} { incomes, pagination, summary }
   */
  async getIncomes(userId, queryParams) {
    const {
      page = 1,
      limit = 10,
      startDate,
      endDate,
      categoryId,
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

    // Search Filter (matches source or notes case-insensitively)
    if (search) {
      filter.$or = [
        { source: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
      ];
    }

    // Build Sorting Config
    const sortConfig = {};
    sortConfig[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // 2. Fetch Paginated Records
    const incomes = await Income.find(filter)
      .populate('category', 'name icon color type')
      .sort(sortConfig)
      .skip(skip)
      .limit(limitNum);

    // 3. Count Total Matching Documents
    const totalRecords = await Income.countDocuments(filter);
    const totalPages = Math.ceil(totalRecords / limitNum) || 1;

    // 4. Aggregate Total Sum of Filtered Incomes
    const summaryAggregate = await Income.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalIncomeAmount: { $sum: '$amount' },
        },
      },
    ]);

    const totalIncomeAmount = summaryAggregate.length > 0 ? summaryAggregate[0].totalIncomeAmount : 0;

    return {
      incomes,
      pagination: {
        totalRecords,
        totalPages,
        currentPage: pageNum,
        limit: limitNum,
      },
      summary: {
        totalIncomeAmount: Number(totalIncomeAmount.toFixed(2)),
      },
    };
  }

  /**
   * Retrieves a single income by ID owned by user.
   * @param {String} userId - Mongo ObjectId of user
   * @param {String} incomeId - Income Mongo ObjectId
   * @returns {Object} Income document
   */
  async getIncomeById(userId, incomeId) {
    const income = await Income.findOne({ _id: incomeId, user: userId }).populate(
      'category',
      'name icon color type'
    );

    if (!income) {
      throw new AppError('Income record not found.', 404);
    }

    return income;
  }

  /**
   * Updates an income record owned by user.
   * @param {String} userId - Mongo ObjectId of user
   * @param {String} incomeId - Income Mongo ObjectId
   * @param {Object} updateData - Fields to update
   * @returns {Object} Updated income document
   */
  async updateIncome(userId, incomeId, updateData) {
    if (updateData.category) {
      const categoryExists = await Category.findById(updateData.category);
      if (!categoryExists) {
        throw new AppError('Specified income category does not exist.', 404);
      }
    }

    const updatedIncome = await Income.findOneAndUpdate(
      { _id: incomeId, user: userId },
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('category', 'name icon color type');

    if (!updatedIncome) {
      throw new AppError('Income record not found or unauthorized.', 404);
    }

    return updatedIncome;
  }

  /**
   * Deletes an income record owned by user.
   * @param {String} userId - Mongo ObjectId of user
   * @param {String} incomeId - Income Mongo ObjectId
   */
  async deleteIncome(userId, incomeId) {
    const deletedIncome = await Income.findOneAndDelete({ _id: incomeId, user: userId });

    if (!deletedIncome) {
      throw new AppError('Income record not found or unauthorized.', 404);
    }
  }
}

module.exports = new IncomeService();
