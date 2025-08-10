// src/services/socketService.js
import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.connectionCallbacks = [];
    this.disconnectionCallbacks = [];
    this.eventHandlers = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  /**
   * Initialize Socket.IO connection
   * @param {string} url - Socket server URL
   * @param {Object} options - Socket.IO options
   */
  connect(url = null, options = {}) {
    // Use environment variable or fallback to your backend port
    const socketUrl = url || process.env.REACT_APP_SOCKET_URL || 'http://localhost:7736';
    
    // If already connected, return existing socket
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return this.socket;
    }

    // Disconnect existing socket if any
    this.disconnect();

    console.log('🔄 Connecting to Socket.IO server:', socketUrl);

    // Default Socket.IO configuration
    const defaultOptions = {
      transports: ['websocket', 'polling'], // Try WebSocket first, fallback to polling
      timeout: 20000,
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      auth: {
        token: localStorage.getItem('authToken') // Send auth token if available
      }
    };

    // Merge default options with provided options
    const socketOptions = { ...defaultOptions, ...options };

    try {
      // Create Socket.IO connection
      this.socket = io(socketUrl, socketOptions);
      
      // Setup event handlers
      this.setupEventHandlers();
      
      return this.socket;
    } catch (error) {
      console.error('❌ Failed to create Socket.IO connection:', error);
      throw error;
    }
  }

  /**
   * Setup Socket.IO event handlers
   */
  setupEventHandlers() {
    if (!this.socket) return;

    // Connection successful
    this.socket.on('connect', () => {
      this.reconnectAttempts = 0;
      console.log('✅ Socket.IO Connected successfully!');
      console.log('📡 Socket ID:', this.socket.id);
      
      // Execute connection callbacks
      this.connectionCallbacks.forEach(callback => {
        try {
          callback(this.socket);
        } catch (error) {
          console.error('Error in connection callback:', error);
        }
      });
    });

    // Connection failed
    this.socket.on('connect_error', (error) => {
      this.reconnectAttempts++;
      console.error(`🔥 Socket.IO Connection Error (Attempt ${this.reconnectAttempts}):`, error.message);
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('❌ Max reconnection attempts reached. Giving up.');
      }
    });

    // Disconnection
    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket.IO Disconnected:', reason);
      
      // Execute disconnection callbacks
      this.disconnectionCallbacks.forEach(callback => {
        try {
          callback(reason);
        } catch (error) {
          console.error('Error in disconnection callback:', error);
        }
      });
    });

    // Reconnection successful
    this.socket.on('reconnect', (attemptNumber) => {
      this.reconnectAttempts = 0;
      console.log(`🔄 Socket.IO Reconnected successfully after ${attemptNumber} attempts`);
    });

    // Reconnection failed
    this.socket.on('reconnect_failed', () => {
      console.error('❌ Socket.IO Reconnection failed after maximum attempts');
    });

    // Reconnection attempt
    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`🔄 Socket.IO Reconnection attempt ${attemptNumber}...`);
    });
  }

  /**
   * Disconnect from Socket.IO server
   */
  disconnect() {
    if (this.socket) {
      console.log('🔌 Disconnecting from Socket.IO server...');
      this.socket.disconnect();
      this.socket = null;
      this.eventHandlers.clear();
    }
  }

  /**
   * Emit event to server
   * @param {string} event - Event name
   * @param {*} data - Data to send
   * @param {Function} callback - Optional callback
   */
  emit(event, data, callback) {
    if (this.socket?.connected) {
      if (callback) {
        this.socket.emit(event, data, callback);
      } else {
        this.socket.emit(event, data);
      }
      console.log(`📤 Emitted event: ${event}`, data);
    } else {
      console.warn('⚠️ Socket not connected. Cannot emit event:', event);
      if (callback) {
        callback({ error: 'Socket not connected' });
      }
    }
  }

  /**
   * Listen to server events
   * @param {string} event - Event name
   * @param {Function} callback - Event handler
   */
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
      this.eventHandlers.set(event, callback);
      console.log(`👂 Listening to event: ${event}`);
    } else {
      console.warn('⚠️ Socket not available. Cannot listen to event:', event);
    }
  }

  /**
   * Stop listening to server events
   * @param {string} event - Event name
   */
  off(event) {
    if (this.socket && this.eventHandlers.has(event)) {
      const handler = this.eventHandlers.get(event);
      this.socket.off(event, handler);
      this.eventHandlers.delete(event);
      console.log(`🔇 Stopped listening to event: ${event}`);
    }
  }

  /**
   * Listen to event once
   * @param {string} event - Event name
   * @param {Function} callback - Event handler
   */
  once(event, callback) {
    if (this.socket) {
      this.socket.once(event, callback);
      console.log(`👂 Listening once to event: ${event}`);
    }
  }

  /**
   * Register connection callback
   * @param {Function} callback - Callback to execute on connection
   */
  onConnection(callback) {
    this.connectionCallbacks.push(callback);
  }

  /**
   * Register disconnection callback
   * @param {Function} callback - Callback to execute on disconnection
   */
  onDisconnection(callback) {
    this.disconnectionCallbacks.push(callback);
  }

  /**
   * Check if socket is connected
   * @returns {boolean}
   */
  isConnected() {
    return this.socket?.connected || false;
  }

  /**
   * Get socket ID
   * @returns {string|null}
   */
  getSocketId() {
    return this.socket?.id || null;
  }

  /**
   * Join a room
   * @param {string} room - Room name
   */
  joinRoom(room) {
    this.emit('join_room', { room });
  }

  /**
   * Leave a room
   * @param {string} room - Room name
   */
  leaveRoom(room) {
    this.emit('leave_room', { room });
  }

  /**
   * Send real-time emission data (ZeroCarbon specific)
   * @param {Object} emissionData - Emission data
   */
  sendEmissionData(emissionData) {
    this.emit('emission_data', emissionData);
  }

  /**
   * Request live dashboard stats (ZeroCarbon specific)
   */
  requestDashboardStats() {
    this.emit('request_dashboard_stats');
  }

  /**
   * Send BRSR form update (ESGLink specific)
   * @param {Object} formData - Form data
   */
  sendBRSRUpdate(formData) {
    this.emit('brsr_form_update', formData);
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;