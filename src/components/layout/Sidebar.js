// src/components/layout/Sidebar.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Paper,
  Chip,
  alpha,
} from '@mui/material';
import {
  Dashboard,
  People,
  Assessment,
  Settings,
  BusinessCenter,
  AdminPanelSettings,
  BarChart,
  AccountTree,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ onMobileClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isSuperAdmin, isAdmin } = useAuth();

  const handleNavigation = (path) => {
    navigate(path);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: Dashboard,
      path: '/dashboard',
      roles: ['SUPER ADMIN', 'ADMIN'],
    },
    {
      title: 'Admin Management',
      icon: AdminPanelSettings,
      path: '/dashboard/admin-management',
      roles: ['SUPER ADMIN'],
      badge: 'Super Admin Only',
    },
    {
      title: 'Lead Management',
      icon: People,
      path: '/dashboard/leads',
      roles: ['SUPER ADMIN', 'ADMIN'],
    },
    {
      title: 'Reports',
      icon: Assessment,
      path: '/dashboard/reports',
      roles: ['SUPER ADMIN', 'ADMIN'],
    },
    {
      title: 'Analytics',
      icon: BarChart,
      path: '/dashboard/analytics',
      roles: ['SUPER ADMIN', 'ADMIN'],
    },
  ];

  const settingsItems = [
    {
      title: 'Account Settings',
      icon: Settings,
      path: '/dashboard/settings',
      roles: ['SUPER ADMIN', 'ADMIN'],
    },
  ];

  const isActiveRoute = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/dashboard/';
    }
    return location.pathname.startsWith(path);
  };

  const hasAccess = (roles) => {
    return roles.includes(user?.role);
  };

  const renderMenuItems = (items) => {
    return items
      .filter(item => hasAccess(item.roles))
      .map((item) => {
        const isActive = isActiveRoute(item.path);
        const Icon = item.icon;

        return (
          <ListItem key={item.title} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              sx={{
                mx: 1,
                borderRadius: 2,
                py: 1.5,
                backgroundColor: isActive 
                  ? alpha('#6366f1', 0.12)
                  : 'transparent',
                color: isActive ? 'primary.main' : 'text.secondary',
                '&:hover': {
                  backgroundColor: isActive 
                    ? alpha('#6366f1', 0.16)
                    : alpha('#6366f1', 0.08),
                  color: 'primary.main',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <ListItemIcon
                sx={{
                  color: 'inherit',
                  minWidth: 40,
                }}
              >
                <Icon />
              </ListItemIcon>
              <ListItemText
                primary={item.title}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                }}
              />
              {item.badge && (
                <Chip
                  label={item.badge}
                  size="small"
                  color="secondary"
                  sx={{
                    height: 20,
                    fontSize: '0.6rem',
                    fontWeight: 500,
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        );
      });
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.paper',
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          borderBottom: '1px solid',
          borderColor: 'grey.200',
        }}
      >
        <Paper
          sx={{
            p: 1.5,
            backgroundColor: 'primary.main',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <BusinessCenter sx={{ color: 'white', fontSize: 24 }} />
        </Paper>
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              lineHeight: 1.2,
            }}
          >
            EBS Cards
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
            }}
          >
            CRM Platform
          </Typography>
        </Box>
      </Box>

      {/* User Info */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'grey.200' }}>
        <Paper
          sx={{
            p: 2,
            backgroundColor: alpha('#6366f1', 0.05),
            border: `1px solid ${alpha('#6366f1', 0.1)}`,
            borderRadius: 2,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              mb: 0.5,
            }}
          >
            {user?.name}
          </Typography>
          <Chip
            label={user?.role}
            size="small"
            color={isSuperAdmin() ? 'error' : 'primary'}
            sx={{
              height: 22,
              fontSize: '0.75rem',
              fontWeight: 500,
            }}
          />
        </Paper>
      </Box>

      {/* Navigation */}
      <Box sx={{ flexGrow: 1, py: 2 }}>
        <Typography
          variant="overline"
          sx={{
            px: 3,
            mb: 1,
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'text.secondary',
            letterSpacing: 1,
          }}
        >
          Main Navigation
        </Typography>
        <List disablePadding>
          {renderMenuItems(menuItems)}
        </List>

        <Divider sx={{ mx: 2, my: 2 }} />

        <Typography
          variant="overline"
          sx={{
            px: 3,
            mb: 1,
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'text.secondary',
            letterSpacing: 1,
          }}
        >
          Settings
        </Typography>
        <List disablePadding>
          {renderMenuItems(settingsItems)}
        </List>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: 'grey.200',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            display: 'block',
            textAlign: 'center',
          }}
        >
          © 2025 GreonXpert
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            display: 'block',
            textAlign: 'center',
            mt: 0.5,
          }}
        >
          Version 1.0.0
        </Typography>
      </Box>
    </Box>
  );
};

export default Sidebar;
