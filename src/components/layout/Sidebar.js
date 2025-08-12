// src/components/layout/Sidebar.js
import React, { useState } from 'react';
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
  Avatar,
  Collapse,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
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
  ChevronRight,
  Star,
  Brightness4,
  Notifications,
  PowerSettingsNew,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import { useAuth } from '../../contexts/AuthContext';

// Animations
const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-3px); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.3); }
  50% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.6), 0 0 30px rgba(99, 102, 241, 0.4); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Styled Components
const SidebarContainer = styled(Box)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(135deg, ${theme.palette.primary.main}05 0%, ${theme.palette.secondary.main}05 100%)`,
    pointerEvents: 'none',
  },
}));

const LogoSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.grey[200]}`,
  background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.secondary.main}08 100%)`,
  position: 'relative',
  zIndex: 1,
}));

const LogoIcon = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1.5),
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  borderRadius: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  animation: `${float} 3s ease-in-out infinite`,
  boxShadow: `0 8px 25px ${theme.palette.primary.main}40`,
  '&:hover': {
    animation: `${glow} 2s ease-in-out infinite`,
  },
}));

const UserInfoCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  margin: theme.spacing(2),
  background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.secondary.main}08 100%)`,
  border: `1px solid ${theme.palette.primary.main}20`,
  borderRadius: 16,
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 25px ${theme.palette.primary.main}20`,
    background: `linear-gradient(135deg, ${theme.palette.primary.main}12 0%, ${theme.palette.secondary.main}12 100%)`,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
    transition: 'left 0.5s',
  },
  '&:hover::before': {
    left: '100%',
  },
}));

const MenuItemButton = styled(ListItemButton)(({ theme, isActive }) => ({
  margin: theme.spacing(0.5, 1),
  borderRadius: 12,
  padding: theme.spacing(1.5, 2),
  backgroundColor: isActive 
    ? `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`
    : 'transparent',
  color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
  border: isActive ? `1px solid ${theme.palette.primary.main}30` : '1px solid transparent',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  animation: `${slideIn} 0.5s ease-out`,
  '&:hover': {
    backgroundColor: isActive 
      ? `linear-gradient(135deg, ${theme.palette.primary.main}20 0%, ${theme.palette.secondary.main}20 100%)`
      : `linear-gradient(135deg, ${theme.palette.primary.main}10 0%, ${theme.palette.secondary.main}10 100%)`,
    color: theme.palette.primary.main,
    transform: 'translateX(8px)',
    boxShadow: `0 4px 15px ${theme.palette.primary.main}20`,
    border: `1px solid ${theme.palette.primary.main}40`,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: isActive ? '4px' : '0px',
    height: '60%',
    background: `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    borderRadius: '0 4px 4px 0',
    transition: 'width 0.3s ease',
  },
  '&:hover::before': {
    width: '4px',
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(0, 3, 1, 3),
  fontSize: '0.75rem',
  fontWeight: 700,
  color: theme.palette.text.secondary,
  letterSpacing: 1.5,
  textTransform: 'uppercase',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  position: 'relative',
  '&::after': {
    content: '""',
    flex: 1,
    height: '1px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}40 0%, transparent 100%)`,
  },
}));

const StatusIndicator = styled(Box)(({ theme, isOnline }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: isOnline ? theme.palette.success.main : theme.palette.grey[400],
  animation: isOnline ? `${pulse} 2s ease-in-out infinite` : 'none',
  boxShadow: isOnline ? `0 0 10px ${theme.palette.success.main}60` : 'none',
}));

const QuickActionButton = styled(IconButton)(({ theme }) => ({
  width: 36,
  height: 36,
  backgroundColor: `${theme.palette.grey[100]}`,
  color: theme.palette.text.secondary,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    transform: 'scale(1.1)',
    boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
  },
}));

