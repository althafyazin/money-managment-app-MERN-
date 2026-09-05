import axiosInstance from './axiosInstance';

const budgetApi = {
  getBudgets: (params) => axiosInstance.get('/budgets', { params }),
  createOrUpdateBudget: (data) => axiosInstance.post('/budgets', data),
  updateBudget: (id, amountLimit) => axiosInstance.put(`/budgets/${id}`, { amountLimit }),
  deleteBudget: (id) => axiosInstance.delete(`/budgets/${id}`),
};

export default budgetApi;
