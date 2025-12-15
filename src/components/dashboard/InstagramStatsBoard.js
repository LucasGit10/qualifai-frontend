import React from 'react';
import { Grid, Typography, Box, useTheme } from '@mui/material';
import { Instagram as InstagramIcon, Chat as ChatIcon, DonutLarge as DonutLargeIcon } from '@mui/icons-material';
import StatCard from './StatCard';
import { useTranslation } from 'react-i18next';

export default function InstagramStatsBoard({ conversations }) {
  const theme = useTheme();
  const { t } = useTranslation();

  const allInstagramConversations = conversations?.conversations || [];
  
  const totalConversations = allInstagramConversations.length;
  const activeConversations = allInstagramConversations.filter(c => c.status === 'active').length;

  return (
    <Box 
      sx={{ 
        p: { xs: 2, sm: 3 }, 
        mb: 3, 
        borderRadius: 3, 
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
      }}
    >
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <InstagramIcon sx={{ fontSize: { xs: 28, sm: 32 }, color: theme.palette.secondary.main }} />
        <Typography variant="h5" fontWeight="bold" color="text.primary">
          {t('dashboard.instagramStats.title', 'Estatísticas do Instagram')}
        </Typography>
      </Box>
      <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12} sm={6}>
          <StatCard 
            title={t('dashboard.instagramStats.totalConversations', 'Total de Conversas')} 
            value={totalConversations} 
            icon={<DonutLargeIcon />} 
            color={theme.palette.secondary.main} 
            subtitle={t('dashboard.statCards.total')} 
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <StatCard 
            title={t('dashboard.instagramStats.activeConversations', 'Conversas Ativas')} 
            value={activeConversations} 
            icon={<ChatIcon />} 
            color={theme.palette.info.main} 
            subtitle={t('dashboard.statCards.now')} 
          />
        </Grid>
      </Grid>
    </Box>
  );
}