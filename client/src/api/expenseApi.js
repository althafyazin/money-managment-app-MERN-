const axiosInstance = require('./axiosInstance');

const expenseApi = {
  getExpenses: (params) => axiosInstance.get('/expenses', { params }),
  getExpenseById: (id) => axiosInstance.get(`/expenses/${id}`),
  createExpense: (data) => axiosInstance.post('/expenses', data),
  updateExpense: (id, data) => axiosInstance.put(`/expenses/${id}`, data),
  deleteExpense: (id) => axiosInstance.delete(`/expenses/${id}`),
};

module.exports = expenseApi;
