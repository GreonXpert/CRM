// src/components/analytics/LeadStatusPieChart.js
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useGetAllLeadsQuery } from '../../store/api/leadApi';
import { CircularProgress, Typography, Box, useTheme, Paper, Fade } from '@mui/material';
import { styled } from '@mui/material/styles';

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: 300,
  gap: theme.spacing(2),
}));

const ErrorContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  borderRadius: 12,
  backgroundColor: theme.palette.error.light + '10',
  border: `1px solid ${theme.palette.error.light}`,
}));

const CustomTooltip = ({ active, payload }) => {
  const theme = useTheme();
  
  if (active && payload && payload.length) {
    return (
      <Paper
        sx={{
          p: 2,
          borderRadius: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${theme.palette.grey[200]}`,
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
          {payload[0].name}: {payload[0].value} leads
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {((payload[0].value / payload[0].payload.total) * 100).toFixed(1)}% of total
        </Typography>
      </Paper>
    );
  }
  return null;
};

const LeadStatusPieChart = () => {
  const { data: leadsData, isLoading, isError } = useGetAllLeadsQuery();
  const theme = useTheme();

  if (isLoading) {
    return (
      <LoadingContainer>
        <CircularProgress 
          size={60} 
          sx={{ 
            color: theme.palette.primary.main,
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            }
          }} 
        />
        <Typography variant="body2" color="text.secondary">
          Loading lead status data...
        </Typography>
      </LoadingContainer>
    );
  }

  if (isError || !leadsData) {
    return (
      <ErrorContainer elevation={0}>
        <Typography variant="h6" color="error" sx={{ mb: 1 }}>
          Error loading data
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Unable to fetch lead status information
        </Typography>
      </ErrorContainer>
    );
  }

  const statusCounts = leadsData.data.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});

  const total = leadsData.data.length;
  const chartData = Object.keys(statusCounts).map(status => ({
    name: status,
    value: statusCounts[status],
    total: total,
  }));

  const COLORS = {
    'New': theme.palette.info.main,
    'Follow-up': theme.palette.warning.main,
    'Approved': theme.palette.success.main,
    'Rejected': theme.palette.error.main,
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null; // Don't show labels for segments less than 5%
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="600"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Fade in={true} timeout={1000}>
      <Box sx={{ height: 350 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              animationBegin={0}
              animationDuration={800}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[entry.name]}
                  stroke="rgba(255, 255, 255, 0.8)"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => (
                <span style={{ color: theme.palette.text.primary, fontWeight: 500 }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Fade>
  );
};

export default LeadStatusPieChart;
