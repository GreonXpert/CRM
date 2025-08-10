// /src/api/leadService.js
import api from './axiosConfig';

// Create a lead manually
export const createLead = async (leadData) => {
  try {
    const response = await api.post('/leads', leadData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Create a lead from shared link
export const createLeadFromLink = async (userId, leadData) => {
  try {
    const response = await api.post(`/leads/link/${userId}`, leadData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get all leads (role-based filtering handled by backend)
export const getAllLeads = async () => {
  try {
    const response = await api.get('/leads');
    return response.data; // Returns { success: true, count: number, data: Lead[] }
  } catch (error) {
    console.error('Failed to fetch leads:', error);
    throw error.response?.data || error;
  }
};

// Update a lead
export const updateLead = async (leadId, leadData) => {
  try {
    const response = await api.put(`/leads/${leadId}`, leadData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete a lead
export const deleteLead = async (leadId) => {
  try {
    const response = await api.delete(`/leads/${leadId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Export default object for backward compatibility
const leadService = {
  createLead,
  createLeadFromLink,
  getAllLeads,
  updateLead,
  deleteLead,
};

export default leadService;