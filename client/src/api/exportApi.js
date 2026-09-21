import axiosInstance from './axiosInstance';

export const exportApi = {
  downloadCsv: async (params = {}) => {
    const response = await axiosInstance.get('/export/csv', {
      params,
      responseType: 'blob',
    });
    
    // Create a temporary link element to trigger browser download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `financeflow-report-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
