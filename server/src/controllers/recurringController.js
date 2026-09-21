const recurringService = require('../services/recurringService');
const { sendSuccess } = require('../utils/response');

const recurringController = {
  async create(req, res, next) {
    try {
      const recurring = await recurringService.createRecurring(req.user._id, req.body);
      return sendSuccess(res, 201, 'Recurring transaction created', { recurring });
    } catch (error) {
      next(error);
    }
  },

  async getAll(req, res, next) {
    try {
      const items = await recurringService.getUserRecurring(req.user._id);
      return sendSuccess(res, 200, 'Recurring transactions fetched', { recurring: items });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      await recurringService.deleteRecurring(req.user._id, req.params.id);
      return sendSuccess(res, 200, 'Recurring transaction template deleted');
    } catch (error) {
      next(error);
    }
  },

  async processDue(req, res, next) {
    try {
      const result = await recurringService.processDueRecurring(req.user._id);
      return sendSuccess(res, 200, `Processed ${result.processedCount} due recurring transaction(s)`, result);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = recurringController;
