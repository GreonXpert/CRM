// /src/api/leadService.js
import api from './axiosConfig';

export const createLead = (leadData) => api.post('/leads', leadData);
export const createLeadFromLink = (userId, leadData) => api.post(`/leads/link/${userId}`, leadData);
export const getAllLeads = () => api.get('/leads');
export const updateLead = (leadId, leadData) => api.put(`/leads/${leadId}`, leadData);
export const deleteLead = (leadId) => api.delete(`/leads/${leadId}`);
