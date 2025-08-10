// ===========================
// src/pages/leads/LeadDetailsPage.js
// ===========================
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Divider,
} from '@mui/material';
import { ArrowBack, Edit } from '@mui/icons-material';

const LeadDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    setTimeout(() => {
      setLead({
        _id: id,
        customerName: 'John Doe',
        mobileNumber: '9876543210',
        panCard: 'ABCPD1234E',
        aadharNumber: '1234-5678-9012',
        preferredBank: 'HDFC Bank',
        employmentType: 'Salaried',
        monthlySalary: 50000,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <Typography>Loading lead details...</Typography>
      </Box>
    );
  }

  if (!lead) {
    return (
      <Box p={4}>
        <Typography color="error">Lead not found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/leads')}
          sx={{ mr: 2 }}
        >
          Back to Leads
        </Button>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          Lead Details
        </Typography>
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={() => navigate(`/leads/${id}/edit`)}
        >
          Edit Lead
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Customer Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Customer Name
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {lead.customerName}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Mobile Number
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {lead.mobileNumber}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    PAN Card
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {lead.panCard}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Aadhar Number
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {lead.aadharNumber}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Preferred Bank
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {lead.preferredBank}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Employment Type
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {lead.employmentType}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Monthly Salary
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    ₹{lead.monthlySalary?.toLocaleString()}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Status
                  </Typography>
                  <Chip
                    label={lead.status}
                    color={lead.status === 'approved' ? 'success' : 'warning'}
                    sx={{ mt: 0.5 }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Lead Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="subtitle2" color="textSecondary">
                Created Date
              </Typography>
              <Typography variant="body1" gutterBottom>
                {new Date(lead.createdAt).toLocaleDateString()}
              </Typography>
              
              <Typography variant="subtitle2" color="textSecondary">
                Lead ID
              </Typography>
              <Typography variant="body1" gutterBottom>
                {lead._id}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LeadDetailsPage ;