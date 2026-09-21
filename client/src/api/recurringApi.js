import axiosInstance from './axiosInstance';

export const recurringApi = {
  getRecurring: async () => {
    const response = await axiosInstance.get('/recurring');
    return response.data.data.recurring;
  },
  createRecurring: async (data) => {
    const response = await axiosInstance.post('/recurring', data);
    return response.data.data.recurring;
  },
  deleteRecurring: async (id) => {
    const response = await axiosInstance.delete(`/recurring/${id}`);
    return response.data;
  },
  processDue: async () => {
    const response = await axiosInstance.post('/recurring/process');
    return response.data.data;
  },
};
