const exportService = require('../services/exportService');

const exportController = {
  async downloadCsv(req, res, next) {
    try {
      const csvData = await exportService.generateFinancialCsv(req.user._id, req.query);

      const filename = `financeflow-report-${new Date().toISOString().split('T')[0]}.csv`;

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      return res.status(200).send(csvData);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = exportController;
