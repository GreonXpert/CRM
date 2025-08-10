// contexts/AppContext.js - Enhanced Context API Structure
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import apiClient from '../api/apiClient';

// ==============================================
// 1. APP STATE MANAGEMENT CONTEXT
// ==============================================

const AppStateContext = createContext();
const AppDispatchContext = createContext();

// Initial state
const initialState = {
  loading: false,
  error: null,
  leads: [],
  users: [],
  dashboardStats: null,
  notifications: [],
};

// Action types
const ACTION_TYPES = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_LEADS: 'SET_LEADS',
  ADD_LEAD: 'ADD_LEAD',
  UPDATE_LEAD: 'UPDATE_LEAD',
  DELETE_LEAD: 'DELETE_LEAD',
  SET_USERS: 'SET_USERS',
  ADD_USER: 'ADD_USER',
  UPDATE_USER: 'UPDATE_USER',
  DELETE_USER: 'DELETE_USER',
  SET_DASHBOARD_STATS: 'SET_DASHBOARD_STATS',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ACTION_TYPES.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case ACTION_TYPES.CLEAR_ERROR:
      return { ...state, error: null };
    
    case ACTION_TYPES.SET_LEADS:
      return { ...state, leads: action.payload, loading: false };
    
    case ACTION_TYPES.ADD_LEAD:
      return { 
        ...state, 
        leads: [action.payload, ...state.leads],
        loading: false 
      };
    
    case ACTION_TYPES.UPDATE_LEAD:
      return {
        ...state,
        leads: state.leads.map(lead => 
          lead._id === action.payload._id ? action.payload : lead
        ),
        loading: false
      };
    
    case ACTION_TYPES.DELETE_LEAD:
      return {
        ...state,
        leads: state.leads.filter(lead => lead._id !== action.payload),
        loading: false
      };
    
    case ACTION_TYPES.SET_USERS:
      return { ...state, users: action.payload, loading: false };
    
    case ACTION_TYPES.ADD_USER:
      return { 
        ...state, 
        users: [action.payload, ...state.users],
        loading: false 
      };
    
    case ACTION_TYPES.UPDATE_USER:
      return {
        ...state,
        users: state.users.map(user => 
          user._id === action.payload._id ? action.payload : user
        ),
        loading: false
      };
    
    case ACTION_TYPES.DELETE_USER:
      return {
        ...state,
        users: state.users.filter(user => user._id !== action.payload),
        loading: false
      };
    
    case ACTION_TYPES.SET_DASHBOARD_STATS:
      return { ...state, dashboardStats: action.payload, loading: false };
    
    case ACTION_TYPES.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };
    
    case ACTION_TYPES.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    
    default:
      return state;
  }
};

// ==============================================
// 2. APP DATA PROVIDER
// ==============================================
export const AppDataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};

// ==============================================
// 3. HOOKS FOR ACCESSING CONTEXT
// ==============================================
export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppDataProvider');
  }
  return context;
};

export const useAppDispatch = () => {
  const context = useContext(AppDispatchContext);
  if (!context) {
    throw new Error('useAppDispatch must be used within AppDataProvider');
  }
  return context;
};
// import apiClient moved to top

// ==============================================
// 4. ENHANCED API SERVICE LAYER
// ==============================================

export class ApiService {
  static async handleApiCall(apiCall, dispatch, successAction, errorMessage) {
    dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
    dispatch({ type: ACTION_TYPES.CLEAR_ERROR });
    
    try {
      const response = await apiCall();
      if (successAction) {
        dispatch(successAction(response.data));
      }
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || errorMessage || 'An error occurred';
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: message });
      
      // Add notification for error
      dispatch({
        type: ACTION_TYPES.ADD_NOTIFICATION,
        payload: {
          id: Date.now(),
          type: 'error',
          message,
          timestamp: new Date().toISOString()
        }
      });
      
      throw error;
    }
  }
}

// ==============================================
// 5. CUSTOM HOOKS FOR DATA OPERATIONS
// ==============================================

