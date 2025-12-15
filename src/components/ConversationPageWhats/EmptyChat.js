import React from 'react';
import { Box, Typography, Avatar, useTheme } from '@mui/material';
import { Chat as ChatIcon } from '@mui/icons-material';

export default function EmptyChat() {
  const theme = useTheme();

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%',
        textAlign: 'center',
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.5)',
        color: 'text.secondary',
        p: 3,
        userSelect: 'none',
      }}
    >
      <Avatar sx={{ 
        width: 80, 
        height: 80, 
        background: theme.palette.custom?.gradients?.button || 'linear-gradient(45deg, #8E24AA 30%, #D81B60 90%)', 
        mb: 3,
        boxShadow: theme.palette.mode === 'dark' 
          ? `0 4px 16px ${theme.palette.primary.dark}`
          : `0 4px 16px rgba(109, 40, 217, 0.3)`
      }}>
        <ChatIcon sx={{ fontSize: 40 }} />
      </Avatar>

      <Typography variant="h5" gutterBottom fontWeight="bold" sx={{
        background: theme.palette.custom?.gradients?.text || 'linear-gradient(45deg, #D8B4FE 30%, #8E24AA 90%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        mb: 2,
      }}>
        QualifAI Web
      </Typography>

      <Typography variant="body1" color={theme.palette.text.secondary}>
        Selecione uma conversa na barra lateral para começar a interagir com seus leads.
      </Typography>
    </Box>
  );
}