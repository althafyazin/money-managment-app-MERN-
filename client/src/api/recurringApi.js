import axiosInstance from './axiosInstance';

export const recurringApi = {
  getRecurring: async () => {
    const res = await axiosInstance.get('/recurring');
    return res?.data?.recurring || res?.recurring || res?.data || (Array.isArray(res) ? res : []);
  },
  createRecurring: async (data) => {
    const res = await axiosInstance.post('/recurring', data);
    return res?.data?.recurring || res?.recurring || res?.data || res;
  },
  deleteRecurring: async (id) => {
    const res = await axiosInstance.delete(`/recurring/${id}`);
    return res?.data || res;
  },
  processDue: async () => {
    const res = await axiosInstance.post('/recurring/process');
    return res?.data || res;
  },
};
