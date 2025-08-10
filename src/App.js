// src/App.js - Updated main application component
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { AppDataProvider } from './context/AppContext';

// Layouts
import MainLayout from './Layouts/MainLayout';
import PublicLayout from './Layouts/PublicLayout';

// Pages
import EnhancedSuperAdminDashboard from './pages/dashboard/EnhancedSuperAdminDashboard';
import LeadsListPage from './pages/leads/LeadsListPage';
import LoginPage from './pages/auth/LoginPage';

// Error Boundary
import ErrorBoundary from './components/common/ErrorBoundary';

// Socket Service - Initialize early
import socketService from './services/socketService';

// Theme configuration for GreonXpert
const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Green theme for sustainability
      light: '#60ad5e',
      dark: '#005005',
    },
    secondary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    success: {
      main: '#4caf50',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider 
          maxSnack={3}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <AuthProvider>
            <AppDataProvider>
              <Router>
                <Routes>
                  {/* Public routes */}
                  <Route path="/login" element={
                    <PublicLayout>
                      <LoginPage />
                    </PublicLayout>
                  } />
                  
                  {/* Protected routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <MainLayout>
                        <EnhancedSuperAdminDashboard />
                      </MainLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/leads" element={
                    <ProtectedRoute>
                      <MainLayout>
                        <LeadsListPage />
                      </MainLayout>
                    </ProtectedRoute>
                  } />
                  
                  {/* Default redirect */}
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Router>
            </AppDataProvider>
          </AuthProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;



// .env.example - Environment variables template
/*
# Frontend Environment Variables
# Copy this file to .env and update the values

# API Configuration
REACT_APP_API_URL=http://localhost:7736
REACT_APP_SOCKET_URL=http://localhost:7736

# Environment
REACT_APP_ENV=development

# Feature Flags
REACT_APP_ENABLE_REAL_TIME=true
REACT_APP_ENABLE_ANALYTICS=false

# Debug
REACT_APP_DEBUG=true
*/

// package.json additions - Dependencies to add
/*
{
  "dependencies": {
    "socket.io-client": "^4.8.1",
    "notistack": "^3.0.1"
  }
}
*/

// Backend server.js enhancements for better real-time support
/*
// Add to your existing server.js

// Enhanced Socket.IO connection handling
io.use((socket, next) => {
  // Authentication middleware
  const token = socket.handshake.auth.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  } else {
    next(new Error('No token provided'));
  }
});

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}, User: ${socket.user?.name || 'Anonymous'}`);
    
    // Join user-specific room
    if (socket.user) {
        socket.join(`user_${socket.user.id}`);
        socket.join(`role_${socket.user.role}`);
    }
    
    // Dashboard stats request
    socket.on('request_dashboard_stats', async () => {
        try {
            const stats = await getDashboardStatsFromDB();
            socket.emit('dashboard_stats', stats);
        } catch (error) {
            socket.emit('dashboard_stats_error', error.message);
        }
    });
    
    // Recent leads request
    socket.on('request_recent_leads', async () => {
        try {
            const leads = await getRecentLeadsFromDB();
            socket.emit('recent_leads', leads);
        } catch (error) {
            socket.emit('recent_leads_error', error.message);
        }
    });
    
    // Live emissions request (ZeroCarbon specific)
    socket.on('request_live_emissions', async () => {
        try {
            const emissions = await getLiveEmissionsFromIoT();
            socket.emit('live_emissions', emissions);
        } catch (error) {
            socket.emit('live_emissions_error', error.message);
        }
    });
    
    // Handle disconnection
    socket.on('disconnect', (reason) => {
        console.log(`User disconnected: ${socket.id}, Reason: ${reason}`);
    });
});

// Function to broadcast updates to all connected clients
const broadcastStatsUpdate = (updatedStats) => {
    io.emit('stats_updated', updatedStats);
};

// Function to broadcast new lead creation
const broadcastNewLead = (newLead) => {
    io.emit('new_lead_created', newLead);
};

// Export for use in other modules
module.exports = { io, broadcastStatsUpdate, broadcastNewLead };
*/