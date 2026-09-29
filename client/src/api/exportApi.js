import axiosInstance from './axiosInstance';

export const exportApi = {
  downloadCsv: async (params = {}) => {
    const data = await axiosInstance.get('/export/csv', {
      params,
      responseType: 'blob',
    });
    
    // axiosInstance interceptor unwraps response.data, so `data` is already the Blob
    const blob = data instanceof Blob ? data : new Blob([data], { type: 'text/csv' });

    // Create a temporary link element to trigger browser download
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `financeflow-report-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
