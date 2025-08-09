// /src/context/AuthContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { loginUser } from '../api/authService';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if token is expired
  const isTokenValid = useCallback((token) => {
    if (!token) return false;
    
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      // Check if token is expired (with 5 minute buffer)
      return decodedToken.exp > (currentTime + 300);
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }, []);

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        
        if (token && isTokenValid(token)) {
          const decodedUser = jwtDecode(token);
          setUser(decodedUser);
        } else {
          // Token is invalid or expired
          localStorage.removeItem('authToken');
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('authToken');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [isTokenValid]);

  // Login function
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Attempting login for:', email);
      
      const response = await loginUser({ email, password });
      
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }

      const { token, user: userData } = response.data;
      
      if (!token) {
        throw new Error('No token received from server');
      }

      // Validate token before storing
      if (!isTokenValid(token)) {
        throw new Error('Received invalid token from server');
      }

      // Store token and decode user data
      localStorage.setItem('authToken', token);
      const decodedUser = jwtDecode(token);
      
      // Merge server user data with decoded token data
      const mergedUser = {
        ...decodedUser,
        ...userData,
      };
      
      setUser(mergedUser);
      console.log('Login successful:', mergedUser);
      
      return mergedUser;
    } catch (error) {
      console.error('Login error:', error);
      
      // Clear any stored token on login failure
      localStorage.removeItem('authToken');
      setUser(null);
      
      // Set error for UI to display
      const errorMessage = error.message || 'Login failed. Please try again.';
      setError(errorMessage);
      
      throw error; // Re-throw for component error handling
    } finally {
      setLoading(false);
    }
  }, [isTokenValid]);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setUser(null);
    setError(null);
    console.log('User logged out');
  }, []);

  // Refresh token function (optional - for future use)
  const refreshToken = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No token to refresh');

      // You can implement token refresh logic here
      // const response = await refreshUserToken(token);
      // Handle the refreshed token
      
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
  }, [logout]);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    refreshToken,
    clearError,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};