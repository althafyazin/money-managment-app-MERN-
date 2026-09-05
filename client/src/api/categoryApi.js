const axiosInstance = require('./axiosInstance');

const categoryApi = {
  getCategories: (type) => axiosInstance.get('/categories', { params: { type } }),
  createCategory: (data) => axiosInstance.post('/categories', data),
  deleteCategory: (id) => axiosInstance.delete(`/categories/${id}`),
};

module.exports = categoryApi;
