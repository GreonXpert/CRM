// /src/components/common/AppButton.js
import React from 'react';
import { Button, CircularProgress, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

// ==============================================
// STYLED COMPONENTS
// ==============================================

const StyledButton = styled(Button)(({ theme, variant: buttonVariant }) => ({
  borderRadius: 12,
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.95rem',
  padding: '12px 32px',
  minHeight: 48,
  transition: 'all 0.2s ease-in-out',
  position: 'relative',
  overflow: 'hidden',
  
  // Primary variant
  ...(buttonVariant === 'primary' && {
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    color: 'white',
    border: 'none',
    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
    '&:hover': {
      background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
      boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
      transform: 'translateY(-2px)',
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
    },
    '&:disabled': {
      background: theme.palette.grey[300],
      color: theme.palette.grey[500],
      boxShadow: 'none',
      transform: 'none',
    },
  }),
  
  // Secondary variant
  ...(buttonVariant === 'secondary' && {
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
    border: `2px solid ${theme.palette.primary.main}`,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: 'white',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
    '&:disabled': {
      color: theme.palette.grey[400],
      borderColor: theme.palette.grey[300],
      backgroundColor: 'transparent',
    },
  }),
  
  // Success variant
  ...(buttonVariant === 'success' && {
    background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
    color: 'white',
    border: 'none',
    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
    '&:hover': {
      background: `linear-gradient(135deg, ${theme.palette.success.dark} 0%, ${theme.palette.success.main} 100%)`,
      boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)',
      transform: 'translateY(-2px)',
    },
    '&:disabled': {
      background: theme.palette.grey[300],
      color: theme.palette.grey[500],
      boxShadow: 'none',
    },
  }),
  
  // Error variant
  ...(buttonVariant === 'error' && {
    background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
    color: 'white',
    border: 'none',
    boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)',
    '&:hover': {
      background: `linear-gradient(135deg, ${theme.palette.error.dark} 0%, ${theme.palette.error.main} 100%)`,
      boxShadow: '0 6px 20px rgba(244, 67, 54, 0.4)',
      transform: 'translateY(-2px)',
    },
    '&:disabled': {
      background: theme.palette.grey[300],
      color: theme.palette.grey[500],
      boxShadow: 'none',
    },
  }),
  
  // Warning variant
  ...(buttonVariant === 'warning' && {
    background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
    color: 'white',
    border: 'none',
    boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)',
    '&:hover': {
      background: `linear-gradient(135deg, ${theme.palette.warning.dark} 0%, ${theme.palette.warning.main} 100%)`,
      boxShadow: '0 6px 20px rgba(255, 152, 0, 0.4)',
      transform: 'translateY(-2px)',
    },
    '&:disabled': {
      background: theme.palette.grey[300],
      color: theme.palette.grey[500],
      boxShadow: 'none',
    },
  }),
  
  // Ghost variant
  ...(buttonVariant === 'ghost' && {
    backgroundColor: 'transparent',
    color: theme.palette.text.primary,
    border: 'none',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: theme.palette.grey[100],
      transform: 'translateY(-1px)',
    },
    '&:disabled': {
      color: theme.palette.grey[400],
      backgroundColor: 'transparent',
    },
  }),
}));

// ==============================================
// MAIN COMPONENT
// ==============================================

/**
 * Enhanced Button Component with loading states and multiple variants
 * @param {Object} props - Component props
 * @param {string} props.variant - Button variant (primary, secondary, success, error, warning, ghost)
 * @param {boolean} props.loading - Whether button is in loading state
 * @param {string} props.loadingText - Text to show when loading
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {string} props.size - Button size (small, medium, large)
 * @param {boolean} props.fullWidth - Whether button takes full width
 * @param {React.ReactNode} props.startIcon - Icon to show at start
 * @param {React.ReactNode} props.endIcon - Icon to show at end
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} props.onClick - Click handler
 * @param {string} props.type - Button type (button, submit, reset)
 * @param {Object} props.sx - Material-UI sx prop for styling
 */
