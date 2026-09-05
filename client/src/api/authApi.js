import axiosInstance from './axiosInstance';

const authApi = {
  register: (userData) => axiosInstance.post('/auth/register', userData),
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  getMe: () => axiosInstance.get('/auth/me'),
};

export default authApi;
