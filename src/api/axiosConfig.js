// /src/api/axiosConfig.js
import axios from 'axios';

// ==============================================
// AXIOS CONFIGURATION
// ==============================================

// Get API base URL from environment variables
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:7736/api';

console.log('🔧 API Base URL:', API_BASE_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==============================================
// REQUEST INTERCEPTOR
// ==============================================
api.interceptors.request.use(
  (config) => {
    // Add auth token to requests if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request ID for tracking
    config.metadata = { startTime: Date.now() };
    
    // Log request details in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
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

// ==============================================
// RESPONSE INTERCEPTOR
// ==============================================
api.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const duration = Date.now() - response.config.metadata.startTime;
    
    // Log successful response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`, {
        status: response.status,
        data: response.data
      });
    }
    
    return response;
  },
  (error) => {
    // Calculate request duration if available
    const duration = error.config?.metadata?.startTime 
      ? Date.now() - error.config.metadata.startTime 
      : 'unknown';
    
    // Log error details
    console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url} (${duration}ms)`, {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    });
    
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          // Bad Request
          console.error('Bad Request:', data?.message || 'Invalid request data');
          break;
          
        case 401:
          // Unauthorized - clear token and redirect to login
          console.warn('Unauthorized access - clearing token');
          localStorage.removeItem('authToken');
          
          // Only redirect if not already on login page or shared form
          const currentPath = window.location.pathname;
          if (!currentPath.includes('/login') && !currentPath.includes('/shared')) {
            // Delay redirect to avoid interrupting the current request
            setTimeout(() => {
              window.location.href = '/login';
            }, 100);
          }
          break;
          
        case 403:
          // Forbidden
          console.error('Access denied - insufficient permissions');
          break;
          
        case 404:
          // Not found
          console.error('Resource not found');
          break;
          
        case 409:
          // Conflict (e.g., duplicate data)
          console.error('Conflict:', data?.message || 'Resource conflict');
          break;
          
        case 422:
          // Unprocessable Entity (validation errors)
          console.error('Validation Error:', data?.message || 'Invalid data provided');
          break;
          
        case 429:
          // Too Many Requests
          console.error('Rate limit exceeded - please slow down');
          break;
          
        case 500:
          // Internal Server Error
          console.error('Internal server error - please try again later');
          break;
          
        case 502:
          // Bad Gateway
          console.error('Server temporarily unavailable');
          break;
          
        case 503:
          // Service Unavailable
          console.error('Service temporarily unavailable');
          break;
          
        case 504:
          // Gateway Timeout
          console.error('Request timeout - server took too long to respond');
          break;
          
        default:
          console.error(`HTTP Error ${status}:`, data?.message || 'Unknown error');
      }
      
      // Return standardized error object
      return Promise.reject({
        status,
        message: data?.message || getDefaultErrorMessage(status),
        data: data || null,
        response: error.response,
        code: data?.code || 'HTTP_ERROR'
      });
      
    } else if (error.request) {
      // Network error - no response received
      console.error('Network Error - No response received:', error.request);
      
      return Promise.reject({
        status: 0,
        message: 'Network error. Please check your internet connection and try again.',
        data: null,
        request: error.request,
        code: 'NETWORK_ERROR'
      });
      
    } else {
      // Other error (e.g., request setup error)
      console.error('Request Setup Error:', error.message);
      
      return Promise.reject({
        status: -1,
        message: error.message || 'An unexpected error occurred',
        data: null,
        error: error,
        code: 'REQUEST_ERROR'
      });
    }
  }
);

// ==============================================
// UTILITY FUNCTIONS
// ==============================================

/**
 * Get default error message for HTTP status codes
 * @param {number} status - HTTP status code
 * @returns {string} Default error message
 */
const getDefaultErrorMessage = (status) => {
  const statusMessages = {
    400: 'Invalid request. Please check your input and try again.',
    401: 'Authentication required. Please log in to continue.',
    403: 'You do not have permission to perform this action.',
    404: 'The requested resource was not found.',
    409: 'This data already exists. Please try with different information.',
    422: 'The provided data is invalid. Please check and try again.',
    429: 'Too many requests. Please wait a moment before trying again.',
    500: 'Internal server error. Please try again later.',
    502: 'Server temporarily unavailable. Please try again in a few moments.',
    503: 'Service temporarily unavailable. Please try again later.',
    504: 'Request timeout. The server took too long to respond.',
  };
  
  return statusMessages[status] || `An error occurred (${status}). Please try again.`;
};

/**
 * Create a request with custom timeout
 * @param {Object} config - Axios config
 * @param {number} timeout - Custom timeout in milliseconds
 * @returns {Promise} Axios request promise
 */
export const createRequestWithTimeout = (config, timeout = 10000) => {
  return api({
    ...config,
    timeout
  });
};

/**
 * Check if error is a network error
 * @param {Object} error - Error object
 * @returns {boolean} True if network error
 */
export const isNetworkError = (error) => {
  return error.code === 'NETWORK_ERROR' || error.status === 0;
};

/**
 * Check if error is an authentication error
 * @param {Object} error - Error object
 * @returns {boolean} True if auth error
 */
export const isAuthError = (error) => {
  return error.status === 401;
};

/**
 * Check if error is a validation error
 * @param {Object} error - Error object
 * @returns {boolean} True if validation error
 */
export const isValidationError = (error) => {
  return error.status === 400 || error.status === 422;
};

/**
 * Check if error is a permission error
 * @param {Object} error - Error object
 * @returns {boolean} True if permission error
 */
export const isPermissionError = (error) => {
  return error.status === 403;
};

/**
 * Check if error is a server error
 * @param {Object} error - Error object
 * @returns {boolean} True if server error
 */
export const isServerError = (error) => {
  return error.status >= 500 && error.status < 600;
};

/**
 * Retry a request with exponential backoff
 * @param {Function} requestFn - Function that returns a promise
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise} Request promise
 */
export const retryRequest = async (requestFn, maxRetries = 3, baseDelay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (4xx) except 429 (rate limit)
      if (error.status >= 400 && error.status < 500 && error.status !== 429) {
        throw error;
      }
      
      // Don't retry on last attempt
      if (attempt === maxRetries) {
        break;
      }
      
      // Calculate delay with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`Retrying request in ${delay}ms (attempt ${attempt + 1}/${maxRetries + 1})`);
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

// ==============================================
// EXPORTS
// ==============================================
export default api;

// // Named exports for convenience
// export { 
//   API_BASE_URL,
//   getDefaultErrorMessage,
//   createRequestWithTimeout,
//   isNetworkError,
//   isAuthError,
//   isValidationError,
//   isPermissionError,
//   isServerError,
//   retryRequest
// };