// Hook for Lead operations
export const useLeads = () => {
  const state = useAppState();
  const dispatch = useAppDispatch();

  const fetchLeads = useCallback(async () => {
    return ApiService.handleApiCall(
      () => apiClient.get('/api/leads'),
      dispatch,
      (data) => ({ type: ACTION_TYPES.SET_LEADS, payload: data }),
      'Failed to fetch leads'
    );
  }, [dispatch]);

  const createLead = useCallback(async (leadData) => {
    return ApiService.handleApiCall(
      () => apiClient.post('/api/leads', leadData),
      dispatch,
      (data) => ({ type: ACTION_TYPES.ADD_LEAD, payload: data }),
      'Failed to create lead'
    );
  }, [dispatch]);

  const updateLead = useCallback(async (leadId, leadData) => {
    return ApiService.handleApiCall(
      () => apiClient.put(`/api/leads/${leadId}`, leadData),
      dispatch,
      (data) => ({ type: ACTION_TYPES.UPDATE_LEAD, payload: data }),
      'Failed to update lead'
    );
  }, [dispatch]);

  const deleteLead = useCallback(async (leadId) => {
    return ApiService.handleApiCall(
      () => apiClient.delete(`/api/leads/${leadId}`),
      dispatch,
      () => ({ type: ACTION_TYPES.DELETE_LEAD, payload: leadId }),
      'Failed to delete lead'
    );
  }, [dispatch]);

  return {
    leads: state.leads,
    loading: state.loading,
    error: state.error,
    fetchLeads,
    createLead,
    updateLead,
    deleteLead,
  };
};

// Hook for User operations
export const useUsers = () => {
  const state = useAppState();
  const dispatch = useAppDispatch();

  const fetchUsers = useCallback(async () => {
    return ApiService.handleApiCall(
      () => apiClient.get('/api/users'),
      dispatch,
      (data) => ({ type: ACTION_TYPES.SET_USERS, payload: data }),
      'Failed to fetch users'
    );
  }, [dispatch]);

  const createUser = useCallback(async (userData) => {
    return ApiService.handleApiCall(
      () => apiClient.post('/api/users', userData),
      dispatch,
      (data) => ({ type: ACTION_TYPES.ADD_USER, payload: data }),
      'Failed to create user'
    );
  }, [dispatch]);

  const updateUser = useCallback(async (userId, userData) => {
    return ApiService.handleApiCall(
      () => apiClient.put(`/api/users/${userId}`, userData),
      dispatch,
      (data) => ({ type: ACTION_TYPES.UPDATE_USER, payload: data }),
      'Failed to update user'
    );
  }, [dispatch]);

  const deleteUser = useCallback(async (userId) => {
    return ApiService.handleApiCall(
      () => apiClient.delete(`/api/users/${userId}`),
      dispatch,
      () => ({ type: ACTION_TYPES.DELETE_USER, payload: userId }),
      'Failed to delete user'
    );
  }, [dispatch]);

  return {
    users: state.users,
    loading: state.loading,
    error: state.error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};

// Hook for Dashboard operations
export const useDashboard = () => {
  const state = useAppState();
  const dispatch = useAppDispatch();

  const fetchDashboardStats = useCallback(async () => {
    return ApiService.handleApiCall(
      () => apiClient.get('/api/dashboard/stats'),
      dispatch,
      (data) => ({ type: ACTION_TYPES.SET_DASHBOARD_STATS, payload: data }),
      'Failed to fetch dashboard statistics'
    );
  }, [dispatch]);

  return {
    dashboardStats: state.dashboardStats,
    loading: state.loading,
    error: state.error,
    fetchDashboardStats,
  };
};

// Hook for Notifications
export const useNotifications = () => {
  const state = useAppState();
  const dispatch = useAppDispatch();

  const addNotification = useCallback((notification) => {
    dispatch({
      type: ACTION_TYPES.ADD_NOTIFICATION,
      payload: {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...notification
      }
    });
  }, [dispatch]);

  const removeNotification = useCallback((id) => {
    dispatch({
      type: ACTION_TYPES.REMOVE_NOTIFICATION,
      payload: id
    });
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch({ type: ACTION_TYPES.CLEAR_ERROR });
  }, [dispatch]);

  return {
    notifications: state.notifications,
    error: state.error,
    addNotification,
    removeNotification,
    clearError,
  };
};

export { ACTION_TYPES };