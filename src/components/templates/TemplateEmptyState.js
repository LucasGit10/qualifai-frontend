import React from 'react';
import { Paper, Typography, useTheme } from '@mui/material';
import { Notes as TemplateIcon, Add as AddIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { GradientButton } from 'components/ui/GradientButton';

export const TemplateEmptyState = ({ onAction }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Paper sx={{
      p: 6,
      textAlign: 'center',
      borderRadius: 3,
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'background.paper',
      backdropFilter: theme.palette.mode === 'dark' ? 'blur(10px)' : 'none',
      border: `1px solid ${theme.palette.divider}`
    }}>
      <TemplateIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
      <Typography variant="h6" color="text.primary">{t('templatesPage.emptyState.title')}</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>{t('templatesPage.emptyState.message')}</Typography>
      <GradientButton startIcon={<AddIcon />} onClick={onAction}>
        {t('templatesPage.emptyState.button')}
      </GradientButton>
    </Paper>
  );
};