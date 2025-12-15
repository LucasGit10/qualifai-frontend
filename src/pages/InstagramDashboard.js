import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Box, Typography, LinearProgress, useTheme, Switch, FormControlLabel, Chip, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { useAuthStore } from '../stores/authStore';
import InstagramStatsBoard from '../components/dashboard/InstagramStatsBoard';
import { Instagram as InstagramIcon } from '@mui/icons-material';

// Dados mockados para o modo de demonstração
const MOCK_DATA = {
  instagramConversations: {
    conversations: Array.from({ length: 18 }, (_, i) => ({
      id: i + 1,
      status: i < 7 ? 'active' : 'closed',
      channel: 'instagram'
    }))
  }
};

export default function InstagramDashboard() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthStore();
  const [useMockData, setUseMockData] = useState(false);

  const { data: conversationsData, isLoading: isLoadingConversations } = useQuery(
    'conversations-data-instagram',
    () => api.get('/conversations/').then(res => res.data),
    {
        enabled: isAuthenticated && !useMockData,
        refetchInterval: 30000,
    }
  );

  const allConversations = (useMockData ? MOCK_DATA.instagramConversations.conversations : conversationsData?.conversations) || [];
  const instagramConversations = allConversations.filter(c => c.channel === 'instagram');

  const isLoading = isLoadingConversations && !useMockData;

  if (isLoading) {
    return <LinearProgress />;
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      p: { xs: 1, sm: 2, md: 3 },
    }}>
      <Paper 
        sx={{ 
          p: { xs: 2, sm: 3 }, 
          mb: 3, 
          borderRadius: 3, 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
            <InstagramIcon sx={{ fontSize: { xs: 32, sm: 40 }, color: theme.palette.primary.main }} />
            <Box>
                <Typography variant="h4" fontWeight="bold" color="text.primary">
                    {t('dashboard.instagramStats.title', 'Dashboard do Instagram')}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                    {t('dashboard.instagramStats.subtitle', 'Estatísticas de conversas do Instagram')}
                </Typography>
            </Box>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <Chip 
            label={useMockData ? "Dados Demo" : "Dados Reais"} 
            color={useMockData ? "secondary" : "primary"}
            variant="outlined"
          />
          <FormControlLabel
            control={
              <Switch
                checked={useMockData}
                onChange={(e) => setUseMockData(e.target.checked)}
                color="primary"
              />
            }
            label={<Typography variant="body2" sx={{ color: 'text.primary' }}>Modo Demo</Typography>}
          />
        </Box>
      </Paper>

      <InstagramStatsBoard conversations={{ conversations: instagramConversations }} />

    </Box>
  );
}