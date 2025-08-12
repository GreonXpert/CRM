// src/components/common/StatsCard.js
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Slide,
  Grid,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

// Animations
const glow = keyframes`
  0%, 100% { box-shadow: 0 4px 20px rgba(99, 102, 241, 0.2); }
  50% { box-shadow: 0 8px 40px rgba(99, 102, 241, 0.4); }
`;

// Styled Components
const StyledStatsCard = styled(Card)(({ theme, color, gradient }) => ({
  borderRadius: 20,
  background: gradient || `linear-gradient(135deg, ${color}10 0%, ${color}05 100%)`,
  border: `1px solid ${color ? `${color}20` : theme.palette.grey[200]}`,
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  position: 'relative',
  overflow: 'hidden',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: color 
      ? `0 20px 40px ${color}30` 
      : '0 20px 40px rgba(0, 0, 0, 0.15)',
    animation: `${glow} 2s ease-in-out infinite`,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: gradient 
      ? 'linear-gradient(90deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.3) 100%)'
      : color 
      ? `linear-gradient(90deg, ${color} 0%, ${color}80 100%)`
      : `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  },
  '&::after': gradient ? {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '200%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    transition: 'left 0.5s',
  } : {},
  '&:hover::after': gradient ? {
    left: '100%',
  } : {},
}));

const StatsCardContainer = ({ stats, isLoading, startIndex = 0 }) => {
  return (
    <Grid container spacing={3}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <Slide in={true} timeout={600 + (startIndex + index) * 200} direction="up">
              <StyledStatsCard 
                color={stat.color} 
                gradient={stat.gradient}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    mb: 2 
                  }}>
                    <Avatar
                      sx={{
                        backgroundColor: stat.gradient 
                          ? 'rgba(255, 255, 255, 0.2)'
                          : stat.color,
                        color: stat.gradient ? 'white' : 'white',
                        width: stat.size === 'large' ? 70 : 56,
                        height: stat.size === 'large' ? 70 : 56,
                        boxShadow: stat.gradient 
                          ? '0 8px 20px rgba(255, 255, 255, 0.3)'
                          : `0 8px 20px ${stat.color}40`,
                        backdropFilter: stat.gradient ? 'blur(10px)' : 'none',
                      }}
                    >
                      {typeof stat.icon === 'function' ? (
                        <Icon sx={{ fontSize: stat.size === 'large' ? 32 : 28 }} />
                      ) : (
                        stat.icon
                      )}
                    </Avatar>
                    
                    {stat.badge && (
                      <Box sx={{ textAlign: 'right' }}>
                        {stat.badge}
                      </Box>
                    )}
                  </Box>
                  
                  <Typography 
                    variant={stat.size === 'large' ? 'h2' : 'h4'} 
                    sx={{ 
                      fontWeight: 800, 
                      color: stat.gradient ? 'white' : 'text.primary', 
                      mb: 1 
                    }}
                  >
                    {isLoading ? '...' : stat.value}
                  </Typography>
                  
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: stat.gradient ? 'white' : 'text.primary', 
                      mb: 1, 
                      fontWeight: 600 
                    }}
                  >
                    {stat.title}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: stat.gradient ? 'rgba(255, 255, 255, 0.9)' : 'text.secondary', 
                      opacity: stat.gradient ? 0.9 : 0.8 
                    }}
                  >
                    {stat.description}
                  </Typography>
                </CardContent>
              </StyledStatsCard>
            </Slide>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default StatsCardContainer;
