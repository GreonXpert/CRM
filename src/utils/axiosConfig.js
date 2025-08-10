// src/utils/axiosConfig.js - Updated API client
import axios from 'axios';
import API_CONFIG from '../config/apiConfig';

// Create axios instance with correct configuration
const api = axios.create({
  baseURL: `${API_CONFIG.BASE_URL}/api`, // This will now point to http://localhost:7736/api
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add timestamp for tracking
    config.metadata = { startTime: Date.now() };
    
    // Log in development
    if (API_CONFIG.ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params
      });
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with retry logic
api.interceptors.response.use(
  (response) => {
    // Calculate duration
    const duration = Date.now() - response.config.metadata.startTime;
    
    if (API_CONFIG.ENV === 'development') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`, {
        status: response.status,
        data: response.data
      });
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Log error
    if (API_CONFIG.ENV === 'development') {
      console.error('❌ API Error:', {
        url: originalRequest?.url,
        method: originalRequest?.method,
        status: error.response?.status,
        message: error.message
      });
    }
    
    // Handle specific error cases
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect
          localStorage.removeItem('authToken');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
          
        case 403:
          console.error('Access denied');
          break;
          
        case 429:
          // Rate limiting - implement retry with exponential backoff
          if (!originalRequest._retry && 
              (originalRequest._retryCount || 0) < API_CONFIG.RETRY_ATTEMPTS) {
            originalRequest._retry = true;
            originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
            
            const delay = API_CONFIG.RETRY_DELAY * Math.pow(2, originalRequest._retryCount - 1);
            console.log(`⏳ Retrying request in ${delay}ms (attempt ${originalRequest._retryCount})`);
            
            await new Promise(resolve => setTimeout(resolve, delay));
            return api(originalRequest);
          }
          break;
          
        case 500:
        case 502:
        case 503:
        case 504:
          // Server errors - retry for certain requests
          if (!originalRequest._retry && 
              originalRequest.method?.toLowerCase() === 'get' &&
              (originalRequest._retryCount || 0) < API_CONFIG.RETRY_ATTEMPTS) {
            originalRequest._retry = true;
            originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
            
            const delay = API_CONFIG.RETRY_DELAY * originalRequest._retryCount;
            console.log(`⏳ Retrying GET request due to server error in ${delay}ms`);
            
            await new Promise(resolve => setTimeout(resolve, delay));
            return api(originalRequest);
          }
          break;
      }
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timeout:', originalRequest?.url);
    } else if (error.request) {
      console.error('Network error - no response received');
    }
    
    return Promise.reject(error);
  }
);

export default api;

