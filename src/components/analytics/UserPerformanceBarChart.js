// src/components/analytics/UserPerformanceBarChart.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useGetUserPerformanceStatsQuery } from '../../store/api/reportApi'; // <-- UPDATED HOOK
import { CircularProgress, Typography, Box, useTheme, Paper, Fade } from '@mui/material';
import { styled } from '@mui/material/styles';

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: 350,
  gap: theme.spacing(2),
}));

const ErrorContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  borderRadius: 12,
  backgroundColor: theme.palette.error.light + '10',
  border: `1px solid ${theme.palette.error.light}`,
}));

const CustomTooltip = ({ active, payload, label }) => {
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
          minWidth: 200,
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
          {label}
        </Typography>
        {payload.map((entry, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: entry.color,
              }}
            />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {entry.name}: {entry.value}
            </Typography>
          </Box>
        ))}
      </Paper>
    );
  }
  return null;
};

const UserPerformanceBarChart = () => {
  // Use the single, correct hook for fetching performance data
  const { data: performanceData, isLoading, isError } = useGetUserPerformanceStatsQuery();
  const theme = useTheme();

  if (isLoading) {
    return (
      <LoadingContainer>
        <CircularProgress
          size={60}
          sx={{
            color: theme.palette.secondary.main,
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            }
          }}
        />
        <Typography variant="body2" color="text.secondary">
          Loading performance data...
        </Typography>
      </LoadingContainer>
    );
  }

  if (isError || !performanceData) {
    return (
      <ErrorContainer elevation={0}>
        <Typography variant="h6" color="error" sx={{ mb: 1 }}>
          Error loading data
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Unable to fetch user performance information.
        </Typography>
      </ErrorContainer>
    );
  }

  // The data is now pre-formatted from the API
  const chartData = performanceData.data.map(user => ({
    ...user,
    name: user.name.length > 10 ? user.name.substring(0, 10) + '...' : user.name,
  }));

  return (
    <Fade in={true} timeout={1200}>
      <Box sx={{ height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme.palette.grey[200]}
              opacity={0.7}
            />
            <XAxis
              dataKey="name"
              tick={{
                fill: theme.palette.text.secondary,
                fontSize: 12,
                fontWeight: 500,
              }}
              axisLine={{ stroke: theme.palette.grey[300] }}
              tickLine={{ stroke: theme.palette.grey[300] }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              tick={{
                fill: theme.palette.text.secondary,
                fontSize: 12,
                fontWeight: 500,
              }}
              axisLine={{ stroke: theme.palette.grey[300] }}
              tickLine={{ stroke: theme.palette.grey[300] }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                paddingTop: '20px',
                fontSize: '14px',
                fontWeight: 500,
              }}
            />
            <Bar
              dataKey="leads"
              name="Total Leads"
              fill={theme.palette.primary.main}
              radius={[2, 2, 0, 0]}
              animationDuration={800}
            />
            <Bar
              dataKey="approved"
              name="Approved"
              fill={theme.palette.success.main}
              radius={[2, 2, 0, 0]}
              animationDuration={1000}
            />
            <Bar
              dataKey="rejected"
              name="Rejected"
              fill={theme.palette.error.main}
              radius={[2, 2, 0, 0]}
              animationDuration={1200}
            />
            <Bar
              dataKey="pending"
              name="Pending"
              fill={theme.palette.warning.main}
              radius={[2, 2, 0, 0]}
              animationDuration={1400}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Fade>
  );
};

export default UserPerformanceBarChart;