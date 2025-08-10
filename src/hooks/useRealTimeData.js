// src/hooks/useRealTimeData.js
import { useEffect, useState } from 'react';
import { useSocket } from './useSocket';

export const useRealTimeData = (eventName, initialData = null, options = {}) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { on, off, connected, emit } = useSocket();

  const {
    autoRequest = false,
    requestEvent = null,
    requestData = {},
    refreshInterval = null
  } = options;

  useEffect(() => {
    if (!connected) return;

    setLoading(true);
    
    const handleData = (newData) => {
      setData(newData);
      setLoading(false);
      setError(null);
    };

    const handleError = (errorData) => {
      setError(errorData);
      setLoading(false);
    };

    // Listen to data events
    on(eventName, handleData);
    on(`${eventName}_error`, handleError);

    // Auto-request data if enabled
    if (autoRequest && requestEvent) {
      emit(requestEvent, requestData);
    }

    // Setup refresh interval if specified
    let interval = null;
    if (refreshInterval && requestEvent) {
      interval = setInterval(() => {
        if (connected) {
          emit(requestEvent, requestData);
        }
      }, refreshInterval);
    }

    return () => {
      off(eventName);
      off(`${eventName}_error`);
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [eventName, connected, on, off, emit, autoRequest, requestEvent, requestData, refreshInterval]);

  const refresh = () => {
    if (connected && requestEvent) {
      setLoading(true);
      emit(requestEvent, requestData);
    }
  };

  return { data, loading, error, refresh };
};

