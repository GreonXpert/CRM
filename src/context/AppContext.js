// /src/context/AppContext.js
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { createLead as createLeadAPI, createLeadFromLink } from '../api/leadService';
import { useAuth } from '../hooks/useAuth'; // (import kept; safe if unused)

// ==============================================
// 1. CONTEXT CREATION
// ==============================================
const AppStateContext = createContext();
const AppDispatchContext = createContext();

// ==============================================
// 2. ACTION TYPES
// ==============================================
export const ACTION_TYPES = {
  // Loading and Error States
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  
  // Lead Actions
  SET_LEADS: 'SET_LEADS',
  ADD_LEAD: 'ADD_LEAD',
  UPDATE_LEAD: 'UPDATE_LEAD',
  DELETE_LEAD: 'DELETE_LEAD',
  SET_LEAD_LOADING: 'SET_LEAD_LOADING',
  SET_LEAD_ERROR: 'SET_LEAD_ERROR',
  
  // User Actions
  SET_USERS: 'SET_USERS',
  ADD_USER: 'ADD_USER',
  UPDATE_USER: 'UPDATE_USER',
  DELETE_USER: 'DELETE_USER',
  
  // Dashboard Actions
  SET_DASHBOARD_STATS: 'SET_DASHBOARD_STATS',
  
  // Notification Actions
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',

  // Share Link Actions
  SET_SHARE_LINK: 'SET_SHARE_LINK',
  CLEAR_SHARE_LINK: 'CLEAR_SHARE_LINK',
};

// ==============================================
// 3. INITIAL STATE
// ==============================================
const initialState = {
  // Global Loading & Error
  loading: false,
  error: null,
  
  // Lead Management
  leads: [],
  leadLoading: false,
  leadError: null,
  
  // User Management
  users: [],
  
  // Dashboard
  dashboardStats: null,
  
  // Notifications
  notifications: [],
  
  // Share Links
  shareLinks: new Map(), // userId -> shareLink
};

// ==============================================
// 4. REDUCER
// ==============================================
const appReducer = (state, action) => {
  switch (action.type) {
    // Loading and Error States
    case ACTION_TYPES.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ACTION_TYPES.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case ACTION_TYPES.CLEAR_ERROR:
      return { ...state, error: null, leadError: null };
    
    // Lead Actions
    case ACTION_TYPES.SET_LEAD_LOADING:
      return { ...state, leadLoading: action.payload };
    
    case ACTION_TYPES.SET_LEAD_ERROR:
      return { ...state, leadError: action.payload, leadLoading: false };
    
    case ACTION_TYPES.SET_LEADS:
      return { 
        ...state, 
        leads: action.payload, 
        leadLoading: false, 
        leadError: null 
      };
    
    case ACTION_TYPES.ADD_LEAD:
      return {
        ...state,
        leads: [action.payload, ...state.leads],
        leadLoading: false,
        leadError: null
      };
    
    case ACTION_TYPES.UPDATE_LEAD:
      return {
        ...state,
        leads: state.leads.map(lead =>
          lead._id === action.payload._id ? action.payload : lead
        ),
        leadLoading: false,
        leadError: null
      };
    
    case ACTION_TYPES.DELETE_LEAD:
      return {
        ...state,
        leads: state.leads.filter(lead => lead._id !== action.payload),
        leadLoading: false,
        leadError: null
      };
    
    // User Actions
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
    
    // Dashboard Actions
    case ACTION_TYPES.SET_DASHBOARD_STATS:
      return { ...state, dashboardStats: action.payload, loading: false };
    
    // Notification Actions
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
    
    case ACTION_TYPES.CLEAR_NOTIFICATIONS:
      return { ...state, notifications: [] };

    // Share Link Actions
    case ACTION_TYPES.SET_SHARE_LINK: {
      const newShareLinks = new Map(state.shareLinks);
      newShareLinks.set(action.payload.userId, action.payload.link);
      return { ...state, shareLinks: newShareLinks };
    }
    
    case ACTION_TYPES.CLEAR_SHARE_LINK: {
      const clearedShareLinks = new Map(state.shareLinks);
      clearedShareLinks.delete(action.payload);
      return { ...state, shareLinks: clearedShareLinks };
    }
    
    default:
      return state;
  }
};

