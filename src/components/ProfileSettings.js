import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Box, Typography, Paper, TextField, CircularProgress, Chip, Grid, useTheme, alpha, Fade, Slide } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Person as PersonIcon, StarBorder as PlanIcon, Sync as StatusIcon, Event as DateIcon, Warning as WarningIcon } from '@mui/icons-material';

import api from '../services/api';
import { useAuthStore } from '../stores/authStore';
import { useShowcaseContext } from '../contexts/ShowcaseContext';
import ShowcaseBlocker from '../components/Showcase/ShowcaseBlocker';
import { GradientButton } from '../components/ui/GradientButton';

const planKeys = {
    'basic-monthly': 'planos.basico_mensal', 'basic-annual': 'planos.basico_anual',
    'medium-monthly': 'planos.medio_mensal', 'medium-annual': 'planos.medio_anual',
    'pro-monthly': 'planos.pro_mensal', 'pro-annual': 'planos.pro_anual',
};

const getTranslatedStatus = (status, t) => t(`status_assinatura.${status}`, status);

export default function ProfileSettings() {
  const { t } = useTranslation();
  const { user, updateUser } = useAuthStore();
  const queryClient = useQueryClient();
  const { isGuestMode } = useShowcaseContext();
  const navigate = useNavigate();
  const theme = useTheme();

  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (user) reset({ name: user.name || '', companyName: user.company?.name || '' });
  }, [user, reset]);

  const updateProfileMutation = useMutation(data => api.put('/auth/profile', data), {
    onSuccess: (response) => {
      toast.success(t('mensagens.perfil_salvo_sucesso'));
      updateUser(response.data.user);
      queryClient.invalidateQueries('user-profile');
    },
    onError: (error) => toast.error(error.response?.data?.message || t('mensagens.erro_salvar_perfil')),
  });

  const manageSubscriptionMutation = useMutation(() => api.post('/payments/create-portal-session'), {
    onSuccess: (response) => { if (response.data?.url) window.location.href = response.data.url; },
    onError: (error) => toast.error(error.response?.data?.message || t('mensagens.erro_abrir_portal_pagamento')),
  });

  const onSubmitProfile = (data) => {
    const payload = { name: data.name, company: { ...user?.company, name: data.companyName } };
    updateProfileMutation.mutate(payload);
  };

  const isSubscriptionActive = ['active', 'trialing'].includes(user?.stripe?.subscriptionStatus);

  const getSubscriptionInfoText = (user, isSubscriptionActive) => {
    if (!user?.stripe) return '';
    if (isSubscriptionActive && user.stripe.currentPeriodEnd) {
      const renewalDate = new Date(user.stripe.currentPeriodEnd).toLocaleDateString();
      return t('faturamento.renovacao_em', { date: renewalDate });
    }
    return isSubscriptionActive ? t('faturamento.assinatura_ativa') : t('faturamento.assinatura_nao_ativa');
  };

  const textFieldStyles = {
    '& .MuiInputLabel-root': { color: 'text.secondary' },
    '& .MuiOutlinedInput-root': {
        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
        '&:hover fieldset': { borderColor: 'primary.light' },
    },
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Fade in timeout={500}>
        <Paper sx={{ p: 2, mb: 3, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2, backgroundColor: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <PersonIcon sx={{ fontSize: 40 }}/>
          <Typography variant="h4" fontWeight="bold">{t('perfil.titulo_pagina')}</Typography>
        </Paper>
      </Fade>

      <Grid container spacing={3}>
        {/* Card de Informações Pessoais */}
        <Grid item xs={12} md={6}>
          <Slide direction="right" in timeout={500}>
            <Paper sx={{ p: 3, borderRadius: 3, backgroundColor: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)', height: '100%' }}>
              <Typography variant="h6" gutterBottom>{t('perfil.titulo_informacoes')}</Typography>
              <Box component="form" sx={{ mt: 2 }} onSubmit={handleSubmit(onSubmitProfile)}>
                <Controller name="name" control={control} render={({ field }) => <TextField {...field} fullWidth label={t('perfil.label_nome')} margin="normal" disabled={isGuestMode} sx={textFieldStyles}/>} />
                <TextField fullWidth label={t('perfil.label_email')} defaultValue={user?.email} margin="normal" disabled sx={textFieldStyles} />
                <Controller name="companyName" control={control} render={({ field }) => <TextField {...field} fullWidth label={t('perfil.label_empresa')} margin="normal" disabled={isGuestMode} sx={textFieldStyles} />} />
                <ShowcaseBlocker><GradientButton type="submit" sx={{ mt: 2 }} loading={updateProfileMutation.isLoading}>{t('perfil.btn_salvar')}</GradientButton></ShowcaseBlocker>
              </Box>
            </Paper>
          </Slide>
        </Grid>

        {/* Card de Faturamento */}
        <Grid item xs={12} md={6}>
            <Slide direction="left" in timeout={500}>
                <Paper sx={{ p: 3, borderRadius: 3, backgroundColor: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)', height: '100%' }}>
                    <Typography variant="h6" gutterBottom>{t('faturamento.titulo')}</Typography>
                    {user?.stripe?.planId ? (
                        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box display="flex" alignItems="center" gap={1}><PlanIcon color="primary" /><Typography>Plano Atual: <strong>{t(planKeys[user.stripe.planId], user.stripe.planId)}</strong></Typography></Box>
                            <Box display="flex" alignItems="center" gap={1}><StatusIcon color="primary" /><Typography>Status:</Typography><Chip label={getTranslatedStatus(user.stripe.subscriptionStatus, t)} color={isSubscriptionActive ? 'success' : 'warning'} size="small" /></Box>
                            <Box display="flex" alignItems="center" gap={1}><DateIcon color="primary" /><Typography variant="body2" color="text.secondary">{getSubscriptionInfoText(user, isSubscriptionActive)}</Typography></Box>
                            <ShowcaseBlocker><GradientButton sx={{ mt: 2 }} onClick={manageSubscriptionMutation.mutate} loading={manageSubscriptionMutation.isLoading}>{t('faturamento.btn_gerenciar_assinatura')}</GradientButton></ShowcaseBlocker>
                        </Box>
                    ) : (
                        <Box sx={{ mt: 2 }}><Typography variant="body1" color="text.secondary">{t('faturamento.nao_inscrito')}</Typography><GradientButton sx={{ mt: 2 }} onClick={() => navigate('/signature')}>{t('faturamento.btn_ver_planos')}</GradientButton></Box>
                    )}
                </Paper>
            </Slide>
        </Grid>

        {/* Card da Zona de Perigo */}
        <Grid item xs={12}>
            <Slide direction="up" in timeout={700}>
                <Paper sx={{ p: 3, borderRadius: 3, backgroundColor: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(10px)', border: `1px solid ${alpha(theme.palette.error.main, 0.5)}`, boxShadow: `0 0 16px ${alpha(theme.palette.error.main, 0.3)}` }}>
                    <Typography variant="h6" gutterBottom color="error.light"><WarningIcon sx={{ verticalAlign: 'middle', mr: 1 }}/>{t('perigo.titulo')}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{t('perigo.aviso_irreversivel')}</Typography>
                    <GradientButton color="error" onClick={() => navigate('/app/delete-account')} disabled={isGuestMode} sx={{ background: theme.palette.error.main }}>{t('perigo.btn_excluir_conta')}</GradientButton>
                </Paper>
            </Slide>
        </Grid>
      </Grid>
    </Box>
  );
}