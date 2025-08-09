// /src/pages/leads/ManageLeadsPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Stack } from '@mui/material';
import { motion } from 'framer-motion';

// Import Custom Components
import LeadTable from '../../components/dashboard/LeadTable';
import AppButton from '../../components/common/AppButton';

// Import Icons
import { Add } from '@mui/icons-material';

// --- Placeholder for API services ---
const leadService = {
  getAllLeads: async () => {
    // Mock data simulating a real API call
    return [
      { _id: '1', customerName: 'Aarav Sharma', mobileNumber: '9876543210', status: 'New', createdAt: '2025-08-08T10:00:00Z', createdBy: { name: 'Mirshad Ali', email: 'mirshad@ebscards.com' }, panCard: 'ABCDE1234F', aadharNumber: '123456789012', preferredBank: 'HDFC' },
      { _id: '2', customerName: 'Priya Patel', mobileNumber: '9123456789', status: 'Approved', createdAt: '2025-08-07T14:30:00Z', createdBy: { name: 'Amal Ram', email: 'amal@ebscards.com' }, panCard: 'FGHIJ5678K', aadharNumber: '234567890123', preferredBank: 'ICICI' },
      { _id: '3', customerName: 'Rohan Verma', mobileNumber: '9988776655', status: 'Rejected', createdAt: '2025-08-06T11:20:00Z', createdBy: { name: 'Mirshad Ali', email: 'mirshad@ebscards.com' }, panCard: 'KLMNO9012P', aadharNumber: '345678901234', preferredBank: 'AXIS' },
      { _id: '4', customerName: 'Sneha Reddy', mobileNumber: '9765432109', status: 'Follow-up', createdAt: '2025-08-05T09:00:00Z', createdBy: { name: 'Admin Two', email: 'admin2@ebscards.com' }, panCard: 'QRSTU3456V', aadharNumber: '456789012345', preferredBank: 'SBI' },
    ];
  },
  deleteLead: async (leadId) => {
    console.log(`Deleting lead with ID: ${leadId}`);
    return { success: true };
  }
};
// --- End of Placeholders ---

// --- Animation Variants for Framer Motion ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
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
    },
  },
};

const ManageLeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const leadsData = await leadService.getAllLeads();
        setLeads(leadsData);
      } catch (error) {
        console.error("Failed to fetch leads:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const handleEditLead = (lead) => {
    // In a real app, you would navigate to an edit page
    // navigate(`/leads/edit/${lead._id}`);
    alert(`Navigating to edit lead: ${lead.customerName}`);
    console.log('Editing lead:', lead);
  };

  const handleDeleteLead = async (leadId) => {
    // In a real app, you would call the API and then update the state
    try {
        await leadService.deleteLead(leadId);
        setLeads(prevLeads => prevLeads.filter(lead => lead._id !== leadId));
        alert(`Lead with ID ${leadId} deleted successfully.`);
    } catch (error) {
        console.error("Failed to delete lead:", error);
        alert("Failed to delete lead. Please try again.");
    }
  };

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Container maxWidth="xl">
        {/* Page Header */}
        <motion.div variants={itemVariants}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
            sx={{ mb: 4 }}
          >
            <Box>
              <Typography variant="h2" gutterBottom>
                Manage Leads
              </Typography>
              <Typography variant="body1" color="text.secondary">
                View, edit, and manage all customer leads in the system.
              </Typography>
            </Box>
            <AppButton
              variant="primary"
              startIcon={<Add />}
              onClick={() => navigate('/leads/add')}
            >
              Add New Lead
            </AppButton>
          </Stack>
        </motion.div>

        {/* Lead Table */}
        <motion.div variants={itemVariants}>
          {loading ? (
            <Typography>Loading leads...</Typography>
          ) : (
            <LeadTable
              leads={leads}
              onEdit={handleEditLead}
              onDelete={handleDeleteLead}
            />
          )}
        </motion.div>
      </Container>
    </Box>
  );
};

export default ManageLeadsPage;
