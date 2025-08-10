// /src/pages/dashboard/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';

// Import Custom Components
import StatCard from '../../components/dashboard/StatCard';
import AppChart from '../../components/dashboard/AppChart';
import LeadTable from '../../components/dashboard/EnhancedLeadTable';

// Import Icons
import { AddCard, CheckCircle, ThumbDown, TrendingUp, BarChart, PieChart } from '@mui/icons-material';

// --- Placeholder for API services for a specific Admin ---
const reportService = {
  getAdminDashboardStats: async (adminId) => {
    // Mock data simulating an API call for a single admin
    console.log(`Fetching stats for admin: ${adminId}`);
    return {
      totalLeads: 215,
      approvedCount: 150,
      rejectedCount: 45,
      approvalRatio: 69.7,
      statusCounts: [
        { name: 'Approved', value: 150 },
        { name: 'Rejected', value: 45 },
        { name: 'Follow-up', value: 15 },
        { name: 'New', value: 5 },
      ],
      monthlyPerformance: [
        { name: 'Jan', leads: 25 },
        { name: 'Feb', leads: 30 },
        { name: 'Mar', leads: 28 },
        { name: 'Apr', leads: 40 },
        { name: 'May', leads: 35 },
        { name: 'Jun', leads: 57 },
      ],
    };
  },
};

const leadService = {
  getRecentLeadsForAdmin: async (adminId) => {
    // Mock data for the recent leads table for a single admin
    console.log(`Fetching recent leads for admin: ${adminId}`);
    return [
      { _id: '1', customerName: 'Divya Nair', status: 'Approved', createdAt: new Date().toISOString(), createdBy: { name: 'Admin One' } },
      { _id: '2', customerName: 'Vikram Rao', status: 'New', createdAt: new Date().toISOString(), createdBy: { name: 'Admin One' } },
      { _id: '3', customerName: 'Anjali Mehta', status: 'Rejected', createdAt: new Date().toISOString(), createdBy: { name: 'Admin One' } },
    ];
  },
};
// --- End of Placeholders ---

// A placeholder for the auth context hook
const useAuth = () => ({
  user: { id: 'admin123', name: 'Admin One' },
});

// --- Animation Variants for Framer Motion ---
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


const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const statsData = await reportService.getAdminDashboardStats(user.id);
        const leadsData = await leadService.getRecentLeadsForAdmin(user.id);
        setStats(statsData);
        setRecentLeads(leadsData);
      } catch (error) {
        console.error("Failed to fetch admin dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) {
    return <Typography>Loading Your Dashboard...</Typography>;
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
          Welcome, {user.name}
        </Typography>

        {/* Stat Cards Section */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3} component={motion.div} variants={itemVariants}>
            <StatCard
              title="My Total Leads"
              value={stats.totalLeads.toLocaleString()}
              icon={<AddCard />}
              variant="gradient"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} component={motion.div} variants={itemVariants}>
            <StatCard
              title="Approved by Me"
              value={stats.approvedCount.toLocaleString()}
              icon={<CheckCircle />}
              variant="outlined"
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} component={motion.div} variants={itemVariants}>
            <StatCard
              title="Rejected by Me"
              value={stats.rejectedCount.toLocaleString()}
              icon={<ThumbDown />}
              variant="iconic"
              color="error"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} component={motion.div} variants={itemVariants}>
            <StatCard
              title="My Approval Rate"
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
              title="My Monthly Performance"
              data={stats.monthlyPerformance}
              dataKey="leads"
            />
          </Grid>
          <Grid item xs={12} lg={5} component={motion.div} variants={itemVariants}>
            <AppChart
              type="pie"
              title="My Lead Status"
              data={stats.statusCounts}
              dataKey="value"
            />
          </Grid>
        </Grid>

        {/* Recent Leads Table */}
        <motion.div variants={itemVariants}>
           <Typography variant="h3" gutterBottom>
            My Recent Leads
          </Typography>
          <LeadTable
            leads={recentLeads}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        </motion.div>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
