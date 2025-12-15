import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ message = 'Carregando...' }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="200px"
      gap={2}
    >
      <CircularProgress />
      <Typography variant="body2" color="textSecondary">
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;