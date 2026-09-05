const axiosInstance = require('./axiosInstance');

const incomeApi = {
  getIncomes: (params) => axiosInstance.get('/incomes', { params }),
  getIncomeById: (id) => axiosInstance.get(`/incomes/${id}`),
  createIncome: (data) => axiosInstance.post('/incomes', data),
  updateIncome: (id, data) => axiosInstance.put(`/incomes/${id}`, data),
  deleteIncome: (id) => axiosInstance.delete(`/incomes/${id}`),
};

module.exports = incomeApi;
