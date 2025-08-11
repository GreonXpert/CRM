// src/components/dashboard/DashboardHome.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Paper,
  Chip,
  LinearProgress,
  IconButton,
  alpha,
} from '@mui/material';
import {
  TrendingUp,
  People,
  Assessment,
  AttachMoney,
  ArrowUpward,
  ArrowDownward,
  MoreVert,
  Notifications,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const DashboardHome = () => {
  const { user, isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Total Leads',
      value: '1,234',
      change: '+12%',
      trend: 'up',
      icon: People,
      color: '#6366f1',
      bgColor: alpha('#6366f1', 0.1),
    },
    {
      title: 'Conversions',
      value: '456',
      change: '+8%',
      trend: 'up',
      icon: TrendingUp,
      color: '#10b981',
      bgColor: alpha('#10b981', 0.1),
    },
    {
      title: 'Revenue',
      value: '$12,345',
      change: '+15%',
      trend: 'up',
      icon: AttachMoney,
      color: '#f59e0b',
      bgColor: alpha('#f59e0b', 0.1),
    },
    {
      title: 'Reports',
      value: '89',
      change: '-3%',
      trend: 'down',
      icon: Assessment,
      color: '#ef4444',
      bgColor: alpha('#ef4444', 0.1),
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'New lead created',
      user: 'John Doe',
      time: '2 minutes ago',
      type: 'lead',
    },
    {
      id: 2,
      action: 'Report generated',
      user: 'Sarah Wilson',
      time: '15 minutes ago',
      type: 'report',
    },
    {
      id: 3,
      action: 'Lead status updated',
      user: 'Mike Johnson',
      time: '1 hour ago',
      type: 'update',
    },
    {
      id: 4,
      action: 'New admin created',
      user: 'Super Admin',
      time: '2 hours ago',
      type: 'admin',
    },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'lead':
        return <People sx={{ fontSize: 16 }} />;
      case 'report':
        return <Assessment sx={{ fontSize: 16 }} />;
      case 'update':
        return <TrendingUp sx={{ fontSize: 16 }} />;
      case 'admin':
        return <Notifications sx={{ fontSize: 16 }} />;
      default:
        return <Notifications sx={{ fontSize: 16 }} />;
    }
  };

  const handleCreateAdminClick = () => {
    navigate('/dashboard/admin-management', { state: { openDialog: true } });
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            mb: 1,
          }}
        >
          Welcome back, {user?.name}! 👋
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            mb: 2,
          }}
        >
          Here's what's happening with your CRM today.
        </Typography>
        <Chip
          label={user?.role}
          color={isSuperAdmin() ? 'error' : 'primary'}
          sx={{
            fontWeight: 600,
            px: 1,
          }}
        />
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? ArrowUpward : ArrowDownward;
          
          return (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  position: 'relative',
                  overflow: 'visible',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 20px -4px rgba(0, 0, 0, 0.15)',
                  },
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 2,
                    }}
                  >
                    <Avatar
                      sx={{
                        backgroundColor: stat.bgColor,
                        color: stat.color,
                        width: 48,
                        height: 48,
                      }}
                    >
                      <Icon />
                    </Avatar>
                    <IconButton size="small">
                      <MoreVert />
                    </IconButton>
                  </Box>
                  
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: 'text.primary',
                      mb: 1,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      mb: 2,
                    }}
                  >
                    {stat.title}
                  </Typography>
                  
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Chip
                      icon={<TrendIcon sx={{ fontSize: 14 }} />}
                      label={stat.change}
                      size="small"
                      color={stat.trend === 'up' ? 'success' : 'error'}
                      sx={{
                        height: 24,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.secondary' }}
                    >
                      vs last month
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Content Grid */}
      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  mb: 3,
                }}
              >
                Quick Actions
              </Typography>
              
              <Grid container spacing={2}>
                {isSuperAdmin() && (
                  <Grid item xs={12} md={6}>
                    <Paper
                      onClick={handleCreateAdminClick}
                      sx={{
                        p: 3,
                        backgroundColor: alpha('#6366f1', 0.05),
                        border: `1px solid ${alpha('#6366f1', 0.1)}`,
                        borderRadius: 2,
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: alpha('#6366f1', 0.1),
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.2s ease-in-out',
                        height: '100%',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          sx={{
                            backgroundColor: 'primary.main',
                            color: 'white',
                          }}
                        >
                          <People />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            Create Admin
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Add new admin user
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                )}
                
                <Grid item xs={12} md={isSuperAdmin() ? 6 : 12}>
                  <Paper
                    sx={{
                      p: 3,
                      backgroundColor: alpha('#10b981', 0.05),
                      border: `1px solid ${alpha('#10b981', 0.1)}`,
                      borderRadius: 2,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: alpha('#10b981', 0.1),
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.2s ease-in-out',
                      height: '100%',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          backgroundColor: 'success.main',
                          color: 'white',
                        }}
                      >
                        <Assessment />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          Generate Report
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Create performance report
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  mb: 3,
                }}
              >
                Recent Activities
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {recentActivities.map((activity) => (
                  <Box
                    key={activity.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 2,
                      backgroundColor: 'grey.50',
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: 'grey.100',
                      },
                      transition: 'background-color 0.2s ease-in-out',
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: 'primary.light',
                        color: 'primary.main',
                      }}
                    >
                      {getActivityIcon(activity.type)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: 'text.primary',
                          mb: 0.5,
                        }}
                      >
                        {activity.action}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: 'text.secondary' }}
                      >
                        by {activity.user} • {activity.time}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardHome;
