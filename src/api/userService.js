// /src/api/userService.js
import api from './axiosConfig';

export const getAllUsers = (params) => api.get('/users', { params });
export const updateUser = (userId, userData) => api.put(`/users/${userId}`, userData);
export const deleteUser = (userId) => api.delete(`/users/${userId}`);
export const changePassword = (passwordData) => api.put('/users/changepassword', passwordData);
