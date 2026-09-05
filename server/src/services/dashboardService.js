const Expense = require('../models/Expense');
const Income = require('../models/Income');
const mongoose = require('mongoose');

class DashboardService {
  /**
   * Calculates overall lifetime and current month financial summary KPIs.
   * @param {String} userId - Mongo ObjectId of user
   * @returns {Object} Financial summary stats
   */
  async getFinancialSummary(userId) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const now = new Date();

    // Dates for Current Month
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Dates for Previous Month (for MoM calculations)
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    // Run parallel aggregation pipelines
    const [
      lifetimeExpenseAgg,
      lifetimeIncomeAgg,
      currentExpenseAgg,
      currentIncomeAgg,
      prevExpenseAgg,
      prevIncomeAgg,
    ] = await Promise.all([
      Expense.aggregate([
        { $match: { user: userObjectId } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Income.aggregate([
        { $match: { user: userObjectId } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Expense.aggregate([
        { $match: { user: userObjectId, date: { $gte: currentMonthStart, $lte: currentMonthEnd } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Income.aggregate([
        { $match: { user: userObjectId, date: { $gte: currentMonthStart, $lte: currentMonthEnd } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Expense.aggregate([
        { $match: { user: userObjectId, date: { $gte: prevMonthStart, $lte: prevMonthEnd } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Income.aggregate([
        { $match: { user: userObjectId, date: { $gte: prevMonthStart, $lte: prevMonthEnd } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);

    const totalLifetimeExpense = lifetimeExpenseAgg.length > 0 ? lifetimeExpenseAgg[0].total : 0;
    const totalLifetimeIncome = lifetimeIncomeAgg.length > 0 ? lifetimeIncomeAgg[0].total : 0;
    const lifetimeNetSavings = totalLifetimeIncome - totalLifetimeExpense;
    const lifetimeSavingsRate =
      totalLifetimeIncome > 0 ? ((lifetimeNetSavings / totalLifetimeIncome) * 100).toFixed(1) : 0;

    const currentExpense = currentExpenseAgg.length > 0 ? currentExpenseAgg[0].total : 0;
    const currentIncome = currentIncomeAgg.length > 0 ? currentIncomeAgg[0].total : 0;
    const currentNetSavings = currentIncome - currentExpense;
    const currentSavingsRate =
      currentIncome > 0 ? ((currentNetSavings / currentIncome) * 100).toFixed(1) : 0;

    const prevExpense = prevExpenseAgg.length > 0 ? prevExpenseAgg[0].total : 0;
    const prevIncome = prevIncomeAgg.length > 0 ? prevIncomeAgg[0].total : 0;

    // Calculate Month-over-Month Growth Percentages
    const expenseMoM =
      prevExpense > 0 ? (((currentExpense - prevExpense) / prevExpense) * 100).toFixed(1) : 0;
    const incomeMoM =
      prevIncome > 0 ? (((currentIncome - prevIncome) / prevIncome) * 100).toFixed(1) : 0;

    return {
      lifetime: {
        totalIncome: Number(totalLifetimeIncome.toFixed(2)),
        totalExpense: Number(totalLifetimeExpense.toFixed(2)),
        netSavings: Number(lifetimeNetSavings.toFixed(2)),
        savingsRate: Number(lifetimeSavingsRate),
      },
      currentMonth: {
        income: Number(currentIncome.toFixed(2)),
        expense: Number(currentExpense.toFixed(2)),
        netSavings: Number(currentNetSavings.toFixed(2)),
        savingsRate: Number(currentSavingsRate),
      },
      growthMoM: {
        incomeGrowthPercentage: Number(incomeMoM),
        expenseGrowthPercentage: Number(expenseMoM),
      },
    };
  }

  /**
   * Generates chart datasets (Category Pie chart & 6-Month Income vs Expense Trend chart).
   * @param {String} userId - Mongo ObjectId of user
   * @param {Number} [monthsCount=6] - Number of past months to include in trend
   * @returns {Object} { categoryBreakdown, monthlyTrends }
   */
  async getChartData(userId, monthsCount = 6) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const now = new Date();

    // 1. Category Breakdown Aggregation (for Pie/Donut Charts)
    const categoryAgg = await Expense.aggregate([
      { $match: { user: userObjectId } },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryDetails',
        },
      },
      { $unwind: '$categoryDetails' },
      {
        $project: {
          _id: 1,
          name: '$categoryDetails.name',
          icon: '$categoryDetails.icon',
          color: '$categoryDetails.color',
          totalAmount: 1,
        },
      },
      { $sort: { totalAmount: -1 } },
    ]);

    const totalExpenseSum = categoryAgg.reduce((acc, curr) => acc + curr.totalAmount, 0);

    const categoryBreakdown = categoryAgg.map((item) => ({
      categoryId: item._id,
      name: item.name,
      icon: item.icon,
      color: item.color,
      totalAmount: Number(item.totalAmount.toFixed(2)),
      percentage: totalExpenseSum > 0 ? Number(((item.totalAmount / totalExpenseSum) * 100).toFixed(1)) : 0,
    }));

    // 2. Monthly Income vs Expense Trend Aggregation (last N months)
    const trendStartDate = new Date(now.getFullYear(), now.getMonth() - monthsCount + 1, 1);

    const [expenseTrends, incomeTrends] = await Promise.all([
      Expense.aggregate([
        { $match: { user: userObjectId, date: { $gte: trendStartDate } } },
        {
          $group: {
            _id: {
              year: { $year: '$date' },
              month: { $month: '$date' },
            },
            total: { $sum: '$amount' },
          },
        },
      ]),
      Income.aggregate([
        { $match: { user: userObjectId, date: { $gte: trendStartDate } } },
        {
          $group: {
            _id: {
              year: { $year: '$date' },
              month: { $month: '$date' },
            },
            total: { $sum: '$amount' },
          },
        },
      ]),
    ]);

    // Build continuous monthly series array for front-end charts
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyTrends = [];

    for (let i = monthsCount - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const monthNum = d.getMonth() + 1;
      const monthLabel = `${monthNames[d.getMonth()]} ${year}`;

      const expMatch = expenseTrends.find((e) => e._id.year === year && e._id.month === monthNum);
      const incMatch = incomeTrends.find((inc) => inc._id.year === year && inc._id.month === monthNum);

      monthlyTrends.push({
        month: monthLabel,
        year,
        monthNumber: monthNum,
        income: incMatch ? Number(incMatch.total.toFixed(2)) : 0,
        expense: expMatch ? Number(expMatch.total.toFixed(2)) : 0,
        netSavings: Number(
          ((incMatch ? incMatch.total : 0) - (expMatch ? expMatch.total : 0)).toFixed(2)
        ),
      });
    }

    return {
      categoryBreakdown,
      monthlyTrends,
    };
  }

  /**
   * Fetches recent transactions feed (combined expenses and incomes).
   * @param {String} userId - Mongo ObjectId of user
   * @param {Number} [limit=5] - Number of records to return
   * @returns {Array} Combined sorted recent transactions
   */
  async getRecentTransactions(userId, limit = 5) {
    const limitNum = parseInt(limit, 10) || 5;

    const [recentExpenses, recentIncomes] = await Promise.all([
      Expense.find({ user: userId })
        .populate('category', 'name icon color type')
        .sort({ date: -1 })
        .limit(limitNum),
      Income.find({ user: userId })
        .populate('category', 'name icon color type')
        .sort({ date: -1 })
        .limit(limitNum),
    ]);

    // Map into unified transaction DTO
    const mappedExpenses = recentExpenses.map((e) => ({
      id: e._id,
      title: e.title,
      type: 'expense',
      amount: e.amount,
      category: e.category,
      date: e.date,
      paymentMethod: e.paymentMethod,
    }));

    const mappedIncomes = recentIncomes.map((i) => ({
      id: i._id,
      title: i.source,
      type: 'income',
      amount: i.amount,
      category: i.category,
      date: i.date,
    }));

    // Combine and sort descending by date
    const combined = [...mappedExpenses, ...mappedIncomes].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    return combined.slice(0, limitNum);
  }
}

module.exports = new DashboardService();
