import { Dialog } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    background: theme.palette.mode === 'dark' 
      ? 'rgba(28, 22, 51, 0.9)' 
      : 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    border: theme.palette.mode === 'dark' 
      ? '1px solid rgba(252, 252, 252, 1)' 
      : '1px solid rgba(0, 0, 0, 0.1)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 8px 32px rgba(0, 0, 0, 0.4)'
      : '0 8px 32px rgba(0, 0, 0, 0.1)',
  },
}));
