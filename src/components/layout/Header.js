// src/components/layout/Header.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Settings,
  Logout,
  NotificationsNone,
  Badge,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { logout } from '../../store/slices/authSlice';

const Header = ({ onDrawerToggle }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, isSuperAdmin } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    handleMenuClose();
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'SUPER ADMIN':
        return 'error';
      case 'ADMIN':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase() || 'U';
  };

  return (
    <Toolbar
      sx={{
        px: { xs: 2, sm: 3 },
        minHeight: 70,
        backgroundColor: 'transparent',
      }}
    >
      {/* Mobile Menu Button */}
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={onDrawerToggle}
        sx={{
          mr: 2,
          display: { md: 'none' },
          color: 'text.primary',
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* Title */}
      <Typography
        variant="h6"
        noWrap
        component="div"
        sx={{
          flexGrow: 1,
          color: 'text.primary',
          fontWeight: 600,
        }}
      >
        CRM Dashboard
      </Typography>

      {/* Right Side Items */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* Notifications */}
        <Tooltip title="Notifications">
          <IconButton
            size="large"
            sx={{
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <Badge badgeContent={3} color="error">
              <NotificationsNone />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* User Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 1 }}>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography
              variant="body2"
              sx={{
                color: 'text.primary',
                fontWeight: 500,
                textAlign: 'right',
              }}
            >
              {user?.name}
            </Typography>
            <Chip
              label={user?.role}
              size="small"
              color={getRoleColor(user?.role)}
              sx={{
                height: 20,
                fontSize: '0.75rem',
                fontWeight: 500,
              }}
            />
          </Box>

          <Tooltip title="Account settings">
            <IconButton
              onClick={handleProfileMenuOpen}
              size="small"
              sx={{
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: 'primary.main',
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
              >
                {getInitials(user?.name)}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              minWidth: 220,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {user?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
            <Chip
              label={user?.role}
              size="small"
              color={getRoleColor(user?.role)}
              sx={{ mt: 1, height: 20, fontSize: '0.75rem' }}
            />
          </Box>
          
          <Divider />
          
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <AccountCircle fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>
          
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
          
          <Divider />
          
          <MenuItem 
            onClick={handleLogout}
            sx={{
              color: 'error.main',
              '&:hover': {
                backgroundColor: 'error.light',
                color: 'error.contrastText',
              },
            }}
          >
            <ListItemIcon>
              <Logout fontSize="small" sx={{ color: 'inherit' }} />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Box>
    </Toolbar>
  );
};

export default Header;