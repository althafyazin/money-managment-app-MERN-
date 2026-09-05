const axiosInstance = require('./axiosInstance');

const dashboardApi = {
  getSummary: () => axiosInstance.get('/dashboard/summary'),
  getCharts: (timeframe) => axiosInstance.get('/dashboard/charts', { params: { timeframe } }),
  getRecent: (limit) => axiosInstance.get('/dashboard/recent', { params: { limit } }),
};

module.exports = dashboardApi;