// ==============================================
// 5. PROVIDER COMPONENT
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
// 6. CONTEXT HOOKS
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

// ==============================================
// 7. UTILITY FUNCTIONS (FIRST SET)
// ==============================================

// Notification Helper (first version)
export const createNotification = (type, message, duration = 5000) => ({
  id: Date.now() + Math.random(),
  type, // 'success', 'error', 'warning', 'info'
  message,
  timestamp: new Date().toISOString(),
  duration,
});

// Error Handler
const handleApiError = (error, dispatch, defaultMessage = 'An error occurred') => {
  console.error('API Error:', error);
  
  let errorMessage = defaultMessage;
  
  if (error.response?.data?.message) {
    errorMessage = error.response.data.message;
  } else if (error.message) {
    errorMessage = error.message;
  }
  
  // Dispatch error to state
  dispatch({ type: ACTION_TYPES.SET_LEAD_ERROR, payload: errorMessage });
  
  // Add error notification
  dispatch({
    type: ACTION_TYPES.ADD_NOTIFICATION,
    payload: createNotification('error', errorMessage)
  });
  
  throw error;
};

// Success Handler
const handleApiSuccess = (data, dispatch, successAction, successMessage) => {
  if (successAction) {
    dispatch(successAction(data));
  }
  
  if (successMessage) {
    dispatch({
      type: ACTION_TYPES.ADD_NOTIFICATION,
      payload: createNotification('success', successMessage)
    });
  }
  
  return data;
};

// ==============================================
// 8. CUSTOM HOOKS FOR OPERATIONS
// ==============================================

// Lead Operations Hook
export const useLeads = () => {
  const state = useAppState();
  const dispatch = useAppDispatch();

  // Create Lead (Regular or Shared Link)
  const createLead = useCallback(async (leadData, userId = null, isSharedLink = false) => {
    dispatch({ type: ACTION_TYPES.SET_LEAD_LOADING, payload: true });
    dispatch({ type: ACTION_TYPES.CLEAR_ERROR });

    try {
      let result;
      
      if (isSharedLink && userId) {
        // Use shared link API
        result = await createLeadFromLink(userId, leadData);
        
        return handleApiSuccess(
          result.data,
          dispatch,
          (data) => ({ type: ACTION_TYPES.ADD_LEAD, payload: data }),
          'Lead information submitted successfully!'
        );
      } else {
        // Use regular API
        result = await createLeadAPI(leadData);
        
        return handleApiSuccess(
          result.data,
          dispatch,
          (data) => ({ type: ACTION_TYPES.ADD_LEAD, payload: data }),
          'Lead created successfully!'
        );
      }
    } catch (error) {
      return handleApiError(error, dispatch, 'Failed to create lead');
    }
  }, [dispatch]);

  // Generate Share Link
  const generateShareLink = useCallback((userId) => {
    const baseUrl = window.location.origin;
    const shareLink = `${baseUrl}/lead/shared/${userId}`;
    
    dispatch({
      type: ACTION_TYPES.SET_SHARE_LINK,
      payload: { userId, link: shareLink }
    });
    
    return shareLink;
  }, [dispatch]);

  // Copy Share Link to Clipboard
  const copyShareLink = useCallback(async (userId) => {
    try {
      const shareLink = generateShareLink(userId);
      
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareLink);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shareLink;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      
      dispatch({
        type: ACTION_TYPES.ADD_NOTIFICATION,
        payload: createNotification('success', 'Share link copied to clipboard!')
      });
      
      return shareLink;
    } catch (error) {
      dispatch({
        type: ACTION_TYPES.ADD_NOTIFICATION,
        payload: createNotification('error', 'Failed to copy link to clipboard')
      });
      throw error;
    }
  }, [dispatch, generateShareLink]);

  // Get Share Link for User
  const getShareLink = useCallback((userId) => {
    return state.shareLinks.get(userId) || generateShareLink(userId);
  }, [state.shareLinks, generateShareLink]);

  // Fetch All Leads
  const fetchLeads = useCallback(async () => {
    dispatch({ type: ACTION_TYPES.SET_LEAD_LOADING, payload: true });
    dispatch({ type: ACTION_TYPES.CLEAR_ERROR });

    try {
      // Placeholder for now
      const result = { data: [] };
      
      return handleApiSuccess(
        result.data,
        dispatch,
        (data) => ({ type: ACTION_TYPES.SET_LEADS, payload: data })
      );
    } catch (error) {
      return handleApiError(error, dispatch, 'Failed to fetch leads');
    }
  }, [dispatch]);

  // Update Lead
  const updateLead = useCallback(async (leadId, leadData) => {
    dispatch({ type: ACTION_TYPES.SET_LEAD_LOADING, payload: true });
    
    try {
      // Placeholder for now
      const result = { data: { _id: leadId, ...leadData } };
      
      return handleApiSuccess(
        result.data,
        dispatch,
        (data) => ({ type: ACTION_TYPES.UPDATE_LEAD, payload: data }),
        'Lead updated successfully!'
      );
    } catch (error) {
      return handleApiError(error, dispatch, 'Failed to update lead');
    }
  }, [dispatch]);

  // Delete Lead
  const deleteLead = useCallback(async (leadId) => {
    dispatch({ type: ACTION_TYPES.SET_LEAD_LOADING, payload: true });
    
    try {
      // Placeholder for now
      dispatch({ type: ACTION_TYPES.DELETE_LEAD, payload: leadId });
      dispatch({
        type: ACTION_TYPES.ADD_NOTIFICATION,
        payload: createNotification('success', 'Lead deleted successfully!')
      });
      
      return true;
    } catch (error) {
      return handleApiError(error, dispatch, 'Failed to delete lead');
    }
  }, [dispatch]);

  return {
    // State
    leads: state.leads,
    leadLoading: state.leadLoading,
    leadError: state.leadError,
    
    // Actions
    createLead,
    fetchLeads,
    updateLead,
    deleteLead,
    
    // Share Link Functions
    generateShareLink,
    copyShareLink,
    getShareLink,
  };
};

