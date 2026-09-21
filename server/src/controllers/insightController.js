const insightService = require('../services/insightService');
const { sendSuccess } = require('../utils/response');

const insightController = {
  async getInsights(req, res, next) {
    try {
      const data = await insightService.calculateHealthInsights(req.user._id);
      return sendSuccess(res, 200, 'AI financial insights calculated successfully', data);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = insightController;
