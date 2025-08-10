// src/hooks/useSocket.js
import { useEffect, useState, useCallback, useRef } from 'react';
import socketService from '../services/socketService';

export const useSocket = () => {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const socketRef = useRef(null);

  useEffect(() => {
    const initializeSocket = () => {
      try {
        // Connect to socket
        const socket = socketService.connect();
        socketRef.current = socket;

        // Setup connection handlers
        socketService.onConnection((socket) => {
          setConnected(true);
          setError(null);
          setConnectionAttempts(0);
          console.log('✅ Socket connected in useSocket hook');
        });

        socketService.onDisconnection((reason) => {
          setConnected(false);
          if (reason !== 'io client disconnect') {
            setError(`Connection lost: ${reason}`);
            setConnectionAttempts(prev => prev + 1);
          }
        });

      } catch (err) {
        console.error('Failed to initialize socket:', err);
        setError('Failed to connect to server');
        setConnectionAttempts(prev => prev + 1);
      }
    };

    initializeSocket();

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketService.disconnect();
        setConnected(false);
        setError(null);
      }
    };
  }, []);

  // Emit event
  const emit = useCallback((event, data, callback) => {
    socketService.emit(event, data, callback);
  }, []);

  // Listen to event
  const on = useCallback((event, callback) => {
    socketService.on(event, callback);
  }, []);

  // Stop listening to event
  const off = useCallback((event) => {
    socketService.off(event);
  }, []);

  // Listen once
  const once = useCallback((event, callback) => {
    socketService.once(event, callback);
  }, []);

  // Reconnect manually
  const reconnect = useCallback(() => {
    setError(null);
    socketService.disconnect();
    const socket = socketService.connect();
    socketRef.current = socket;
  }, []);

  return {
    socket: socketRef.current,
    connected,
    error,
    connectionAttempts,
    emit,
    on,
    off,
    once,
    reconnect,
    isConnected: socketService.isConnected(),
    socketId: socketService.getSocketId()
  };
};

