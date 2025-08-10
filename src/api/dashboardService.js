import api from '../utils/axiosConfig';

export const getDashboardStats = async () => {
  try {
    const response = await api.get('/dashboard/stats');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    throw error;
  }
};

export const getRecentLeads = async (limit = 10) => {
  try {
    const response = await api.get('/leads/recent', {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch recent leads:', error);
    throw error;
  }
};

export const getLiveEmissions = async () => {
  try {
    const response = await api.get('/emissions/live');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch live emissions:', error);
    throw error;
  }
};