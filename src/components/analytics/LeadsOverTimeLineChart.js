// src/components/analytics/LeadsOverTimeLineChart.js
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useGetAllLeadsQuery } from '../../store/api/leadApi';
import { CircularProgress, Typography, Box, useTheme, Paper, Fade } from '@mui/material';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { styled } from '@mui/material/styles';

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: 400,
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
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
          {label}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: payload[0].color,
            }}
          />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {payload[0].value} leads created
          </Typography>
        </Box>
      </Paper>
    );
  }
  return null;
};

const LeadsOverTimeLineChart = () => {
  const { data: leadsData, isLoading, isError } = useGetAllLeadsQuery();
  const theme = useTheme();

  if (isLoading) {
    return (
      <LoadingContainer>
        <CircularProgress 
          size={60} 
          sx={{ 
            color: theme.palette.success.main,
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            }
          }} 
        />
        <Typography variant="body2" color="text.secondary">
          Loading timeline data...
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
          Unable to fetch lead timeline information
        </Typography>
      </ErrorContainer>
    );
  }

  const last30Days = eachDayOfInterval({
    start: subDays(new Date(), 29),
    end: new Date(),
  });

  const leadsByDay = last30Days.map(day => ({
    date: format(day, 'MMM d'),
    fullDate: format(day, 'yyyy-MM-dd'),
    count: 0,
  }));

  leadsData.data.forEach(lead => {
    const leadDate = format(new Date(lead.createdAt), 'yyyy-MM-dd');
    const dayData = leadsByDay.find(d => d.fullDate === leadDate);
    if (dayData) {
      dayData.count++;
    }
  });

  return (
    <Fade in={true} timeout={1400}>
      <Box sx={{ height: 450 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={leadsByDay}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <defs>
              <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.palette.success.main} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={theme.palette.success.main} stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={theme.palette.grey[200]}
              opacity={0.7}
            />
            <XAxis 
              dataKey="date" 
              tick={{ 
                fill: theme.palette.text.secondary,
                fontSize: 12,
                fontWeight: 500,
              }}
              axisLine={{ stroke: theme.palette.grey[300] }}
              tickLine={{ stroke: theme.palette.grey[300] }}
              interval="preserveStartEnd"
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
            <Area
              type="monotone"
              dataKey="count"
              name="Leads Created"
              stroke={theme.palette.success.main}
              strokeWidth={3}
              fill="url(#colorLeads)"
              dot={{ 
                fill: theme.palette.success.main, 
                strokeWidth: 2, 
                stroke: 'white',
                r: 4,
              }}
              activeDot={{ 
                r: 6, 
                stroke: theme.palette.success.main,
                strokeWidth: 2,
                fill: 'white',
              }}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Fade>
  );
};

export default LeadsOverTimeLineChart;