// Notification Operations Hook (first version)
export const useNotifications = () => {
  const state = useAppState();
  const dispatch = useAppDispatch();

  const addNotification = useCallback((type, message, duration) => {
    const notification = createNotification(type, message, duration);
    dispatch({ type: ACTION_TYPES.ADD_NOTIFICATION, payload: notification });
    return notification.id;
  }, [dispatch]);

  const removeNotification = useCallback((id) => {
    dispatch({ type: ACTION_TYPES.REMOVE_NOTIFICATION, payload: id });
  }, [dispatch]);

  const clearAllNotifications = useCallback(() => {
    dispatch({ type: ACTION_TYPES.CLEAR_NOTIFICATIONS });
  }, [dispatch]);

  return {
    notifications: state.notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
  };
};

// Global Loading and Error Hook (first version)
export const useGlobalState = () => {
  const state = useAppState();
  const dispatch = useAppDispatch();

  const setLoading = useCallback((loading) => {
    dispatch({ type: ACTION_TYPES.SET_LOADING, payload: loading });
  }, [dispatch]);

  const setError = useCallback((error) => {
    dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error });
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch({ type: ACTION_TYPES.CLEAR_ERROR });
  }, [dispatch]);

  return {
    loading: state.loading,
    error: state.error,
    setLoading,
    setError,
    clearError,
  };
};

// ==============================================
// DASHBOARD HOOK
// ==============================================
export const useDashboard = () => {
  const state = useAppState();
  const dispatch = useAppDispatch();

  const fetchDashboardStats = useCallback(async () => {
    dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:7736/api'}/dashboard/stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      dispatch({ type: ACTION_TYPES.SET_DASHBOARD_STATS, payload: data });
      
      return data;
    } catch (error) {
      console.error('Dashboard stats fetch error:', error);
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
      throw error;
    } finally {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
    }
  }, [dispatch]);

  const refreshDashboard = useCallback(() => {
    return fetchDashboardStats();
  }, [fetchDashboardStats]);

  return {
    dashboardStats: state.dashboardStats,
    loading: state.loading,
    error: state.error,
    fetchDashboardStats,
    refreshDashboard,
  };
};

