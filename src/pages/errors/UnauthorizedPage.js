// ===========================
// src/pages/errors/UnauthorizedPage.js
// ===========================
import React from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { Lock, Home } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="grey.50"
    >
      <Card sx={{ maxWidth: 500, textAlign: 'center' }}>
        <CardContent sx={{ p: 4 }}>
          <Lock sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
          
          <Typography variant="h4" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            You don't have permission to access this resource. 
            Please contact your administrator if you believe this is an error.
          </Typography>
          
          <Box display="flex" gap={2} justifyContent="center" mt={3}>
            <Button
              variant="contained"
              startIcon={<Home />}
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/login')}
            >
              Login Again
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UnauthorizedPage ;