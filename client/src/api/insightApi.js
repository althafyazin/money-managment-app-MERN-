import axiosInstance from './axiosInstance';

export const insightApi = {
  getInsights: async () => {
    const response = await axiosInstance.get('/insights');
    return response.data;
  },
};
