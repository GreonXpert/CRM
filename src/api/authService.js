// /src/api/authService.js
import api from './axiosConfig';

export const registerUser = (userData) => api.post('/auth/register', userData);
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const forgotPassword = (email) => api.post('/auth/forgotpassword', { email });
export const resetPassword = (token, password) => api.put(`/auth/resetpassword/${token}`, { password });
