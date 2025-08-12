// src/pages/AnalyticsPage.js
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  useTheme, 
  Fade, 
  Slide,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Tooltip,
  Chip,
  Button,
  Grid,
} from '@mui/material';
import { 
  BarChart, 
  PieChart, 
  Timeline, 
  Group,
  Refresh,
  Download,
  FilterList,
  DateRange,
  TrendingUp,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';

// Import the enhanced chart components
import LeadStatusPieChart from '../components/analytics/LeadStatusPieChart';
import LeadsOverTimeLineChart from '../components/analytics/LeadsOverTimeLineChart';
import UserPerformanceBarChart from '../components/analytics/UserPerformanceBarChart';

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3); }
  50% { box-shadow: 0 8px 40px rgba(99, 102, 241, 0.6); }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

// Styled Components
const HeaderSection = styled(Box)(({ theme }) => ({
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
    animation: `${float} 6s ease-in-out infinite`,
  },
}));

const FloatingAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  animation: `${float} 4s ease-in-out infinite`,
  background: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  border: '2px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
}));

const ChartCard = styled(Card)(({ theme }) => ({
  borderRadius: 20,
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
  border: `1px solid ${theme.palette.grey[100]}`,
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(99, 102, 241, 0.15)',
    animation: `${glow} 2s ease-in-out infinite`,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    transition: 'left 0.5s',
  },
  '&:hover::before': {
    left: '100%',
  },
}));

const ChartHeader = styled(Box)(({ theme, gradient }) => ({
  padding: theme.spacing(3),
  background: gradient,
  color: 'white',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'rgba(255, 255, 255, 0.2)',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  background: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  color: 'white',
  fontWeight: 600,
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.3)',
    transform: 'scale(1.05)',
  },
}));

const StatChip = styled(Chip)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  color: 'white',
  fontWeight: 600,
  border: '1px solid rgba(255, 255, 255, 0.3)',
  backdropFilter: 'blur(10px)',
}));

const ChartsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(4),
  width: '100%',
}));

const ChartWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const AnalyticsPage = () => {
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => setRefreshing(false), 1000);
  };

  const chartConfigs = [
    {
      title: 'Lead Status Distribution',
      description: 'Overview of lead statuses in your pipeline',
      icon: PieChart,
      component: LeadStatusPieChart,
      gradient: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    },
    {
      title: 'User Performance Analysis',
      description: 'Compare team member performance metrics',
      icon: Group,
      component: UserPerformanceBarChart,
      gradient: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
    },
    {
      title: 'Lead Generation Timeline',
      description: 'Track lead creation trends over the last 30 days',
      icon: Timeline,
      component: LeadsOverTimeLineChart,
      gradient: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
    },
  ];

  return (
    <Box>
      {/* Enhanced Header */}
      <Fade in={true} timeout={800}>
        <HeaderSection>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Grid container alignItems="center" spacing={3}>
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                  <FloatingAvatar>
                    <AnalyticsIcon sx={{ fontSize: 40 }} />
                  </FloatingAvatar>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                      Analytics Dashboard 📊
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                      Visualize your CRM data to gain insights and track performance
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <StatChip
                    icon={<TrendingUp />}
                    label="Real-time Analytics"
                  />
                  <StatChip
                    icon={<DateRange />}
                    label="Last 30 Days"
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Tooltip title="Refresh Data">
                    <ActionButton
                      startIcon={refreshing ? <Refresh className="spinning" /> : <Refresh />}
                      onClick={handleRefresh}
                      disabled={refreshing}
                      sx={{
                        '& .spinning': {
                          animation: 'spin 1s linear infinite',
                        },
                        '@keyframes spin': {
                          '0%': {
                            transform: 'rotate(0deg)',
                          },
                          '100%': {
                            transform: 'rotate(360deg)',
                          },
                        },
                      }}
                    >
                      {refreshing ? 'Refreshing...' : 'Refresh'}
                    </ActionButton>
                  </Tooltip>
                  <Tooltip title="Export Data">
                    <ActionButton
                      startIcon={<Download />}
                    >
                      Export
                    </ActionButton>
                  </Tooltip>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </HeaderSection>
      </Fade>

      {/* Enhanced Charts - Flex Column Layout */}
      <ChartsContainer>
        {chartConfigs.map((config, index) => {
          const IconComponent = config.icon;
          const ChartComponent = config.component;
          
          return (
            <ChartWrapper key={config.title}>
              <Slide in={true} timeout={600 + index * 200} direction="up">
                <ChartCard>
                  <ChartHeader gradient={config.gradient}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            width: 50,
                            height: 50,
                            backdropFilter: 'blur(10px)',
                          }}
                        >
                          <IconComponent sx={{ fontSize: 24 }} />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                            {config.title}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            {config.description}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Filter Data">
                          <IconButton
                            sx={{
                              color: 'white',
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                transform: 'scale(1.1)',
                              },
                            }}
                          >
                            <FilterList sx={{ fontSize: 20 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download Chart">
                          <IconButton
                            sx={{
                              color: 'white',
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                transform: 'scale(1.1)',
                              },
                            }}
                          >
                            <Download sx={{ fontSize: 20 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </ChartHeader>
                  <CardContent sx={{ p: 3 }}>
                    <ChartComponent />
                  </CardContent>
                </ChartCard>
              </Slide>
            </ChartWrapper>
          );
        })}
      </ChartsContainer>
    </Box>
  );
};

export default AnalyticsPage;
