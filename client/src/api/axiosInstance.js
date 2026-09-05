const axios = require('axios');

// Create Axios Instance with default config
const axiosInstance = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Bearer Token automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('financeflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Catch 401 Unauthorized errors and force logout
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('financeflow_token');
      localStorage.removeItem('financeflow_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    const errorMessage =
      error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

module.exports = axiosInstance;
