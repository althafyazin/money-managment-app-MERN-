const RecurringTransaction = require('../models/RecurringTransaction');
const Expense = require('../models/Expense');
const Income = require('../models/Income');
const AppError = require('../utils/AppError');

const recurringService = {
  async createRecurring(userId, data) {
    const recurring = await RecurringTransaction.create({
      ...data,
      user: userId,
    });
    return recurring.populate('category', 'name type icon');
  },

  async getUserRecurring(userId) {
    return RecurringTransaction.find({ user: userId })
      .populate('category', 'name type icon')
      .sort({ nextDueDate: 1 });
  },

  async deleteRecurring(userId, id) {
    const item = await RecurringTransaction.findOneAndDelete({ _id: id, user: userId });
    if (!item) {
      throw new AppError('Recurring transaction template not found', 404);
    }
    return item;
  },

  async processDueRecurring(userId) {
    const now = new Date();

    const dueItems = await RecurringTransaction.find({
      user: userId,
      isActive: true,
      nextDueDate: { $lte: now },
    });

    const createdRecords = [];

    for (const item of dueItems) {
      // Process ALL missed periods in a loop (catch-up logic)
      while (item.nextDueDate <= now) {
        const dueDateForThisCycle = new Date(item.nextDueDate);

        // --- Idempotency guard: skip if already processed for this exact date ---
        let alreadyExists = false;
        if (item.type === 'expense') {
          alreadyExists = !!(await Expense.findOne({
            user: item.user,
            title: `[Auto-Recurring] ${item.title}`,
            date: dueDateForThisCycle,
          }));
        } else if (item.type === 'income') {
          alreadyExists = !!(await Income.findOne({
            user: item.user,
            source: `[Auto-Recurring] ${item.title}`,
            date: dueDateForThisCycle,
          }));
        }

        if (!alreadyExists) {
          if (item.type === 'expense') {
            const exp = await Expense.create({
              user: item.user,
              title: `[Auto-Recurring] ${item.title}`,
              amount: item.amount,
              category: item.category,
              date: dueDateForThisCycle,
              paymentMethod: 'other',
              notes: item.description || 'Auto-generated recurring expense',
            });
            createdRecords.push(exp);
          } else if (item.type === 'income') {
            const inc = await Income.create({
              user: item.user,
              source: `[Auto-Recurring] ${item.title}`,
              amount: item.amount,
              category: item.category,
              date: dueDateForThisCycle,
              notes: item.description || 'Auto-generated recurring income',
            });
            createdRecords.push(inc);
          }
        }

        // Advance nextDueDate to the next period
        const nextDate = new Date(item.nextDueDate);
        if (item.frequency === 'daily') nextDate.setDate(nextDate.getDate() + 1);
        else if (item.frequency === 'weekly') nextDate.setDate(nextDate.getDate() + 7);
        else if (item.frequency === 'monthly') nextDate.setMonth(nextDate.getMonth() + 1);
        else if (item.frequency === 'yearly') nextDate.setFullYear(nextDate.getFullYear() + 1);

        item.nextDueDate = nextDate;
      }

      item.lastProcessedDate = now;
      await item.save();
    }

    return {
      processedCount: createdRecords.length,
      records: createdRecords,
    };
  },
};

module.exports = recurringService;
