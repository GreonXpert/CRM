// /src/components/layout/Sidebar.js
import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useTheme, styled } from '@mui/material';

// Import Icons
import { Dashboard, People, AddCard, Assessment, School } from '@mui/icons-material';

// A placeholder for the auth context hook to get the user's role
const useAuth = () => ({
  user: { role: 'SUPER ADMIN' }, // Can be 'ADMIN' or 'SUPER ADMIN' for testing
});

const drawerWidth = 260;

// --- Styled Components ---
const StyledNavLink = styled(RouterNavLink)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  display: 'block',
  '&.active': {
    color: theme.palette.primary.main,
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    },
    '& .MuiListItemButton-root': {
      backgroundColor: `${theme.palette.primary.main}20`, // Light blue background for active link
      borderRight: `3px solid ${theme.palette.primary.main}`,
    },
  },
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    boxSizing: 'border-box',
    width: drawerWidth,
    borderRight: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    // Futuristic subtle background pattern
    backgroundImage: 'radial-gradient(#00000011 1px, transparent 1px)',
    backgroundSize: '15px 15px',
  },
}));

// --- Navigation Items ---
const adminNavItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Add Lead', icon: <AddCard />, path: '/leads/add' },
  { text: 'Manage Leads', icon: <Assessment />, path: '/leads/manage' },
  { text: 'Training Centre', icon: <School />, path: '/training' },
];

const superAdminNavItems = [
  ...adminNavItems,
  { text: 'Manage Users', icon: <People />, path: '/users/manage' },
];

/**
 * An attractive, futuristic, and responsive sidebar component.
 * @param {boolean} mobileOpen - State to control the mobile drawer.
 * @param {func} onDrawerToggle - Function to toggle the mobile drawer.
 */
const Sidebar = ({ mobileOpen, onDrawerToggle }) => {
  const theme = useTheme();
  const { user } = useAuth();

  const navItems = user?.role === 'SUPER ADMIN' ? superAdminNavItems : adminNavItems;

  const drawerContent = (
    <div>
      {/* Placeholder for Logo or Top Section */}
      <Box sx={{ p: 2, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* You can place a logo here */}
      </Box>
      <List sx={{ p: 0 }}>
        {navItems.map((item) => (
          <StyledNavLink to={item.path} key={item.text}>
            <ListItem disablePadding>
              <ListItemButton sx={{
                py: 1.5,
                px: 3,
                transition: 'background-color 0.2s ease-in-out',
                '&:hover': {
                    backgroundColor: `${theme.palette.primary.main}10`,
                }
              }}>
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          </StyledNavLink>
        ))}
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      {/* Mobile Drawer (Temporary) */}
      <StyledDrawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
        }}
      >
        {drawerContent}
      </StyledDrawer>

      {/* Desktop Drawer (Permanent) */}
      <StyledDrawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
        }}
        open
      >
        {drawerContent}
      </StyledDrawer>
    </Box>
  );
};

export default Sidebar;
