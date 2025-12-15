import React from 'react';
import { Box } from '@mui/material';

// Este é um componente muito mais simples, sem animações.
export default function StaticBackground() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1,
        // Apenas a cor de fundo Off-White sólida
        background: '#FAFAFA', 
      }}
    />
  );
}