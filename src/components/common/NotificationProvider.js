// /src/components/common/NotificationProvider.js
import React, { useEffect } from 'react';
import { 
  Snackbar, 
  Alert, 
  AlertTitle,
  Box,
  IconButton,
  Slide,
  Stack
} from '@mui/material';
import { Close, CheckCircle, Error, Warning, Info } from '@mui/icons-material';
import { useNotifications } from '../../context/AppContext';

// ==============================================
// SLIDE TRANSITION COMPONENT
// ==============================================
const SlideTransition = (props) => {
  return <Slide {...props} direction="up" />;
};

// ==============================================
// NOTIFICATION ITEM COMPONENT
// ==============================================
const NotificationItem = ({ notification, onClose }) => {
  const { id, type, message, title, duration = 5000 } = notification;

  // Auto-close notification after duration
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  // Get severity mapping
  const getSeverity = (type) => {
    const severityMap = {
      success: 'success',
      error: 'error',
      warning: 'warning',
      info: 'info',
    };
    return severityMap[type] || 'info';
  };

  // Get icon mapping
  const getIcon = (type) => {
    const iconMap = {
      success: <CheckCircle />,
      error: <Error />,
      warning: <Warning />,
      info: <Info />,
    };
    return iconMap[type];
  };

  return (
    <Alert
      severity={getSeverity(type)}
      icon={getIcon(type)}
      action={
        <IconButton
          aria-label="close"
          color="inherit"
          size="small"
          onClick={() => onClose(id)}
        >
          <Close fontSize="inherit" />
        </IconButton>
      }
      sx={{
        mb: 1,
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        minWidth: 320,
        maxWidth: 500,
        '& .MuiAlert-message': {
          width: '100%',
          padding: '4px 0',
        },
        '& .MuiAlert-action': {
          alignItems: 'flex-start',
          paddingTop: '8px',
        },
      }}
    >
      {title && <AlertTitle sx={{ fontWeight: 600 }}>{title}</AlertTitle>}
      {message}
    </Alert>
  );
};

// ==============================================
// MAIN NOTIFICATION PROVIDER COMPONENT
// ==============================================
const NotificationProvider = () => {
  const { notifications, removeNotification } = useNotifications();

  // Handle notification close
  const handleClose = (notificationId) => {
    removeNotification(notificationId);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      <Stack spacing={1} sx={{ pointerEvents: 'auto' }}>
        {notifications.map((notification) => (
          <Slide
            key={notification.id}
            direction="up"
            in={true}
            timeout={300}
          >
            <div>
              <NotificationItem
                notification={notification}
                onClose={handleClose}
              />
            </div>
          </Slide>
        ))}
      </Stack>
    </Box>
  );
};

// ==============================================
// NOTIFICATION HOOK FOR EASY USAGE
// ==============================================

/**
 * Custom hook for showing notifications easily
 * @returns {Object} Notification functions
 */
export const useNotify = () => {
  const { addNotification } = useNotifications();

  const notify = {
    success: (message, title, duration) => 
      addNotification('success', message, duration, title),
    
    error: (message, title, duration) => 
      addNotification('error', message, duration, title),
    
    warning: (message, title, duration) => 
      addNotification('warning', message, duration, title),
    
    info: (message, title, duration) => 
      addNotification('info', message, duration, title),
  };

  return notify;
};

// ==============================================
// NOTIFICATION HELPER FUNCTIONS
// ==============================================

/**
 * Show success notification
 * @param {Function} addNotification - Add notification function
 * @param {string} message - Notification message
 * @param {string} title - Optional title
 */
export const showSuccess = (addNotification, message, title) => {
  addNotification('success', message, 5000, title);
};

/**
 * Show error notification
 * @param {Function} addNotification - Add notification function
 * @param {string} message - Notification message
 * @param {string} title - Optional title
 */
export const showError = (addNotification, message, title) => {
  addNotification('error', message, 8000, title); // Longer duration for errors
};

/**
 * Show warning notification
 * @param {Function} addNotification - Add notification function
 * @param {string} message - Notification message
 * @param {string} title - Optional title
 */
export const showWarning = (addNotification, message, title) => {
  addNotification('warning', message, 6000, title);
};

/**
 * Show info notification
 * @param {Function} addNotification - Add notification function
 * @param {string} message - Notification message
 * @param {string} title - Optional title
 */
export const showInfo = (addNotification, message, title) => {
  addNotification('info', message, 5000, title);
};

/**
 * Show API error notification with proper formatting
 * @param {Function} addNotification - Add notification function
 * @param {Object} error - Error object from API
 */
export const showApiError = (addNotification, error) => {
  let message = 'An unexpected error occurred';
  let title = 'Error';

  if (error?.message) {
    message = error.message;
  } else if (error?.response?.data?.message) {
    message = error.response.data.message;
  }

  // Add status code to title if available
  if (error?.status) {
    title = `Error (${error.status})`;
  }

  addNotification('error', message, 8000, title);
};

/**
 * Show form validation error notification
 * @param {Function} addNotification - Add notification function
 * @param {Object} errors - Form validation errors
 */
export const showValidationError = (addNotification, errors) => {
  const errorMessages = Object.values(errors)
    .map(error => error.message)
    .filter(Boolean)
    .join(', ');

  if (errorMessages) {
    addNotification('error', errorMessages, 6000, 'Validation Error');
  }
};

/**
 * Show network error notification
 * @param {Function} addNotification - Add notification function
 */
export const showNetworkError = (addNotification) => {
  addNotification(
    'error', 
    'Please check your internet connection and try again.',
    8000,
    'Network Error'
  );
};

/**
 * Show unauthorized error notification
 * @param {Function} addNotification - Add notification function
 */
export const showUnauthorizedError = (addNotification) => {
  addNotification(
    'error', 
    'Your session has expired. Please log in again.',
    8000,
    'Session Expired'
  );
};

export default NotificationProvider;