const AppButton = ({
  variant = 'primary',
  loading = false,
  loadingText = 'Loading...',
  disabled = false,
  size = 'medium',
  fullWidth = false,
  startIcon,
  endIcon,
  children,
  onClick,
  type = 'button',
  sx = {},
  ...rest
}) => {
  // Handle size mapping
  const sizeProps = {
    small: { padding: '8px 20px', minHeight: 36, fontSize: '0.875rem' },
    medium: { padding: '12px 32px', minHeight: 48, fontSize: '0.95rem' },
    large: { padding: '16px 40px', minHeight: 56, fontSize: '1.1rem' },
  };

  // Determine if button should be disabled
  const isDisabled = disabled || loading;

  // Handle click with loading state
  const handleClick = async (event) => {
    if (loading || disabled || !onClick) return;
    
    try {
      await onClick(event);
    } catch (error) {
      console.error('Button click error:', error);
    }
  };

  return (
    <StyledButton
      variant={variant}
      disabled={isDisabled}
      fullWidth={fullWidth}
      type={type}
      onClick={handleClick}
      startIcon={loading ? null : startIcon}
      endIcon={loading ? null : endIcon}
      sx={{
        ...sizeProps[size],
        ...sx,
      }}
      {...rest}
    >
      {loading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress 
            size={16} 
            color="inherit" 
            sx={{ 
              color: variant === 'secondary' || variant === 'ghost' 
                ? 'primary.main' 
                : 'white' 
            }} 
          />
          {loadingText}
        </Box>
      ) : (
        children
      )}
    </StyledButton>
  );
};

// ==============================================
// BUTTON VARIANTS AS SEPARATE COMPONENTS
// ==============================================

/**
 * Primary Button - Main actions
 */
export const PrimaryButton = (props) => (
  <AppButton variant="primary" {...props} />
);

/**
 * Secondary Button - Secondary actions
 */
export const SecondaryButton = (props) => (
  <AppButton variant="secondary" {...props} />
);

/**
 * Success Button - Positive actions
 */
export const SuccessButton = (props) => (
  <AppButton variant="success" {...props} />
);

/**
 * Error Button - Destructive actions
 */
export const ErrorButton = (props) => (
  <AppButton variant="error" {...props} />
);

/**
 * Warning Button - Caution actions
 */
export const WarningButton = (props) => (
  <AppButton variant="warning" {...props} />
);

/**
 * Ghost Button - Subtle actions
 */
export const GhostButton = (props) => (
  <AppButton variant="ghost" {...props} />
);

// ==============================================
// SPECIALIZED BUTTON COMPONENTS
// ==============================================

/**
 * Submit Button - For forms
 */
export const SubmitButton = ({ children = 'Submit', ...props }) => (
  <AppButton type="submit" variant="primary" {...props}>
    {children}
  </AppButton>
);

/**
 * Cancel Button - For cancelling actions
 */
export const CancelButton = ({ children = 'Cancel', ...props }) => (
  <AppButton variant="secondary" {...props}>
    {children}
  </AppButton>
);

/**
 * Save Button - For saving data
 */
export const SaveButton = ({ children = 'Save', ...props }) => (
  <AppButton variant="success" {...props}>
    {children}
  </AppButton>
);

/**
 * Delete Button - For destructive actions
 */
export const DeleteButton = ({ children = 'Delete', ...props }) => (
  <AppButton variant="error" {...props}>
    {children}
  </AppButton>
);

/**
 * Loading Button - Button that shows loading state
 */
export const LoadingButton = ({ 
  isLoading, 
  loadingText = 'Please wait...', 
  children, 
  ...props 
}) => (
  <AppButton loading={isLoading} loadingText={loadingText} {...props}>
    {children}
  </AppButton>
);

/**
 * Icon Button - Button with just an icon
 */
export const IconButton = ({ 
  icon, 
  tooltip, 
  variant = 'ghost', 
  size = 'medium',
  ...props 
}) => (
  <AppButton 
    variant={variant} 
    size={size}
    sx={{ 
      minWidth: 'auto', 
      padding: size === 'small' ? 1 : size === 'large' ? 2 : 1.5,
      aspectRatio: '1',
      ...props.sx 
    }}
    title={tooltip}
    {...props}
  >
    {icon}
  </AppButton>
);

export default AppButton;