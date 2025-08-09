// /src/assets/styles/theme.js
import { createTheme } from '@mui/material/styles';

// Define your color palette
const colors = {
  primary: {
    main: '#1976D2', // A professional blue
    light: '#63A4FF',
    dark: '#004BA0',
  },
  secondary: {
    main: '#FFC107', // A vibrant accent yellow
    light: '#FFF350',
    dark: '#C79100',
  },
  background: {
    default: '#F4F6F8', // A very light grey for the main background
    paper: '#FFFFFF',   // White for cards, modals, etc.
  },
  text: {
    primary: '#212121', // Dark grey for main text
    secondary: '#757575', // Lighter grey for secondary text
  },
  success: {
    main: '#4CAF50',
  },
  error: {
    main: '#F44336',
  },
};

// Create the Material-UI theme
const theme = createTheme({
  palette: {
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.background,
    text: colors.text,
    success: colors.success,
    error: colors.error,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: colors.text.primary,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      color: colors.text.primary,
    },
    h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
        color: colors.text.primary,
    },
    body1: {
      fontSize: '1rem',
      color: colors.text.primary,
    },
    body2: {
      fontSize: '0.875rem',
      color: colors.text.secondary,
    },
  },
  shape: {
    borderRadius: 8, // Slightly rounded corners for a modern look
  },
  components: {
    // Override default styles for specific components
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Buttons will use normal case, not uppercase
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
          borderRadius: 12,
        },
      },
    },
    MuiAppBar: {
        styleOverrides: {
            root: {
                backgroundColor: colors.background.paper,
                boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.06)',
                color: colors.text.primary,
            }
        }
    }
  },
});

export default theme;
