import axiosInstance from './axiosInstance';

const categoryApi = {
  getCategories: (type) => axiosInstance.get('/categories', { params: { type } }),
  createCategory: (data) => axiosInstance.post('/categories', data),
  deleteCategory: (id) => axiosInstance.delete(`/categories/${id}`),
};

export default categoryApi;
