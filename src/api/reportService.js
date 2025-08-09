// /src/api/reportService.js
import api from './axiosConfig';

export const getDashboardStats = () => api.get('/reports/dashboard');
export const downloadReport = (reportData) => api.post('/reports/download', reportData, {
  responseType: 'blob', // Important for file downloads
});
