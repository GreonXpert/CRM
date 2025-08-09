// /src/components/dashboard/StatCard.js
import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const StatCardWrapper = styled(motion.div)({
  height: '100%',
});

const StyledPaper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'variant' && prop !== 'color',
})(({ theme, variant = 'gradient', color = theme.palette.primary }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: theme.spacing(3),
  height: '100%',
  borderRadius: theme.shape.borderRadius * 2,
  position: 'relative',
  overflow: 'hidden',
  transition: 'box-shadow 0.3s ease-in-out',

  // --- Variant Styles ---

  // 1. Gradient Variant
  ...(variant === 'gradient' && {
    color: '#fff',
    background: `linear-gradient(135deg, ${color.light} 0%, ${color.main} 100%)`,
    boxShadow: `0 10px 20px -10px ${color.main}a0`,
  }),

  // 2. Outlined Variant
  ...(variant === 'outlined' && {
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    '&:hover': {
      borderColor: color.main,
      boxShadow: `0 0 20px 5px ${color.light}30`,
    },
  }),

  // 3. Iconic Variant
  ...(variant === 'iconic' && {
    backgroundColor: theme.palette.background.paper,
    textAlign: 'center',
    alignItems: 'center',
    border: `1px solid ${theme.palette.divider}`,
  }),
}));

const IconWrapper = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'variant' && prop !== 'color',
})(({ theme, variant, color = theme.palette.primary }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),

    // Iconic Variant Specific Styles
    ...(variant === 'iconic' && {
        width: 64,
        height: 64,
        borderRadius: '50%',
        backgroundColor: `${color.main}20`, // Light transparent background
        color: color.main,
    }),

    // Outlined Variant Specific Styles
    ...(variant === 'outlined' && {
        color: color.main,
    }),
}));


/**
 * An attractive, animated statistics card for dashboards.
 * @param {string} title - The title of the statistic.
 * @param {string|number} value - The value of the statistic.
 * @param {node} icon - The icon component to display (e.g., <PeopleIcon />).
 * @param {string} [variant='gradient'] - 'gradient', 'outlined', or 'iconic'.
 * @param {string} [color] - A theme color object (e.g., theme.palette.success).
 */
const StatCard = ({ title, value, icon, variant = 'gradient', color }) => {
  return (
    <StatCardWrapper
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <StyledPaper variant={variant} color={color}>
        <IconWrapper variant={variant} color={color}>
          {React.cloneElement(icon, { style: { fontSize: variant === 'iconic' ? 32 : 40 } })}
        </IconWrapper>

        <Box>
          <Typography variant="h2" component="div" sx={{ fontWeight: 700, color: variant === 'gradient' ? 'inherit' : 'text.primary' }}>
            {value}
          </Typography>
          <Typography variant="body2" sx={{ color: variant === 'gradient' ? '#ffffffcc' : 'text.secondary' }}>
            {title}
          </Typography>
        </Box>
      </StyledPaper>
    </StatCardWrapper>
  );
};

export default StatCard;
