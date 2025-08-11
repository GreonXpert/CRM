// src/contexts/AuthContext.js
import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  initializeAuth, 
  selectCurrentUser, 
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError 
} from '../store/slices/authSlice';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  useEffect(() => {
    // Initialize auth state from localStorage on app start
    dispatch(initializeAuth());
  }, [dispatch]);

  const isSuperAdmin = () => {
    return user?.role === 'SUPER ADMIN';
  };

  const isAdmin = () => {
    return user?.role === 'ADMIN';
  };

  const hasPermission = (requiredRoles) => {
    if (!user) return false;
    if (Array.isArray(requiredRoles)) {
      return requiredRoles.includes(user.role);
    }
    return user.role === requiredRoles;
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    isSuperAdmin,
    isAdmin,
    hasPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};