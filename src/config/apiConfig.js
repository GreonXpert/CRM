// src/config/apiConfig.js
const API_CONFIG = {
  // Base URLs - Update these to match your backend port
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:7736',
  SOCKET_URL: process.env.REACT_APP_SOCKET_URL || 'http://localhost:7736',
  
  // Timeouts
  TIMEOUT: 30000,
  SOCKET_TIMEOUT: 20000,
  
  // Retry configuration
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  
  // Environment
  ENV: process.env.NODE_ENV || 'development',
  
  // Feature flags
  FEATURES: {
    REAL_TIME_UPDATES: true,
    OFFLINE_SUPPORT: false,
    ANALYTICS: process.env.NODE_ENV === 'production',
  }
};

export default API_CONFIG;

