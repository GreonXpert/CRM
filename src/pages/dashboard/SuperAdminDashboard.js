// /src/pages/dashboard/SuperAdminDashboard.js
import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';

// Import Custom Components
import StatCard from '../../components/dashboard/StatCard';
import AppChart from '../../components/dashboard/AppChart';
import LeadTable from '../../components/dashboard/LeadTable';

// Import Icons
import { Group, CheckCircle, ThumbDown, TrendingUp, BarChart, PieChart } from '@mui/icons-material';

// --- Placeholder for API services ---
// In a real app, these would fetch data from your backend
const reportService = {
  getDashboardStats: async () => {
    // Mock data simulating an API call
    return {
      totalLeads: 1284,
      approvedCount: 972,
      rejectedCount: 312,
      approvalRatio: 75.7,
      statusCounts: [
        { name: 'Approved', value: 972 },
        { name: 'Rejected', value: 312 },
        { name: 'Follow-up', value: 150 },
        { name: 'New', value: 50 },
      ],
      monthlyPerformance: [
        { name: 'Jan', leads: 150 },
        { name: 'Feb', leads: 200 },
        { name: 'Mar', leads: 180 },
        { name: 'Apr', leads: 250 },
        { name: 'May', leads: 220 },
        { name: 'Jun', leads: 300 },
      ],
    };
  },
};

const leadService = {
  getRecentLeads: async () => {
    // Mock data for the recent leads table
    return [
      { _id: '1', customerName: 'Rohan Verma', status: 'Approved', createdAt: new Date().toISOString(), createdBy: { name: 'Admin One' } },
      { _id: '2', customerName: 'Sneha Reddy', status: 'New', createdAt: new Date().toISOString(), createdBy: { name: 'Admin Two' } },
      { _id: '3', customerName: 'Arjun Singh', status: 'Rejected', createdAt: new Date().toISOString(), createdBy: { name: 'Admin One' } },
      { _id: '4', customerName: 'Meera Desai', status: 'Follow-up', createdAt: new Date().toISOString(), createdBy: { name: 'Admin Three' } },
    ];
  },
};
// --- End of Placeholders ---


// --- Animation Variants for Framer Motion ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Stagger the animation of children
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


const SuperAdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsData = await reportService.getDashboardStats();
        const leadsData = await leadService.getRecentLeads();
        setStats(statsData);
        setRecentLeads(leadsData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    // You can add a loading spinner here for a better UX
    return <Typography>Loading Dashboard...</Typography>;
  }

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Container maxWidth="xl">
        <Typography variant="h2" gutterBottom component={motion.h2} variants={itemVariants}>
          Super Admin Dashboard
        </Typography>

        {/* Stat Cards Section */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3} component={motion.div} variants={itemVariants}>
            <StatCard
              title="Total Leads"
              value={stats.totalLeads.toLocaleString()}
              icon={<BarChart />}
              variant="gradient"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} component={motion.div} variants={itemVariants}>
            <StatCard
              title="Leads Approved"
              value={stats.approvedCount.toLocaleString()}
              icon={<CheckCircle />}
              variant="outlined"
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} component={motion.div} variants={itemVariants}>
            <StatCard
              title="Leads Rejected"
              value={stats.rejectedCount.toLocaleString()}
              icon={<ThumbDown />}
              variant="iconic"
              color="error"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} component={motion.div} variants={itemVariants}>
            <StatCard
              title="Approval Rate"
              value={`${stats.approvalRatio}%`}
              icon={<TrendingUp />}
              variant="gradient"
              color="secondary"
            />
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} lg={7} component={motion.div} variants={itemVariants}>
            <AppChart
              type="line"
              title="Monthly Lead Generation"
              data={stats.monthlyPerformance}
              dataKey="leads"
            />
          </Grid>
          <Grid item xs={12} lg={5} component={motion.div} variants={itemVariants}>
            <AppChart
              type="pie"
              title="Lead Status Distribution"
              data={stats.statusCounts}
              dataKey="value"
            />
          </Grid>
        </Grid>

        {/* Recent Leads Table */}
        <motion.div variants={itemVariants}>
           <Typography variant="h3" gutterBottom>
            Recent Activity
          </Typography>
          <LeadTable
            leads={recentLeads}
            // Pass empty functions as this is a view-only table on the dashboard
            onEdit={() => {}}
            onDelete={() => {}}
          />
        </motion.div>
      </Container>
    </Box>
  );
};

export default SuperAdminDashboard;
