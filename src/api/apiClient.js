// api/apiClient.js - Enhanced API Client
import axios from 'axios';

// ==============================================
// API CLIENT CONFIGURATION
// ==============================================
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==============================================
// REQUEST INTERCEPTOR
// ==============================================
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token to requests
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request for debugging
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// ==============================================
// RESPONSE INTERCEPTOR
// ==============================================
apiClient.interceptors.response.use(
  (response) => {
    // Log successful response
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error);
    
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('authToken');
          window.location.href = '/login';
          break;
        case 403:
          // Forbidden
          console.error('Access denied');
          break;
        case 404:
          // Not found
          console.error('Resource not found');
          break;
        case 500:
          // Server error
          console.error('Internal server error');
          break;
        default:
          console.error(`HTTP Error ${status}:`, data?.message || 'Unknown error');
      }
      
      // Return standardized error
      return Promise.reject({
        status,
        message: data?.message || `HTTP ${status} Error`,
        data: data || null,
        response: error.response
      });
    } else if (error.request) {
      // Network error
      console.error('Network Error:', error.request);
      return Promise.reject({
        status: 0,
        message: 'Network error. Please check your connection.',
        data: null,
        request: error.request
      });
    } else {
      // Other error
      console.error('Error:', error.message);
      return Promise.reject({
        status: -1,
        message: error.message || 'An unexpected error occurred',
        data: null,
        error: error
      });
    }
  }
);

// ==============================================
// API SERVICE CLASSES
// ==============================================

export class AuthService {
  static async login(credentials) {
    const response = await apiClient.post('/api/auth/login', credentials);
    return response.data;
  }
  
  static async logout() {
    const response = await apiClient.post('/api/auth/logout');
    localStorage.removeItem('authToken');
    return response.data;
  }
  
  static async refreshToken() {
    const response = await apiClient.post('/api/auth/refresh');
    return response.data;
  }
  
  static async getCurrentUser() {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  }
}

export class LeadService {
  static async getAll(params = {}) {
    const response = await apiClient.get('/api/leads', { params });
    return response.data;
  }
  
  static async getById(id) {
    const response = await apiClient.get(`/api/leads/${id}`);
    return response.data;
  }
  
  static async create(leadData) {
    const response = await apiClient.post('/api/leads', leadData);
    return response.data;
  }
  
  static async update(id, leadData) {
    const response = await apiClient.put(`/api/leads/${id}`, leadData);
    return response.data;
  }
  
  static async delete(id) {
    const response = await apiClient.delete(`/api/leads/${id}`);
    return response.data;
  }
  
  static async bulkImport(csvData) {
    const response = await apiClient.post('/api/leads/bulk-import', csvData);
    return response.data;
  }
  
  static async getStats() {
    const response = await apiClient.get('/api/leads/stats');
    return response.data;
  }
}

export class UserService {
  static async getAll(params = {}) {
    const response = await apiClient.get('/api/users', { params });
    return response.data;
  }
  
  static async getById(id) {
    const response = await apiClient.get(`/api/users/${id}`);
    return response.data;
  }
  
  static async create(userData) {
    const response = await apiClient.post('/api/users', userData);
    return response.data;
  }
  
  static async update(id, userData) {
    const response = await apiClient.put(`/api/users/${id}`, userData);
    return response.data;
  }
  
  static async delete(id) {
    const response = await apiClient.delete(`/api/users/${id}`);
    return response.data;
  }
  
  static async changePassword(id, passwordData) {
    const response = await apiClient.put(`/api/users/${id}/password`, passwordData);
    return response.data;
  }
}

export class DashboardService {
  static async getStats() {
    const response = await apiClient.get('/api/dashboard/stats');
    return response.data;
  }
  
  static async getRecentLeads() {
    const response = await apiClient.get('/api/dashboard/recent-leads');
    return response.data;
  }
  
  static async getPerformanceData(period = '6months') {
    const response = await apiClient.get('/api/dashboard/performance', { 
      params: { period } 
    });
    return response.data;
  }
}

export class NotificationService {
  static async getAll() {
    const response = await apiClient.get('/api/notifications');
    return response.data;
  }
  
  static async markAsRead(id) {
    const response = await apiClient.put(`/api/notifications/${id}/read`);
    return response.data;
  }
  
  static async markAllAsRead() {
    const response = await apiClient.put('/api/notifications/mark-all-read');
    return response.data;
  }
}

// ==============================================
// UTILITY FUNCTIONS
// ==============================================

export const createApiHook = (service, method) => {
  return async (...args) => {
    try {
      const result = await service[method](...args);
      return { data: result, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };
};

export const withRetry = async (apiCall, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      
      // Don't retry on auth errors
      if (error.status === 401 || error.status === 403) {
        throw error;
      }
      
      // Wait before retrying
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }
  
  throw lastError;
};

export default apiClient;


// ==============================================
// MOCK DATA SERVICES (Remove in production)
// ==============================================

export class MockDataService {
  static async getDashboardStats() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      data: {
        totalLeads: 1284,
        approvedCount: 972,
        rejectedCount: 312,
        approvalRatio: 75.7,
        statusCounts: [
          { name: 'Approved', value: 972 },
          { name: 'Rejected', value: 312 },
          { name: 'Follow-up', value: 150 },
          { name: 'New', value: 50 },
        ],
        monthlyPerformance: [
          { name: 'Jan', leads: 150 },
          { name: 'Feb', leads: 200 },
          { name: 'Mar', leads: 180 },
          { name: 'Apr', leads: 250 },
          { name: 'May', leads: 220 },
          { name: 'Jun', leads: 300 },
        ],
      }
    };
  }

  static async getRecentLeads() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      success: true,
      data: [
        { 
          _id: '1', 
          customerName: 'Rohan Verma', 
          mobileNumber: '9876543210',
          status: 'Approved', 
          createdAt: new Date().toISOString(), 
          createdBy: { name: 'Admin One', email: 'admin1@example.com' },
          panCard: 'ABCDE1234F',
          aadharNumber: '123456789012',
          preferredBank: 'HDFC'
        },
        { 
          _id: '2', 
          customerName: 'Sneha Reddy', 
          mobileNumber: '9123456789',
          status: 'New', 
          createdAt: new Date().toISOString(), 
          createdBy: { name: 'Admin Two', email: 'admin2@example.com' },
          panCard: 'FGHIJ5678K',
          aadharNumber: '234567890123',
          preferredBank: 'ICICI'
        },
        { 
          _id: '3', 
          customerName: 'Arjun Singh', 
          mobileNumber: '9988776655',
          status: 'Rejected', 
          createdAt: new Date().toISOString(), 
          createdBy: { name: 'Admin One', email: 'admin1@example.com' },
          panCard: 'KLMNO9012P',
          aadharNumber: '345678901234',
          preferredBank: 'AXIS'
        },
        { 
          _id: '4', 
          customerName: 'Meera Desai', 
          mobileNumber: '9765432109',
          status: 'Follow-up', 
          createdAt: new Date().toISOString(), 
          createdBy: { name: 'Admin Three', email: 'admin3@example.com' },
          panCard: 'QRSTU3456V',
          aadharNumber: '456789012345',
          preferredBank: 'SBI'
        },
      ]
    };
  }

  static async getAllLeads() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const leads = await this.getRecentLeads();
    return leads;
  }
}