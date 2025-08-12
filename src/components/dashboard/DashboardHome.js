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
  Fade,
  Slide,
  useTheme,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  People,
  Assessment,
  CheckCircle, // Changed Icon
  Cancel, // Changed Icon
  ArrowUpward,
  ArrowDownward,
  Add,
  Dashboard as DashboardIcon,
  Business,
  Speed,
  Star,
  Timeline,
  Analytics,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import { useAuth } from '../../contexts/AuthContext';
import { useGetDashboardStatsQuery } from '../../store/api/reportApi'; // Import the hook

// Animations & Styled Components (no changes here)
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 4px 20px rgba(99, 102, 241, 0.2); }
  50% { box-shadow: 0 8px 40px rgba(99, 102, 241, 0.4); }
`;

const WelcomeSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  borderRadius: 24,
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    right: '-20%',
    width: '300px',
    height: '300px',
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
    borderRadius: '50%',
  },
}));

const StatsCard = styled(Card)(({ theme, color }) => ({
  borderRadius: 20,
  background: `linear-gradient(135deg, ${color}10 0%, ${color}05 100%)`,
  border: `1px solid ${color}20`,
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: `0 20px 40px ${color}30`,
    animation: `${glow} 2s ease-in-out infinite`,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(90deg, ${color} 0%, ${color}80 100%)`,
  },
}));

const ActionCard = styled(Paper)(({ theme, gradient }) => ({
  padding: theme.spacing(3),
  borderRadius: 20,
  background: gradient,
  color: 'white',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-4px) scale(1.05)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.1)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover::before': {
    opacity: 1,
  },
}));

const FloatingIcon = styled(Avatar)(({ theme }) => ({
  width: 60,
  height: 60,
  animation: `${float} 3s ease-in-out infinite`,
  background: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
}));

const DashboardHome = ({ onGenerateReport }) => { // Receive prop to open modal
  const { user, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  // Fetch dashboard stats from the API
  const { data: statsData, error, isLoading } = useGetDashboardStatsQuery();

  const stats = [
    {
      title: 'Total Leads',
      value: statsData?.data?.totalLeads ?? '...',
      description: 'All-time leads created',
      icon: People,
      color: theme.palette.primary.main,
    },
    {
      title: 'New Leads (30 Days)',
      value: statsData?.data?.leadsLast30Days ?? '...',
      description: 'Leads created recently',
      icon: TrendingUp,
      color: theme.palette.info.main,
    },
    {
      title: 'Approved',
      value: statsData?.data?.statusCounts?.Approved ?? '...',
      description: 'Successfully converted leads',
      icon: CheckCircle,
      color: theme.palette.success.main,
    },
    {
      title: 'Rejected',
      value: statsData?.data?.statusCounts?.Rejected ?? '...',
      description: 'Leads that did not convert',
      icon: Cancel,
      color: theme.palette.error.main,
    },
  ];

  const quickActions = [
    {
      title: 'Create New Lead',
      description: 'Add a new potential customer',
      icon: <Add sx={{ fontSize: 28 }} />,
      gradient: theme.gradients?.primary || `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
      onClick: () => navigate('/dashboard/leads'),
    },
    {
      title: 'Generate Report',
      description: 'Create comprehensive analytics',
      icon: <Assessment sx={{ fontSize: 28 }} />,
      gradient: theme.gradients?.success || `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
      onClick: onGenerateReport, // Use the passed function
    },
    {
      title: 'View Analytics',
      description: 'Deep dive into performance',
      icon: <Analytics sx={{ fontSize: 28 }} />,
      gradient: theme.gradients?.info || `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
      onClick: () => console.log('View Analytics'),
    },
  ];

  if (isSuperAdmin()) {
    quickActions.unshift({
      title: 'Manage Admins',
      description: 'Create and manage admin users',
      icon: <Business sx={{ fontSize: 28 }} />,
      gradient: theme.gradients?.warning || `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
      onClick: () => navigate('/dashboard/admin-management', { state: { openDialog: true } }),
    });
  }

  return (
    <Box>
      {/* Enhanced Welcome Section (No data changes needed here) */}
    <Fade in={true} timeout={1000}>
        <WelcomeSection>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Grid container alignItems="center" spacing={3}>
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <FloatingIcon>
                    <DashboardIcon sx={{ fontSize: 28 }} />
                  </FloatingIcon>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                      Welcome back, {user?.name}! 🚀
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                      Your CRM dashboard is looking fantastic today
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<Star />}
                    label={user?.role}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontWeight: 600,
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                  />
                  <Chip
                    icon={<Timeline />}
                    label="Active Dashboard"
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontWeight: 600,
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ fontWeight: 800, opacity: 0.3, mb: 1 }}>
                  {new Date().getDate()}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.8 }}>
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long' 
                  })}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </WelcomeSection>
      </Fade>

      {/* Loading and Error States */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          Could not load dashboard statistics. Please try again later.
        </Alert>
      )}

      {/* Enhanced Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <Slide in={true} timeout={500 + index * 100} direction="up">
                <StatsCard color={stat.color}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Avatar
                        sx={{
                          backgroundColor: stat.color,
                          color: 'white',
                          width: 56,
                          height: 56,
                          boxShadow: `0 8px 20px ${stat.color}40`,
                        }}
                      >
                        <Icon sx={{ fontSize: 28 }} />
                      </Avatar>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 1 }}>
                      {isLoading ? <CircularProgress size={24} /> : stat.value}
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'text.primary', mb: 1, fontWeight: 600 }}>
                      {stat.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', opacity: 0.8 }}>
                      {stat.description}
                    </Typography>
                  </CardContent>
                </StatsCard>
              </Slide>
            </Grid>
          );
        })}
      </Grid>

      {/* Enhanced Content Grid */}
      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Fade in={true} timeout={1200}>
            <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Avatar sx={{ backgroundColor: 'primary.main', color: 'white' }}>
                    <DashboardIcon />
                  </Avatar>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    Quick Actions
                  </Typography>
                </Box>
                <Grid container spacing={3}>
                  {quickActions.map((action, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Slide in={true} timeout={800 + index * 200} direction="left">
                        <ActionCard
                          gradient={action.gradient}
                          onClick={action.onClick}
                          elevation={0}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white', width: 50, height: 50 }}>
                              {action.icon}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                {action.title}
                              </Typography>
                              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                {action.description}
                              </Typography>
                            </Box>
                          </Box>
                        </ActionCard>
                      </Slide>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardHome;