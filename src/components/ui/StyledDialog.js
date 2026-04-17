import React from 'react';
import { Dialog, useTheme } from '@mui/material';

export const StyledDialog = ({ PaperProps, ...props }) => {
  const theme = useTheme();
  return (
    <Dialog
      {...props}
      PaperProps={{
        ...PaperProps,
        sx: {
          borderRadius: 3,
          background: theme.palette.mode === 'dark'
            ? 'rgba(18, 18, 30, 0.85)'
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid',
          borderColor: theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.08)',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 24px 64px rgba(0,0,0,0.5)'
            : '0 24px 64px rgba(0,0,0,0.12)',
          backgroundImage: 'none',
          ...(PaperProps?.sx || {})
        }
      }}
    />
  );
};
