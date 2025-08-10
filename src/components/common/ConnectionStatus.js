// src/components/common/ConnectionStatus.js - Connection status indicator
import React from 'react';
import { 
  Box, 
  Chip, 
  Alert, 
  Button, 
  Tooltip,
  CircularProgress
} from '@mui/material';
import { 
  Wifi, 
  WifiOff, 
  Refresh 
} from '@mui/icons-material';
import { useSocket } from '../../hooks/useSocket';

const ConnectionStatus = ({ showDetails = false }) => {
  const { 
    connected, 
    error, 
    connectionAttempts, 
    reconnect,
    socketId 
  } = useSocket();

  const getStatusColor = () => {
    if (connected) return 'success';
    if (error) return 'error';
    return 'warning';
  };

  const getStatusText = () => {
    if (connected) return 'Connected';
    if (error) return 'Disconnected';
    return 'Connecting...';
  };

  const getStatusIcon = () => {
    if (connected) return <Wifi />;
    if (error) return <WifiOff />;
    return <CircularProgress size={16} />;
  };

  if (showDetails) {
    return (
      <Box>
        {error && (
          <Alert 
            severity="error" 
            action={
              <Button 
                color="inherit" 
                size="small" 
                onClick={reconnect}
                startIcon={<Refresh />}
              >
                Reconnect
              </Button>
            }
            sx={{ mb: 2 }}
          >
            {error}
            {connectionAttempts > 0 && ` (${connectionAttempts} attempts)`}
          </Alert>
        )}
        
        <Box display="flex" alignItems="center" gap={1}>
          <Chip
            icon={getStatusIcon()}
            label={getStatusText()}
            color={getStatusColor()}
            variant="outlined"
            size="small"
          />
          {connected && socketId && (
            <Tooltip title={`Socket ID: ${socketId}`}>
              <Chip 
                label="Live" 
                color="success" 
                size="small" 
              />
            </Tooltip>
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Tooltip title={connected ? `Connected (${socketId})` : error || 'Connecting...'}>
      <Chip
        icon={getStatusIcon()}
        label={getStatusText()}
        color={getStatusColor()}
        size="small"
      />
    </Tooltip>
  );
};

export default ConnectionStatus;