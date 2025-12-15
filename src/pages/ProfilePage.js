import React from 'react';
import { Box, Typography } from '@mui/material';
import ProfileSettings from '../components/ProfileSettings'; // Importe o componente que criamos

export default function ProfilePage() {
  return (
    <Box>
      <Box sx={{ mt: 3 }}>
        <ProfileSettings />
      </Box>
    </Box>
  );
}