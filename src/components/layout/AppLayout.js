// /src/components/layout/AppLayout.js
import React, { useState } from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

const drawerWidth = 260; // This should match the width set in Sidebar.js

/**
 * The main layout for all authenticated pages.
 * It combines the Sidebar, Navbar, and Footer and renders the page content.
 * @param {node} children - The page component to be rendered inside the layout.
 */
const AppLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileOpen}
        onDrawerToggle={handleDrawerToggle}
      />
      
      {/* Main Content Area */}
      <Box 
        component="main" 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          flexGrow: 1, 
          width: { md: `calc(100% - ${drawerWidth}px)` } 
        }}
      >
        {/* Top Navigation Bar */}
        <Navbar onDrawerToggle={handleDrawerToggle} />
        
        {/* Page Content */}
        <Box 
          sx={{ 
            p: { xs: 2, sm: 3 }, 
            flexGrow: 1 
          }}
        >
          {children}
        </Box>
        
        {/* Footer */}
        <Footer />
      </Box>
    </Box>
  );
};

export default AppLayout;