// ==============================================
// ENHANCED GLOBAL STATE HOOK (Optional)
// (Renamed to avoid duplicate export name)
// ==============================================
export const useGlobalStateEx = () => {
  const state = useAppState();
  const dispatch = useAppDispatch();

  const setGlobalLoading = useCallback((loading) => {
    dispatch({ type: ACTION_TYPES.SET_LOADING, payload: loading });
  }, [dispatch]);

  const setGlobalError = useCallback((error) => {
    dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error });
  }, [dispatch]);

  const clearGlobalError = useCallback(() => {
    dispatch({ type: ACTION_TYPES.CLEAR_ERROR });
  }, [dispatch]);

  return {
    ...state,
    setGlobalLoading,
    setGlobalError,
    clearGlobalError,
  };
};

// ==============================================
// UTILITY HOOK FOR NOTIFICATIONS (Enhanced)
// (Renamed helpers to avoid collisions)
// ==============================================

// Enhanced Notification Helper (second version)
export const createNotificationEx = (message, type = 'info', duration = 5000) => {
  return {
    id: Date.now() + Math.random(),
    message,
    type, // 'success', 'error', 'warning', 'info'
    duration,
    timestamp: new Date().toISOString(),
  };
};

// Enhanced notifications hook with auto-remove (second version)
export const useNotificationsEx = () => {
  const state = useAppState();
  const dispatch = useAppDispatch();

  const addNotification = useCallback((notification) => {
    const fullNotification = typeof notification === 'string' 
      ? createNotificationEx(notification)
      : { ...createNotificationEx(''), ...notification };

    dispatch({ 
      type: ACTION_TYPES.ADD_NOTIFICATION, 
      payload: fullNotification 
    });

    // Auto-remove notification after specified duration
    if (fullNotification.duration > 0) {
      setTimeout(() => {
        dispatch({ 
          type: ACTION_TYPES.REMOVE_NOTIFICATION, 
          payload: fullNotification.id 
        });
      }, fullNotification.duration);
    }

    return fullNotification.id;
  }, [dispatch]);

  const removeNotification = useCallback((id) => {
    dispatch({ type: ACTION_TYPES.REMOVE_NOTIFICATION, payload: id });
  }, [dispatch]);

  const clearAllNotifications = useCallback(() => {
    dispatch({ type: ACTION_TYPES.CLEAR_NOTIFICATIONS });
  }, [dispatch]);

  // Convenience methods
  const showSuccess = useCallback((message, duration) => {
    return addNotification({ message, type: 'success', duration });
  }, [addNotification]);

  const showError = useCallback((message, duration) => {
    return addNotification({ message, type: 'error', duration });
  }, [addNotification]);

  const showWarning = useCallback((message, duration) => {
    return addNotification({ message, type: 'warning', duration });
  }, [addNotification]);

  const showInfo = useCallback((message, duration) => {
    return addNotification({ message, type: 'info', duration });
  }, [addNotification]);

  return {
    notifications: state.notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};

// ==============================================
// MOCK DATA SERVICE (Temporary - Remove in Production)
// ==============================================
export const MockDataService = {
  getDashboardStats: () => Promise.resolve({
    data: {
      totalLeads: 150,
      pendingLeads: 25,
      approvedLeads: 100,
      rejectedLeads: 25,
      conversionRate: 66.7,
      monthlyGrowth: 12.5,
      recentActivity: [
        { id: 1, action: 'New lead created', timestamp: new Date() },
        { id: 2, action: 'Lead approved', timestamp: new Date() },
      ]
    }
  }),

  getRecentLeads: () => Promise.resolve({
    data: [
      {
        _id: '1',
        customerName: 'John Doe',
        mobileNumber: '9876543210',
        panCard: 'ABCPD1234E',
        preferredBank: 'HDFC Bank',
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
      // Add more mock data as needed
    ]
  }),
};

// ==============================================
// ERROR BOUNDARY CONTEXT (Optional Enhancement)
// ==============================================
export const ErrorBoundaryContext = createContext();

export const useErrorBoundary = () => {
  const context = useContext(ErrorBoundaryContext);
  if (!context) {
    throw new Error('useErrorBoundary must be used within ErrorBoundaryProvider');
  }
  return context;
};
