import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  Alert, 
  CircularProgress,
  Paper,
  Card,
  CardContent,
  Button,
  Fab
} from '@mui/material';
import { 
  Group, 
  CheckCircle, 
  ThumbDown, 
  TrendingUp, 
  BarChart, 
  PieChart,
  Refresh,
  Settings
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Import Enhanced Hooks
import { useSocket } from '../../hooks/useSocket';
import { useRealTimeData } from '../../hooks/useRealTimeData';

// Import Components
import StatCard from '../../components/dashboard/StatCard';
import AppChart from '../../components/dashboard/AppChart';
import LeadTable from '../../components/dashboard/EnhancedLeadTable';
import ConnectionStatus from '../../components/common/ConnectionStatus';

// Import API Services
import { getDashboardStats, getRecentLeads } from '../../api/dashboardService';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

const EnhancedSuperAdminDashboard = () => {
  // Local state
  const [localStats, setLocalStats] = useState(null);
  const [localLeads, setLocalLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Socket connection
  const { 
    connected, 
    error: socketError, 
    emit, 
    on, 
    off 
  } = useSocket();

  // Real-time data hooks
  const { 
    data: realTimeStats, 
    loading: statsLoading, 
    error: statsError,
    refresh: refreshStats
  } = useRealTimeData('dashboard_stats', null, {
    autoRequest: true,
    requestEvent: 'request_dashboard_stats',
    refreshInterval: 30000 // Refresh every 30 seconds
  });

  const { 
    data: realTimeLeads, 
    loading: leadsLoading,
    error: leadsError,
    refresh: refreshLeads
  } = useRealTimeData('recent_leads', null, {
    autoRequest: true,
    requestEvent: 'request_recent_leads',
    refreshInterval: 60000 // Refresh every minute
  });

  const {
    data: liveEmissions,
    loading: emissionsLoading
  } = useRealTimeData('live_emissions', null, {
    autoRequest: true,
    requestEvent: 'request_live_emissions',
    refreshInterval: 5000 // Refresh every 5 seconds for live data
  });

  // Initial data fetch (fallback if real-time fails)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [statsResponse, leadsResponse] = await Promise.all([
          getDashboardStats(),
          getRecentLeads()
        ]);

        setLocalStats(statsResponse.data);
        setLocalLeads(leadsResponse.data);
        setLastUpdated(new Date());
      } catch (err) {
        console.error('Failed to fetch initial dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch initial data if not connected or no real-time data
    if (!connected || (!realTimeStats && !statsLoading)) {
      fetchInitialData();
    }
  }, [connected, realTimeStats, statsLoading]);

  // Setup real-time event listeners
  useEffect(() => {
    if (!connected) return;

    // Listen for real-time updates
    on('stats_updated', (updatedStats) => {
      setLocalStats(updatedStats);
      setLastUpdated(new Date());
      console.log('📊 Dashboard stats updated via real-time');
    });

    on('new_lead_created', (newLead) => {
      setLocalLeads(prev => [newLead, ...prev.slice(0, 9)]); // Keep latest 10
      setLastUpdated(new Date());
      console.log('👥 New lead created via real-time');
    });

    on('emission_data_updated', (emissionData) => {
      // Handle live emission data updates
      console.log('🌱 Live emission data updated:', emissionData);
    });

    return () => {
      off('stats_updated');
      off('new_lead_created');
      off('emission_data_updated');
    };
  }, [connected, on, off]);

  // Manual refresh function
  const handleRefresh = async () => {
    if (connected) {
      // Use real-time refresh
      refreshStats();
      refreshLeads();
      emit('request_live_emissions');
    } else {
      // Fallback to API calls
      try {
        setLoading(true);
        const [statsResponse, leadsResponse] = await Promise.all([
          getDashboardStats(),
          getRecentLeads()
        ]);
        setLocalStats(statsResponse.data);
        setLocalLeads(leadsResponse.data);
        setLastUpdated(new Date());
      } catch (err) {
        setError('Failed to refresh data');
      } finally {
        setLoading(false);
      }
    }
  };

  // Determine which data to use (real-time vs local)
  const displayStats = realTimeStats || localStats;
  const displayLeads = realTimeLeads || localLeads;
  const isLoading = loading || statsLoading || leadsLoading;
  const hasError = error || statsError || leadsError || socketError;

  // Show loading state
  if (isLoading && !displayStats) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Loading dashboard...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header with connection status */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            ZeroCarbon Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </Typography>
        </Box>
        
        <Box display="flex" alignItems="center" gap={2}>
          <ConnectionStatus showDetails={!connected} />
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            disabled={isLoading}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Error alerts */}
      {hasError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || statsError || leadsError || socketError}
        </Alert>
      )}

      {/* Dashboard content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Stats cards */}
        {displayStats && (
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <motion.div variants={itemVariants}>
                <StatCard
                  title="Total Leads"
                  value={displayStats.totalLeads || 0}
                  icon={<Group />}
                  change={displayStats.leadsChange || 0}
                  color="primary"
                  realTime={!!realTimeStats}
                />
              </motion.div>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <motion.div variants={itemVariants}>
                <StatCard
                  title="Approved Leads"
                  value={displayStats.approvedLeads || 0}
                  icon={<CheckCircle />}
                  change={displayStats.approvedChange || 0}
                  color="success"
                  realTime={!!realTimeStats}
                />
              </motion.div>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <motion.div variants={itemVariants}>
                <StatCard
                  title="Rejected Leads"
                  value={displayStats.rejectedLeads || 0}
                  icon={<ThumbDown />}
                  change={displayStats.rejectedChange || 0}
                  color="error"
                  realTime={!!realTimeStats}
                />
              </motion.div>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <motion.div variants={itemVariants}>
                <StatCard
                  title="Conversion Rate"
                  value={`${displayStats.conversionRate || 0}%`}
                  icon={<TrendingUp />}
                  change={displayStats.conversionChange || 0}
                  color="info"
                  realTime={!!realTimeStats}
                />
              </motion.div>
            </Grid>
          </Grid>
        )}

        {/* Live emissions data (ZeroCarbon specific) */}
        {liveEmissions && (
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Live CO₂ Emissions
                    </Typography>
                    <Typography variant="h4" color="primary">
                      {liveEmissions.co2} kg
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Real-time monitoring
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Energy Consumption
                    </Typography>
                    <Typography variant="h4" color="secondary">
                      {liveEmissions.energy} kWh
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Current usage
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        )}

        {/* Charts */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={8}>
            <motion.div variants={itemVariants}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Leads Overview
                </Typography>
                <AppChart 
                  data={displayStats?.chartData || []} 
                  type="line"
                  realTime={!!realTimeStats}
                />
              </Paper>
            </motion.div>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <motion.div variants={itemVariants}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Lead Status Distribution
                </Typography>
                <AppChart 
                  data={displayStats?.pieData || []} 
                  type="pie"
                  realTime={!!realTimeStats}
                />
              </Paper>
            </motion.div>
          </Grid>
        </Grid>

        {/* Recent leads table */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <motion.div variants={itemVariants}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Recent Leads
                  {(realTimeLeads || connected) && (
                    <Typography 
                      component="span" 
                      variant="caption" 
                      color="success.main"
                      sx={{ ml: 1 }}
                    >
                      (Live Updates)
                    </Typography>
                  )}
                </Typography>
                <LeadTable 
                  leads={displayLeads} 
                  loading={leadsLoading}
                  realTime={!!realTimeLeads}
                />
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>

      {/* Floating action button for quick actions */}
      <Fab
        color="primary"
        aria-label="settings"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => {
          // Open settings or quick actions menu
          console.log('Quick actions clicked');
        }}
      >
        <Settings />
      </Fab>
    </Container>
  );
};

export default EnhancedSuperAdminDashboard;