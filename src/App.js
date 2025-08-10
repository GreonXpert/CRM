// src/App.js - Fixed Main Entry Point
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Global } from '@emotion/react';

// Import theme and global styles
import theme from './assets/styles/theme';
import globalStyles from './assets/styles/globalStyles';

// Import Context Providers
import { AuthProvider } from './context/AuthContext';
import { AppDataProvider } from './context/AppContext';
import  NotificationProvider  from './components/common/NotificationProvider';

// Import Router
import AppRouter from './routes/AppRouter';

// ==============================================
// ERROR BOUNDARY COMPONENT
// ==============================================
class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h1>Something went wrong</h1>
          <p>We're sorry, but something unexpected happened.</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              margin: '10px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: '#1976d2',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
          {process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: '20px', textAlign: 'left' }}>
              <summary>Error Details (Development Only)</summary>
              <pre style={{
                backgroundColor: '#f5f5f5',
                padding: '10px',
                borderRadius: '4px',
                overflow: 'auto',
                maxWidth: '80vw'
              }}>
                {this.state.error?.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

// ==============================================
// MAIN APP COMPONENT
// ==============================================
function App() {
  return (
    <AppErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Global styles={globalStyles} />
        <BrowserRouter>
          {/* Context Providers - Order matters */}
          <AuthProvider>
            <AppDataProvider>
              <NotificationProvider>
                <AppRouter />
              </NotificationProvider>
            </AppDataProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </AppErrorBoundary>
  );
}

export default App;