const Sidebar = ({ onMobileClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, isSuperAdmin, isAdmin } = useAuth();
  
  const [expandedSections, setExpandedSections] = useState({
    main: true,
    settings: true,
  });

  const handleNavigation = (path) => {
    navigate(path);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: Dashboard,
      path: '/dashboard',
      roles: ['SUPER ADMIN', 'ADMIN'],
      color: theme.palette.primary.main,
    },
    {
      title: 'Admin Management',
      icon: AdminPanelSettings,
      path: '/dashboard/admin-management',
      roles: ['SUPER ADMIN'],
      badge: 'Super Admin',
      color: theme.palette.error.main,
    },
    {
      title: 'Lead Management',
      icon: People,
      path: '/dashboard/leads',
      roles: ['SUPER ADMIN', 'ADMIN'],
      color: theme.palette.secondary.main,
    },
    {
      title: 'Reports',
      icon: Assessment,
      path: '/dashboard/reports',
      roles: ['SUPER ADMIN', 'ADMIN'],
      color: theme.palette.success.main,
    },
    {
      title: 'Analytics',
      icon: BarChart,
      path: '/dashboard/analytics',
      roles: ['SUPER ADMIN', 'ADMIN'],
      color: theme.palette.warning.main,
    },
  ];

  const settingsItems = [
    {
      title: 'Account Settings',
      icon: Settings,
      path: '/dashboard/settings',
      roles: ['SUPER ADMIN', 'ADMIN'],
      color: theme.palette.info.main,
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

  const renderMenuItems = (items, animationDelay = 0) => {
    return items
      .filter(item => hasAccess(item.roles))
      .map((item, index) => {
        const isActive = isActiveRoute(item.path);
        const Icon = item.icon;

        return (
          <ListItem 
            key={item.title} 
            disablePadding 
            sx={{ 
              mb: 0.5,
              opacity: 0,
              animation: `${slideIn} 0.5s ease-out ${(animationDelay + index) * 0.1}s forwards`,
            }}
          >
            <MenuItemButton
              onClick={() => handleNavigation(item.path)}
              isActive={isActive}
            >
              <ListItemIcon
                sx={{
                  color: 'inherit',
                  minWidth: 40,
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon 
                  sx={{ 
                    fontSize: 20,
                    color: isActive ? item.color : 'inherit',
                  }} 
                />
              </ListItemIcon>
              <ListItemText
                primary={item.title}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  transition: 'all 0.2s ease',
                }}
              />
              {item.badge && (
                <Chip
                  label={item.badge}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.6rem',
                    fontWeight: 600,
                    background: `linear-gradient(135deg, ${item.color}20 0%, ${item.color}10 100%)`,
                    color: item.color,
                    border: `1px solid ${item.color}30`,
                    animation: `${pulse} 3s ease-in-out infinite`,
                  }}
                />
              )}
              {isActive && (
                <ChevronRight 
                  sx={{ 
                    fontSize: 16, 
                    opacity: 0.7,
                    animation: `${float} 2s ease-in-out infinite`,
                  }} 
                />
              )}
            </MenuItemButton>
          </ListItem>
        );
      });
  };

  return (
    <SidebarContainer>
      {/* Enhanced Logo Section */}
      <LogoSection>
        <LogoIcon elevation={0}>
          <BusinessCenter sx={{ color: 'white', fontSize: 28 }} />
        </LogoIcon>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: 'text.primary',
              lineHeight: 1.2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            EBS Cards
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontWeight: 600,
              letterSpacing: 0.5,
            }}
          >
            CRM Platform
          </Typography>
        </Box>
        {isMobile && (
          <IconButton 
            onClick={onMobileClose}
            sx={{ 
              color: 'text.secondary',
              '&:hover': { 
                backgroundColor: 'primary.main',
                color: 'white',
              }
            }}
          >
            <MenuIcon />
          </IconButton>
        )}
      </LogoSection>

      {/* Enhanced User Info */}
      <UserInfoCard elevation={0}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar
            sx={{
              width: 45,
              height: 45,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              color: 'white',
              fontWeight: 700,
              fontSize: '1.1rem',
              boxShadow: `0 4px 15px ${theme.palette.primary.main}40`,
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  fontSize: '0.9rem',
                }}
              >
                {user?.name}
              </Typography>
              <StatusIndicator isOnline={true} />
            </Box>
            <Chip
              icon={<Star sx={{ fontSize: 12 }} />}
              label={user?.role}
              size="small"
              sx={{
                height: 22,
                fontSize: '0.7rem',
                fontWeight: 600,
                background: isSuperAdmin() 
                  ? `linear-gradient(135deg, ${theme.palette.error.main}20 0%, ${theme.palette.error.main}10 100%)`
                  : `linear-gradient(135deg, ${theme.palette.primary.main}20 0%, ${theme.palette.primary.main}10 100%)`,
                color: isSuperAdmin() ? theme.palette.error.main : theme.palette.primary.main,
                border: `1px solid ${isSuperAdmin() ? theme.palette.error.main : theme.palette.primary.main}30`,
              }}
            />
          </Box>
        </Box>
        
        {/* Quick Actions */}
        
      </UserInfoCard>

      {/* Enhanced Navigation */}
      <Box sx={{ flexGrow: 1, py: 1, position: 'relative', zIndex: 1 }}>
        {/* Main Navigation */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            '&:hover': {
              '& .section-icon': {
                transform: 'rotate(180deg)',
              }
            }
          }}
          onClick={() => toggleSection('main')}
        >
          <SectionTitle>
            <Dashboard sx={{ fontSize: 16 }} />
            Main Navigation
            <ChevronRight 
              className="section-icon"
              sx={{ 
                fontSize: 16,
                transform: expandedSections.main ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
              }} 
            />
          </SectionTitle>
        </Box>
        
        <Collapse in={expandedSections.main} timeout={300}>
          <List disablePadding sx={{ px: 0.5 }}>
            {renderMenuItems(menuItems, 0)}
          </List>
        </Collapse>

        <Divider 
          sx={{ 
            mx: 3, 
            my: 3,
            background: `linear-gradient(90deg, transparent 0%, ${theme.palette.primary.main}40 50%, transparent 100%)`,
            height: 1,
          }} 
        />

        {/* Settings */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            '&:hover': {
              '& .section-icon': {
                transform: 'rotate(180deg)',
              }
            }
          }}
          onClick={() => toggleSection('settings')}
        >
          <SectionTitle>
            <Settings sx={{ fontSize: 16 }} />
            Settings
            <ChevronRight 
              className="section-icon"
              sx={{ 
                fontSize: 16,
                transform: expandedSections.settings ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
              }} 
            />
          </SectionTitle>
        </Box>
        
        <Collapse in={expandedSections.settings} timeout={300}>
          <List disablePadding sx={{ px: 0.5 }}>
            {renderMenuItems(settingsItems, 5)}
          </List>
        </Collapse>
      </Box>

      {/* Enhanced Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${theme.palette.grey[200]}`,
          background: `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.background.paper} 100%)`,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            textAlign: 'center',
            p: 2,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}05 0%, ${theme.palette.secondary.main}05 100%)`,
            border: `1px solid ${theme.palette.primary.main}10`,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              display: 'block',
              fontWeight: 600,
              mb: 0.5,
            }}
          >
            © 2025 EBS Cards
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              display: 'block',
              fontSize: '0.7rem',
            }}
          >
            Version 1.0.0 • All rights reserved
          </Typography>
        </Box>
      </Box>
    </SidebarContainer>
  );
};

export default Sidebar;
