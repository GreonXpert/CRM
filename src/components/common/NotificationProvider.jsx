// components/common/NotificationProvider.jsx
import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { Snackbar, Alert, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

const NotificationContext = createContext(null);

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return ctx;
};

function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const timeoutsRef = useRef(new Map());
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      // Clear any pending timeouts on unmount
      timeoutsRef.current.forEach((t) => clearTimeout(t));
      timeoutsRef.current.clear();
    };
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    const t = timeoutsRef.current.get(id);
    if (t) {
      clearTimeout(t);
      timeoutsRef.current.delete(id);
    }
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current.clear();
  }, []);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'info',            // 'success' | 'info' | 'warning' | 'error'
      message: '',
      autoHideDuration: 6000,  // ms
      ...notification,
    };

    setNotifications((prev) => [...prev, newNotification]);

    // Auto-remove after duration
    if (newNotification.autoHideDuration > 0) {
      const t = setTimeout(() => {
        if (mountedRef.current) removeNotification(id);
      }, newNotification.autoHideDuration);
      timeoutsRef.current.set(id, t);
    }
  }, [removeNotification]);

  const contextValue = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}

      {notifications.map((n) => (
        <Snackbar
          key={n.id}
          open
          autoHideDuration={n.autoHideDuration}
          onClose={() => removeNotification(n.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ mt: 8 }}
        >
          <Alert
            severity={n.type}
            variant="filled"
            action={
              <IconButton
                size="small"
                color="inherit"
                onClick={() => removeNotification(n.id)}
                aria-label="close"
              >
                <Close fontSize="small" />
              </IconButton>
            }
          >
            {n.message}
          </Alert>
        </Snackbar>
      ))}
    </NotificationContext.Provider>
  );
}

export default NotificationProvider;
