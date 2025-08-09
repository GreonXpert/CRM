// /src/components/common/AppButton.js
import React from 'react';
import { Button } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

// --- Keyframes for Animations ---

// Shake animation for the danger button
const shake = keyframes`
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  30% { transform: translate(3px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  70% { transform: translate(3px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(1px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
`;

// --- Styled Button Component ---

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'variant',
})(({ theme, variant = 'primary' }) => ({
  padding: '10px 24px',
  borderRadius: theme.shape.borderRadius,
  fontWeight: '600',
  fontSize: '0.9rem',
  textTransform: 'none',
  transition: 'all 0.3s ease-in-out',
  
  // --- Variant Styles ---
  
  // 1. Primary Button (Default)
  ...(variant === 'primary' && {
    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
    color: '#fff',
    border: 'none',
    boxShadow: `0 4px 15px 0 rgba(25, 118, 210, 0.4)`,
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: `0 6px 20px 0 rgba(25, 118, 210, 0.5)`,
    },
  }),

  // 2. Secondary Button
  ...(variant === 'secondary' && {
    color: theme.palette.primary.main,
    backgroundColor: 'transparent',
    border: `2px solid ${theme.palette.primary.main}`,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
    },
  }),

  // 3. Danger Button
  ...(variant === 'danger' && {
    backgroundColor: theme.palette.error.main,
    color: '#fff',
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
      animation: `${shake} 0.5s`,
    },
  }),

  // 4. Glass Button
  ...(variant === 'glass' && {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    color: theme.palette.text.primary,
    border: `1px solid rgba(255, 255, 255, 0.2)`,
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.25)',
      borderColor: 'rgba(255, 255, 255, 0.4)',
    },
  }),
}));

/**
 * A versatile, animated button component with multiple variants.
 * @param {string} variant - The style of the button. Can be 'primary', 'secondary', 'danger', or 'glass'.
 * @param {node} children - The content of the button.
 * @param {func} onClick - The function to call when the button is clicked.
 * @param {object} otherProps - Any other props to pass to the MUI Button component.
 */
const AppButton = ({ variant, children, ...otherProps }) => {
  return (
    <StyledButton variant={variant} {...otherProps}>
      {children}
    </StyledButton>
  );
};

export default AppButton;
