// ===========================
// src/pages/reports/ReportsPage.js
// ===========================
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DatePicker,
  Paper,
} from '@mui/material';
import { Download, Visibility } from '@mui/icons-material';

const ReportsPage = () => {
  const [reportType, setReportType] = useState('');
  const [dateRange, setDateRange] = useState({
    start: null,
    end: null,
  });

  const reportTypes = [
    { value: 'leads', label: 'Leads Report' },
    { value: 'users', label: 'Users Report' },
    { value: 'monthly', label: 'Monthly Summary' },
    { value: 'performance', label: 'Performance Report' },
  ];

  const handleGenerateReport = () => {
    console.log('Generating report:', { reportType, dateRange });
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Reports & Analytics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Generate Report
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Report Type</InputLabel>
                  <Select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    label="Report Type"
                  >
                    {reportTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box display="flex" gap={2} sx={{ mb: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<Visibility />}
                    onClick={handleGenerateReport}
                    disabled={!reportType}
                  >
                    Preview
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={handleGenerateReport}
                    disabled={!reportType}
                  >
                    Download
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Report Preview
              </Typography>
              
              <Paper sx={{ p: 3, minHeight: 400, bgcolor: 'grey.50' }}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  height="100%"
                >
                  <Typography variant="body1" color="textSecondary">
                    {reportType 
                      ? 'Report preview will appear here'
                      : 'Select a report type to generate preview'
                    }
                  </Typography>
                </Box>
              </Paper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportsPage ;