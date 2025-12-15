import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

export const GradientButton = styled(Button)(({ theme, variant }) => {
  const isGradient = variant !== 'outlined' && variant !== 'text';
  
  return {
    background: isGradient 
      ? theme.palette.custom?.gradients?.button || theme.palette.primary.main
      : 'transparent',
    color: isGradient ? 'white' : theme.palette.primary.main,
    border: isGradient ? 'none' : `1px solid ${theme.palette.primary.main}`,
    borderRadius: 50,
    textTransform: 'none',
    fontWeight: 700,
    padding: '10px 20px',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.palette.mode === 'dark'
        ? '0 6px 20px rgba(37, 117, 252, 0.4)'
        : '0 6px 20px rgba(109, 40, 217, 0.3)',
    },
    '&:disabled': {
      background: isGradient 
        ? theme.palette.action.disabled 
        : 'transparent',
      color: theme.palette.action.disabled,
      borderColor: theme.palette.action.disabled,
    },
  };
});