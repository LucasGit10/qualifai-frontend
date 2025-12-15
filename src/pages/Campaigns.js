import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box, Typography, Button, Paper, TextField, Chip, Alert, Grid,
  LinearProgress, FormControl, InputLabel, Select, MenuItem, IconButton,
  Tooltip, CircularProgress, Stack, Divider, Switch, FormControlLabel,
  useTheme, alpha, DialogTitle, DialogContent, DialogActions, styled
} from '@mui/material';
import {
  Add as AddIcon, PlayArrow as PlayIcon, Pause as PauseIcon, CloudUpload as UploadIcon,
  Edit as EditIcon, Delete as DeleteIcon, CopyAll as CopyAllIcon, Cancel as CancelIcon,
  WhatsApp as WhatsAppIcon, Email as EmailIcon, Verified as VerifiedIcon, Campaign as CampaignIcon,
  CheckCircleOutline as SentIcon, QuestionAnswerOutlined as RepliedIcon, ErrorOutline as FailedIcon,
  RestartAlt as RestartAltIcon, AutoAwesome as AutoAwesomeIcon, Warning as WarningIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useTranslation, Trans } from 'react-i18next';
import api from '../services/api';
import { useShowcaseContext } from '../contexts/ShowcaseContext';
import { mockCampaigns } from '../utils/mockData';
import ShowcaseBlocker from '../components/Showcase/ShowcaseBlocker';

import { StyledDialog } from '../components/ui/StyledDialog';
import { GradientButton } from '../components/ui/GradientButton';

// -- Funções Auxiliares --
const getChannelIcon = (channel) => {
    const props = { sx: { fontSize: 16, color: 'white' } };
    const avatarSx = { width: 24, height: 24, boxShadow: '0 2px 4px rgba(0,0,0,0.3)' };
    switch (channel) {
        case 'whatsapp_official': return <Tooltip title="WhatsApp Oficial"><Box sx={{...avatarSx, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#25D366'}}><VerifiedIcon {...props} /></Box></Tooltip>;
        case 'email': return <Tooltip title="Email"><Box sx={{...avatarSx, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.700'}}><EmailIcon {...props} /></Box></Tooltip>;
        default: return <Tooltip title="WhatsApp"><Box sx={{...avatarSx, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#25D366'}}><WhatsAppIcon {...props} /></Box></Tooltip>;
    }
};

// ==========================================================================================
//  COMPONENTE: Card da Campanha (Estilo Vidro)
// ==========================================================================================
const CampaignCard = ({ campaign, onAction, actionIsLoading }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const progress = campaign.stats?.total > 0 ? ((campaign.stats.sent + campaign.stats.failed) / campaign.stats.total) * 100 : 0;
  
  const handleAction = (action, campaignData, event) => {
    event.stopPropagation();
    onAction(action, campaignData);
  };

  const getStatusStyles = (status) => {
    const baseHover = {
      transform: 'translateY(-4px)',
      borderColor: theme.palette.primary.main,
    };

    switch (status) {
      case 'running': return { borderColor: 'success.main', boxShadow: `0 0 12px 2px ${alpha(theme.palette.success.main, 0.5)}`, '&:hover': { ...baseHover, boxShadow: `0 6px 16px 4px ${alpha(theme.palette.success.main, 0.6)}` } };
      case 'paused': return { borderColor: 'warning.main', boxShadow: `0 0 12px 2px ${alpha(theme.palette.warning.main, 0.5)}`, '&:hover': { ...baseHover, boxShadow: `0 6px 16px 4px ${alpha(theme.palette.warning.main, 0.6)}` } };
      case 'cancelled': return { borderColor: 'error.main', boxShadow: `0 0 12px 2px ${alpha(theme.palette.error.main, 0.5)}`, '&:hover': { ...baseHover, boxShadow: `0 6px 16px 4px ${alpha(theme.palette.error.main, 0.6)}` } };
      case 'completed': return { opacity: 0.7, '&:hover': { ...baseHover, opacity: 1, boxShadow: `0 6px 16px 4px ${alpha(theme.palette.info.main, 0.3)}` } };
      case 'draft':
      default: return { '&:hover': { ...baseHover, boxShadow: `0 6px 16px 4px ${alpha(theme.palette.primary.main, 0.3)}` } };
    }
  };

  const getStatusChip = (status) => {
    const styles = { height: 'auto', '& .MuiChip-label': { py: '2px', px: '6px', fontSize: '0.7rem' } };
    switch (status) {
      case 'running': return <Chip label={t(`campaignsPage.status.${status}`)} size="small" sx={{ ...styles, backgroundColor: alpha(theme.palette.success.main, 0.3), border: `1px solid ${alpha(theme.palette.success.main, 0.7)}`, color: theme.palette.text.primary }} />;
      case 'paused': return <Chip label={t(`campaignsPage.status.${status}`)} size="small" sx={{ ...styles, backgroundColor: alpha(theme.palette.warning.main, 0.3), border: `1px solid ${alpha(theme.palette.warning.main, 0.7)}`, color: theme.palette.text.primary }} />;
      case 'cancelled': return <Chip label={t(`campaignsPage.status.${status}`)} size="small" sx={{ ...styles, backgroundColor: alpha(theme.palette.error.main, 0.4), border: `1px solid ${alpha(theme.palette.error.main, 0.8)}`, color: theme.palette.text.primary }} />;
      case 'completed': return <Chip label={t(`campaignsPage.status.${status}`)} size="small" sx={{...styles, backgroundColor: alpha(theme.palette.info.main, 0.3), border: `1px solid ${alpha(theme.palette.info.main, 0.7)}`, color: theme.palette.text.primary }} />;
      default: return <Chip label={t(`campaignsPage.status.${status}`)} size="small" variant="outlined" sx={{...styles, borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)', color: theme.palette.text.secondary }} />;
    }
  };
  
  return (
    <Paper
      sx={{
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        border: '1px solid',
        transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s, opacity 0.2s',
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
        ...getStatusStyles(campaign.status),
      }}
    >
      {/* Cabeçalho do Card */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
        <Box display="flex" alignItems="center" gap={1.5} overflow="hidden">
          {getChannelIcon(campaign.channel)}
          <Box overflow="hidden">
            <Typography variant="subtitle1" fontWeight="bold" noWrap color={theme.palette.text.primary}>{campaign.name}</Typography>
            <Typography variant="body2" color={theme.palette.text.secondary} noWrap>{campaign.description || t('campaignsPage.card.descriptionFallback')}</Typography>
          </Box>
        </Box>
        {/* CORREÇÃO: Funcionalidades de ação restauradas no cabeçalho */}
        <ShowcaseBlocker inline>
            <Stack direction="row">
                {['paused', 'completed', 'cancelled'].includes(campaign.status) && (
                    <Tooltip title={t('campaignsPage.card.restartTooltip')}><IconButton size="small" onClick={(e) => handleAction('restart', campaign, e)}><RestartAltIcon fontSize="small" /></IconButton></Tooltip>
                )}
                {campaign.status !== 'running' && (
                    <Tooltip title={t('campaignsPage.card.editTooltip')}><IconButton size="small" onClick={(e) => handleAction('edit', campaign, e)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                )}
                <Tooltip title={t('campaignsPage.card.duplicateTooltip')}><IconButton size="small" onClick={(e) => handleAction('duplicate', campaign, e)}><CopyAllIcon fontSize="small" /></IconButton></Tooltip>
                {['running', 'paused'].includes(campaign.status) && (
                     <Tooltip title={t('campaignsPage.card.cancelTooltip')}><IconButton size="small" onClick={(e) => handleAction('cancel', campaign, e)}><CancelIcon fontSize="small" /></IconButton></Tooltip>
                )}
                <Tooltip title={t('campaignsPage.card.deleteTooltip')}><IconButton size="small" onClick={(e) => handleAction('delete', campaign, e)}><DeleteIcon fontSize="small" color="error" /></IconButton></Tooltip>
            </Stack>
        </ShowcaseBlocker>
      </Box>

      {/* Chips de Status e Informações */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {getStatusChip(campaign.status)}
      </Box>

      {/* Estatísticas e Progresso */}
      {campaign.stats && (
        <Box sx={{ mt: 'auto' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                <Typography variant="caption" color={theme.palette.text.secondary}>{t('campaignsPage.card.progressLabel')}</Typography>
                <Typography variant="caption" fontWeight="bold" color={theme.palette.text.primary}>{campaign.stats.sent + campaign.stats.failed} / {campaign.stats.total}</Typography>
            </Box>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4, mb: 2 }} />
            <Stack direction="row" justifyContent="space-around" spacing={1} >
                <Tooltip title={t('campaignsPage.card.sentTooltip')}><Chip icon={<SentIcon />} label={campaign.stats.sent} variant="outlined" size="small" color="success" sx={{ color: theme.palette.text.primary, borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)' }} /></Tooltip>
                <Tooltip title={t('campaignsPage.card.repliesTooltip')}><Chip icon={<RepliedIcon />} label={campaign.stats.replied} variant="outlined" size="small" color="info" sx={{ color: theme.palette.text.primary, borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)' }} /></Tooltip>
                <Tooltip title={t('campaignsPage.card.failuresTooltip')}><Chip icon={<FailedIcon />} label={campaign.stats.failed} variant="outlined" size="small" color="error" sx={{ color: theme.palette.text.primary, borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)' }} /></Tooltip>
            </Stack>
        </Box>
      )}

      {/* Ações do Card */}
      <Box sx={{ pt: 2, mt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        <ShowcaseBlocker inline>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {campaign.status === 'draft' && <Button color='secondary' size="small" startIcon={<UploadIcon />} onClick={(e) => handleAction('upload', campaign, e)} sx={{ color: theme.palette.text.primary }}>{t('campaignsPage.card.importContactsButton')}</Button>}
                {(campaign.status === 'draft' || campaign.status === 'paused') && campaign.stats?.total > 0 && <GradientButton size="small" startIcon={<PlayIcon />} onClick={(e) => handleAction('start', campaign, e)} disabled={actionIsLoading}>{t('campaignsPage.card.startButton')}</GradientButton>}
                {campaign.status === 'running' && <Button color='warning' size="small" startIcon={<PauseIcon />} onClick={(e) => handleAction('pause', campaign, e)} disabled={actionIsLoading} sx={{ color: theme.palette.text.primary }}>{t('campaignsPage.card.pauseButton')}</Button>}
            </Stack>
        </ShowcaseBlocker>
      </Box>
    </Paper>
  );
};

// ==========================================================================================
//  COMPONENTE: Diálogo de Formulário da Campanha
// ==========================================================================================
const CampaignFormDialog = ({ open, onClose, onSubmit, campaign, isLoading }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      name: '', description: '', channel: 'whatsapp_official', whatsappInstance: '',
      emailSubject: '', messageTemplate: '', delayBetweenMessages: 30, dailyLimit: 100,
      followUp: { enabled: false, messageTemplate: '', delay: 24, delayUnit: 'hours', maxAttempts: 1, }
    }
  });

  const channel = watch('channel');
  const followUpEnabled = watch('followUp.enabled');
  
  const { data: officialWhatsappInstances } = useQuery('officialWhatsappInstances', () => api.get('/whatsapp/').then(res => res.data), { enabled: open });
  const { data: approvedConversationTemplates, isLoading: conversationTemplatesLoading } = useQuery('approvedConversationTemplates', () => api.get('/template-message').then(res => res.data.filter(t => t.status === 'approved' && t.templateType === 'conversation')), { enabled: open && channel === 'whatsapp_official' });
  const { data: approvedFollowUpTemplates, isLoading: followUpTemplatesLoading } = useQuery('approvedFollowUpTemplates', () => api.get('/template-message').then(res => res.data.filter(t => t.status === 'approved' && t.templateType === 'follow_up')), { enabled: open && channel === 'whatsapp_official' });
  
  const generateTemplateMutation = { isLoading: false };
  const handleGenerateTemplate = () => {
    toast.info(t('campaignsPage.toasts.generateTemplateInfo'));
    setValue("messageTemplate", "Olá {{nome}}, vimos que você se interessou pelo nosso produto!");
  };

  useEffect(() => {
    if (open) {
      if (campaign) {
        reset({ ...campaign, messageTemplate: campaign.messageTemplate?._id || campaign.messageTemplate || '', followUp: { ...campaign.followUp, messageTemplate: campaign.followUp?.messageTemplate?._id || campaign.followUp?.messageTemplate || '' } });
      } else {
        reset({ name: '', description: '', channel: 'whatsapp_official', whatsappInstance: '', emailSubject: '', messageTemplate: '', delayBetweenMessages: 30, dailyLimit: 100, followUp: { enabled: false, messageTemplate: '', delay: 24, delayUnit: 'hours', maxAttempts: 1, } });
      }
    }
  }, [campaign, open, reset]);
  
  const isEditMode = !!campaign;

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle sx={{ color: theme.palette.text.primary }}>
          {isEditMode ? t('campaignsPage.formDialog.editTitle') : t('campaignsPage.formDialog.newTitle')}
        </DialogTitle>
        <DialogContent>
            <Stack spacing={3} sx={{ pt: 2 }}>
                <Typography variant="h6" fontSize="1rem" color={theme.palette.text.primary}>{t('campaignsPage.formDialog.step1')}</Typography>
                <Controller name="name" control={control} rules={{ required: t('campaignsPage.formDialog.nameRequired') }} render={({ field }) => ( 
                  <TextField 
                    {...field} 
                    label={t('campaignsPage.formDialog.nameLabel')} 
                    error={!!errors.name} 
                    helperText={errors.name?.message} 
                    fullWidth 
                    sx={{
                      '& .MuiInputLabel-root': { color: theme.palette.text.primary },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)' },
                        '&:hover fieldset': { borderColor: theme.palette.primary.main },
                        '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                      },
                      '& .MuiInputBase-input': { color: theme.palette.text.primary },
                    }}
                  /> 
                )} />
                <Controller name="description" control={control} render={({ field }) => ( 
                  <TextField 
                    {...field} 
                    label={t('campaignsPage.formDialog.descriptionLabel')} 
                    multiline rows={2} 
                    fullWidth 
                    sx={{
                      '& .MuiInputLabel-root': { color: theme.palette.text.primary },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)' },
                        '&:hover fieldset': { borderColor: theme.palette.primary.main },
                        '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                      },
                      '& .MuiInputBase-input': { color: theme.palette.text.primary },
                    }}
                  /> 
                )} />
                <Divider sx={{ my: 2, borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)' }} />
                <Typography variant="h6" fontSize="1rem" color={theme.palette.text.primary}>{t('campaignsPage.formDialog.step2')}</Typography>
                
                {!isEditMode && ( 
                  <Controller name="channel" control={control} rules={{ required: t('campaignsPage.formDialog.channelRequired') }} render={({ field }) => ( 
                    <FormControl fullWidth error={!!errors.channel}>
                      <InputLabel sx={{ color: theme.palette.text.primary }}>{t('campaignsPage.formDialog.channelLabel')}</InputLabel>
                      <Select 
                        {...field} 
                        label={t('campaignsPage.formDialog.channelLabel')}
                        sx={{
                          color: theme.palette.text.primary,
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)' },
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main },
                        }}
                      >
                        <MenuItem value="whatsapp_official">{t('campaignsPage.formDialog.whatsappOfficial')}</MenuItem>
                        <MenuItem value="email">{t('campaignsPage.formDialog.email')}</MenuItem>
                      </Select>
                    </FormControl>
                  )} /> 
                )}
                {channel === 'whatsapp_official' && !isEditMode && ( 
                  <Controller name="whatsappInstance" control={control} rules={{ required: t('campaignsPage.formDialog.instanceRequired') }} render={({ field }) => ( 
                    <FormControl fullWidth error={!!errors.whatsappInstance}>
                      <InputLabel sx={{ color: theme.palette.text.primary }}>{t('campaignsPage.formDialog.instanceLabel')}</InputLabel>
                      <Select 
                        {...field} 
                        label={t('campaignsPage.formDialog.instanceLabel')}
                        sx={{
                          color: theme.palette.text.primary,
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)' },
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main },
                        }}
                      >
                        {officialWhatsappInstances?.map((instance) => ( 
                          <MenuItem key={instance._id} value={instance._id}>{instance.instanceName} ({instance.phoneNumber})</MenuItem> 
                        ))}
                      </Select>
                    </FormControl> 
                  )} /> 
                )}
                {channel === 'email' && ( 
                  <Controller name="emailSubject" control={control} rules={{ required: t('campaignsPage.formDialog.subjectRequired') }} render={({ field }) => ( 
                    <TextField 
                      {...field} 
                      label={t('campaignsPage.formDialog.subjectLabel')} 
                      error={!!errors.emailSubject} 
                      helperText={errors.emailSubject?.message} 
                      fullWidth 
                      sx={{
                        '& .MuiInputLabel-root': { color: theme.palette.text.primary },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)' },
                          '&:hover fieldset': { borderColor: theme.palette.primary.main },
                          '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                        },
                        '& .MuiInputBase-input': { color: theme.palette.text.primary },
                      }}
                    /> 
                  )} /> 
                )}
                {channel === 'whatsapp_official' ? ( 
                  <Controller name="messageTemplate" control={control} rules={{ required: t('campaignsPage.formDialog.templateRequired') }} render={({ field }) => ( 
                    <FormControl fullWidth error={!!errors.messageTemplate}>
                      <InputLabel sx={{ color: theme.palette.text.primary }}>{t('campaignsPage.formDialog.templateLabel')}</InputLabel>
                      <Select 
                        {...field} 
                        label={t('campaignsPage.formDialog.templateLabel')} 
                        disabled={conversationTemplatesLoading}
                        sx={{
                          color: theme.palette.text.primary,
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)' },
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main },
                        }}
                      >
                        <MenuItem value="" disabled><em style={{ color: theme.palette.text.secondary }}>{conversationTemplatesLoading ? t('campaignsPage.formDialog.loading') : t('campaignsPage.formDialog.selectTemplate')}</em></MenuItem>
                        {approvedConversationTemplates?.map((template) => ( 
                          <MenuItem key={template._id} value={template._id}>{template.name} ({template.category})</MenuItem> 
                        ))}
                      </Select>
                    </FormControl> 
                  )}/> 
                ) : ( 
                  <Controller name="messageTemplate" control={control} rules={{ required: t('campaignsPage.formDialog.messageBodyRequired') }} render={({ field }) => ( 
                    <Box sx={{ position: 'relative' }}>
                      <TextField 
                        {...field} 
                        label={t('campaignsPage.formDialog.messageBodyLabel')} 
                        multiline rows={8} 
                        error={!!errors.messageTemplate} 
                        helperText={t('campaignsPage.formDialog.messageBodyHelper')} 
                        fullWidth 
                        InputLabelProps={{ shrink: true }}
                        sx={{
                          '& .MuiInputLabel-root': { color: theme.palette.text.primary },
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)' },
                            '&:hover fieldset': { borderColor: theme.palette.primary.main },
                            '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                          },
                          '& .MuiInputBase-input': { color: theme.palette.text.primary },
                        }}
                      />
                      <Button onClick={handleGenerateTemplate} disabled={generateTemplateMutation.isLoading} size="small" variant="outlined" startIcon={generateTemplateMutation.isLoading ? <CircularProgress size={16} /> : <AutoAwesomeIcon />} sx={{ position: 'absolute', right: 14, top: 14 }} color='secondary'>{t('campaignsPage.formDialog.generateWithAiButton')}</Button>
                    </Box> 
                  )}/> 
                )}
                <Divider sx={{ my: 2, borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)' }} />
                <Typography variant="h6" fontSize="1rem" color={theme.palette.text.primary}>{t('campaignsPage.formDialog.step3')}</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Controller name="delayBetweenMessages" control={control} render={({ field }) => 
                      <TextField 
                        {...field} 
                        onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} 
                        label={t('campaignsPage.formDialog.delayLabel')} 
                        type="number" 
                        fullWidth 
                        sx={{
                          '& .MuiInputLabel-root': { color: theme.palette.text.primary },
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)' },
                            '&:hover fieldset': { borderColor: theme.palette.primary.main },
                            '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                          },
                          '& .MuiInputBase-input': { color: theme.palette.text.primary },
                        }}
                      />
                    }/>
                  </Grid>
                  <Grid item xs={6}>
                    <Controller name="dailyLimit" control={control} render={({ field }) => 
                      <TextField 
                        {...field} 
                        onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} 
                        label={t('campaignsPage.formDialog.dailyLimitLabel')} 
                        type="number" 
                        fullWidth 
                        sx={{
                          '& .MuiInputLabel-root': { color: theme.palette.text.primary },
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)' },
                            '&:hover fieldset': { borderColor: theme.palette.primary.main },
                            '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                          },
                          '& .MuiInputBase-input': { color: theme.palette.text.primary },
                        }}
                      />
                    }/>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 2, borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)' }} />
                <Typography variant="h6" fontSize="1rem" color={theme.palette.text.primary}>{t('campaignsPage.formDialog.step4')}</Typography>
                <Controller name="followUp.enabled" control={control} render={({ field }) => ( 
                  <FormControlLabel 
                    control={<Switch checked={field.value} {...field} />} 
                    label={t('campaignsPage.formDialog.enableFollowUpLabel')}
                    sx={{ color: theme.palette.text.primary }}
                  />
                )}/>
                {followUpEnabled && ( 
                  <Stack spacing={2} sx={{ mt: 1, p: 2, border: '1px solid', borderColor: theme.palette.divider, borderRadius: 1, backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.5)' }}>
                    {channel === 'whatsapp_official' ? ( 
                      <Controller name="followUp.messageTemplate" control={control} rules={{ required: followUpEnabled ? t('campaignsPage.formDialog.followUpTemplateRequired') : false }} render={({ field }) => ( 
                        <FormControl fullWidth error={!!errors.followUp?.messageTemplate}>
                          <InputLabel sx={{ color: theme.palette.text.primary }}>{t('campaignsPage.formDialog.followUpTemplateLabel')}</InputLabel>
                          <Select 
                            {...field} 
                            label={t('campaignsPage.formDialog.followUpTemplateLabel')} 
                            disabled={followUpTemplatesLoading}
                            sx={{
                              color: theme.palette.text.primary,
                              '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)' },
                              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main },
                            }}
                          >
                            <MenuItem value="" disabled><em style={{ color: theme.palette.text.secondary }}>{followUpTemplatesLoading ? t('campaignsPage.formDialog.loading') : t('campaignsPage.formDialog.selectTemplate')}</em></MenuItem>
                            {approvedFollowUpTemplates?.map((template) => ( 
                              <MenuItem key={template._id} value={template._id}>{template.name} ({template.category})</MenuItem> 
                            ))}
                          </Select>
                        </FormControl> 
                      )}/> 
                    ) : ( 
                      <Controller name="followUp.messageTemplate" control={control} rules={{ required: followUpEnabled ? t('campaignsPage.formDialog.followUpMessageRequired') : false }} render={({ field }) => ( 
                        <TextField 
                          {...field} 
                          label={t('campaignsPage.formDialog.followUpMessageLabel')} 
                          multiline rows={4} 
                          fullWidth 
                          error={!!errors.followUp?.messageTemplate} 
                          helperText={t('campaignsPage.formDialog.followUpMessageHelper')} 
                          sx={{
                            '& .MuiInputLabel-root': { color: theme.palette.text.primary },
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)' },
                              '&:hover fieldset': { borderColor: theme.palette.primary.main },
                              '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                            },
                            '& .MuiInputBase-input': { color: theme.palette.text.primary },
                          }}
                        /> 
                      )}/> 
                    )}
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <Controller name="followUp.delay" control={control} render={({ field }) => 
                          <TextField 
                            {...field} 
                            onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} 
                            label={t('campaignsPage.formDialog.waitLabel')} 
                            type="number" 
                            fullWidth 
                            sx={{
                              '& .MuiInputLabel-root': { color: theme.palette.text.primary },
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)' },
                                '&:hover fieldset': { borderColor: theme.palette.primary.main },
                                '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                              },
                              '& .MuiInputBase-input': { color: theme.palette.text.primary },
                            }}
                          />
                        } />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Controller name="followUp.delayUnit" control={control} render={({ field }) => ( 
                          <FormControl fullWidth>
                            <InputLabel sx={{ color: theme.palette.text.primary }}>{t('campaignsPage.formDialog.unitLabel')}</InputLabel>
                            <Select 
                              {...field} 
                              label={t('campaignsPage.formDialog.unitLabel')}
                              sx={{
                                color: theme.palette.text.primary,
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)' },
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main },
                              }}
                            >
                              <MenuItem value="hours">{t('campaignsPage.formDialog.hours')}</MenuItem>
                              <MenuItem value="days">{t('campaignsPage.formDialog.days')}</MenuItem>
                            </Select>
                          </FormControl> 
                        )} />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Controller name="followUp.maxAttempts" control={control} render={({ field }) => 
                          <TextField 
                            {...field} 
                            onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} 
                            label={t('campaignsPage.formDialog.attemptsLabel')} 
                            type="number" 
                            fullWidth 
                            sx={{
                              '& .MuiInputLabel-root': { color: theme.palette.text.primary },
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)' },
                                '&:hover fieldset': { borderColor: theme.palette.primary.main },
                                '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                              },
                              '& .MuiInputBase-input': { color: theme.palette.text.primary },
                            }}
                          />
                        } />
                      </Grid>
                    </Grid>
                  </Stack> 
                )}
            </Stack>
        </DialogContent>
        <DialogActions sx={{ p: '16px 24px' }}>
          <Button onClick={onClose} disabled={isLoading} color="inherit" sx={{ color: theme.palette.text.secondary }}>
            {t('common.cancel')}
          </Button>
          <GradientButton type="submit" disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} color="inherit" /> : (isEditMode ? t('campaignsPage.formDialog.saveChanges') : t('campaignsPage.formDialog.createCampaign'))}
          </GradientButton>
        </DialogActions>
      </form>
    </StyledDialog>
  );
};

// ==========================================================================================
//  COMPONENTE: Diálogo de Upload de Contatos
// ==========================================================================================
const InputFile = styled('input')({ display: 'none' });
const UploadContactsDialog = ({ open, onClose, onSubmit, isLoading, campaign }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const [csvFile, setCsvFile] = useState(null);
    const getCSVInstructions = (channel) => {
        return channel === 'email' ? t('campaignsPage.uploadDialog.requiredColumnsEmail') : t('campaignsPage.uploadDialog.requiredColumnsWhatsapp');
    }
    const handleSubmit = () => { if (csvFile) onSubmit(csvFile); };
    const handleClose = () => { setCsvFile(null); onClose(); }
    
    return (
        <StyledDialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ color: theme.palette.text.primary }}>
              {t('campaignsPage.uploadDialog.title')}
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ pt: 1 }}>
                    <Alert severity="info">
                      <strong style={{ color: theme.palette.text.primary }}>{t('campaignsPage.uploadDialog.formatInfo')}</strong>
                      <br/>{getCSVInstructions(campaign?.channel)}
                    </Alert>
                    <label htmlFor="csv-upload-button">
                        <Paper variant="outlined" sx={{ 
                          p: 4, 
                          textAlign: 'center', 
                          cursor: 'pointer', 
                          borderStyle: 'dashed', 
                          borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.5)',
                          '&:hover': { borderColor: 'primary.main', bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.7)' } 
                        }}>
                            <InputFile id="csv-upload-button" type="file" accept=".csv" onChange={(e) => setCsvFile(e.target.files[0])} />
                            <UploadIcon sx={{ fontSize: 40, mb: 1, color: theme.palette.text.secondary }} />
                            <Typography sx={{ color: theme.palette.text.primary }}>{csvFile ? csvFile.name : t('campaignsPage.uploadDialog.dropzone')}</Typography>
                            <Typography variant="caption" color={theme.palette.text.secondary}>{t('campaignsPage.uploadDialog.dropzoneCaption')}</Typography>
                        </Paper>
                    </label>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: '16px 24px' }}>
                <Button onClick={handleClose} disabled={isLoading} color="inherit" sx={{ color: theme.palette.text.secondary }}>
                  {t('common.cancel')}
                </Button>
                <GradientButton onClick={handleSubmit} disabled={!csvFile || isLoading}>
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : t('campaignsPage.uploadDialog.importButton')}
                </GradientButton>
            </DialogActions>
        </StyledDialog>
    );
}

// ==========================================================================================
//  COMPONENTE: Estado Vazio
// ==========================================================================================
const CampaignEmptyState = ({ onAction }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    
    return (
        <Paper sx={{ 
          p: 6, 
          textAlign: 'center', 
          borderRadius: 3, 
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)', 
          border: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)'
        }}>
            <CampaignIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color={theme.palette.text.primary}>{t('campaignsPage.emptyState.title')}</Typography>
            <Typography color={theme.palette.text.secondary} sx={{ mb: 3 }}>{t('campaignsPage.emptyState.message')}</Typography>
            <ShowcaseBlocker><GradientButton startIcon={<AddIcon />} onClick={onAction}>{t('campaignsPage.emptyState.button')}</GradientButton></ShowcaseBlocker>
        </Paper>
    );
};

// ==========================================================================================
//  PÁGINA PRINCIPAL: Campanhas
// ==========================================================================================
export default function Campaigns() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [dialogState, setDialogState] = useState({ create: false, edit: false, upload: false, delete: false });
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const queryClient = useQueryClient();
  const { isGuestMode } = useShowcaseContext();

  const { data: apiCampaigns, isLoading: apiIsLoading } = useQuery('campaigns', () => api.get('/campaigns').then(res => res.data), { refetchInterval: 10000, enabled: !isGuestMode });
  const campaigns = isGuestMode ? mockCampaigns.campaigns : apiCampaigns?.campaigns;
  const isLoading = isGuestMode ? false : apiIsLoading;
  
  const handleOpenDialog = (dialog, campaign = null) => {
    setSelectedCampaign(campaign);
    setDialogState(prev => ({ ...prev, [dialog]: true }));
  };

  const handleCloseDialogs = () => {
    setDialogState({ create: false, edit: false, upload: false, delete: false });
    setSelectedCampaign(null);
  };
  
  const useGenericMutation = (mutationFn, { successKey, errorKey, defaultError, onSettled }) => {
    return useMutation(mutationFn, { onSuccess: () => { queryClient.invalidateQueries('campaigns'); toast.success(t(successKey)); }, onError: (err) => toast.error(err.response?.data?.message || t(errorKey, defaultError)), onSettled, });
  };

  const createCampaignMutation = useGenericMutation(data => api.post('/campaigns', data), { successKey: 'campaignsPage.toasts.createSuccess', errorKey: 'campaignsPage.toasts.createError', defaultError: 'Erro ao criar campanha', onSettled: handleCloseDialogs });
  const updateCampaignMutation = useGenericMutation(({ campaignId, data }) => api.put(`/campaigns/${campaignId}`, data), { successKey: 'campaignsPage.toasts.updateSuccess', errorKey: 'campaignsPage.toasts.updateError', defaultError: 'Erro ao atualizar campanha', onSettled: handleCloseDialogs });
  const startCampaignMutation = useGenericMutation((campaignId) => api.post(`/campaigns/${campaignId}/start`), { successKey: 'campaignsPage.toasts.startSuccess', errorKey: 'campaignsPage.toasts.startError', defaultError: 'Erro ao iniciar campanha' });
  const pauseCampaignMutation = useGenericMutation((campaignId) => api.post(`/campaigns/${campaignId}/pause`), { successKey: 'campaignsPage.toasts.pauseSuccess', errorKey: 'campaignsPage.toasts.pauseError', defaultError: 'Erro ao pausar campanha' });
  const cancelCampaignMutation = useGenericMutation((campaignId) => api.post(`/campaigns/${campaignId}/cancel`), { successKey: 'campaignsPage.toasts.cancelSuccess', errorKey: 'campaignsPage.toasts.cancelError', defaultError: 'Erro ao cancelar campanha' });
  const duplicateCampaignMutation = useGenericMutation((campaignId) => api.post(`/campaigns/${campaignId}/duplicate`), { successKey: 'campaignsPage.toasts.duplicateSuccess', errorKey: 'campaignsPage.toasts.duplicateError', defaultError: 'Erro ao duplicar campanha' });
  const restartCampaignMutation = useGenericMutation((campaignId) => api.post(`/campaigns/${campaignId}/restart`), { successKey: 'campaignsPage.toasts.restartSuccess', errorKey: 'campaignsPage.toasts.restartError', defaultError: 'Erro ao reiniciar campanha' });
  const deleteCampaignMutation = useMutation((campaignId) => api.delete(`/campaigns/${campaignId}`), { onSuccess: () => { queryClient.invalidateQueries('campaigns'); toast.success(t('campaignsPage.toasts.deleteSuccess')); handleCloseDialogs(); }, onError: (err) => toast.error(err.response?.data?.message || t('campaignsPage.toasts.deleteError')), });

  const uploadContactsMutation = useMutation(({ campaignId, file }) => {
    const formData = new FormData();
    formData.append('csvFile', file);
    return api.post(`/campaigns/${campaignId}/contacts/upload`, formData);
  }, { onSuccess: (response) => { queryClient.invalidateQueries('campaigns'); toast.success(t('campaignsPage.toasts.importSuccess', { count: response.data.imported })); if (response.data.errors?.length > 0) { toast.warning(t('campaignsPage.toasts.importWarning', { count: response.data.totalErrors })); } handleCloseDialogs(); }, onError: (error) => toast.error(error.response?.data?.message || t('campaignsPage.toasts.importError')), });
  
  const anyActionIsLoading = startCampaignMutation.isLoading || pauseCampaignMutation.isLoading || cancelCampaignMutation.isLoading || duplicateCampaignMutation.isLoading || restartCampaignMutation.isLoading;

  const handleCardAction = (action, campaign) => {
      switch(action) {
          case 'edit': case 'upload': case 'delete': handleOpenDialog(action, campaign); break;
          case 'start': startCampaignMutation.mutate(campaign._id); break;
          case 'pause': pauseCampaignMutation.mutate(campaign._id); break;
          case 'cancel': cancelCampaignMutation.mutate(campaign._id); break;
          case 'duplicate': duplicateCampaignMutation.mutate(campaign._id); break;
          case 'restart': restartCampaignMutation.mutate(campaign._id); break;
          default: console.error('Ação desconhecida:', action);
      }
  };

  const onSubmitForm = (data) => {
      const mutationData = { ...data, delayBetweenMessages: Number(data.delayBetweenMessages) || 0, dailyLimit: Number(data.dailyLimit) || 0, followUp: { ...data.followUp, delay: Number(data.followUp.delay) || 0, maxAttempts: Number(data.followUp.maxAttempts) || 0 } };
      if (dialogState.create) { createCampaignMutation.mutate(mutationData); } else { updateCampaignMutation.mutate({ campaignId: selectedCampaign._id, data: mutationData }); }
  };
  const onSubmitUpload = (file) => uploadContactsMutation.mutate({ campaignId: selectedCampaign._id, file });
  const onDeleteConfirm = () => { if (selectedCampaign) deleteCampaignMutation.mutate(selectedCampaign._id); };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Paper sx={{ 
          p: 2, 
          mb: 3, 
          borderRadius: 3, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)', 
          border: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)'
        }}>
            <Typography variant="h4" fontWeight="bold" color={theme.palette.text.primary}>{t('campaignsPage.title')}</Typography>
            <ShowcaseBlocker inline><GradientButton startIcon={<AddIcon />} onClick={() => handleOpenDialog('create')}>{t('campaignsPage.newCampaignButton')}</GradientButton></ShowcaseBlocker>
        </Paper>

        {isLoading && <LinearProgress sx={{ mb: 3 }} />}

        {!isLoading && campaigns?.length > 0 ? (
            <Grid container spacing={3}>
            {campaigns.map((campaign) => (
                <Grid item xs={12} md={6} lg={4} key={campaign._id}>
                <CampaignCard campaign={campaign} onAction={handleCardAction} actionIsLoading={anyActionIsLoading} />
                </Grid>
            ))}
            </Grid>
        ) : !isLoading && (<CampaignEmptyState onAction={() => handleOpenDialog('create')} />)}
        
        <CampaignFormDialog open={dialogState.create || dialogState.edit} onClose={handleCloseDialogs} onSubmit={onSubmitForm} campaign={dialogState.edit ? selectedCampaign : null} isLoading={createCampaignMutation.isLoading || updateCampaignMutation.isLoading} />
        <UploadContactsDialog open={dialogState.upload} onClose={handleCloseDialogs} onSubmit={onSubmitUpload} campaign={selectedCampaign} isLoading={uploadContactsMutation.isLoading} />
        
        <StyledDialog open={dialogState.delete} onClose={handleCloseDialogs} maxWidth="xs">
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WarningIcon color="error" />
                <Typography variant="h6" color={theme.palette.text.primary}>
                  {t('campaignsPage.deleteDialog.title')}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Typography color={theme.palette.text.primary}>
                    <Trans i18nKey="campaignsPage.deleteDialog.message" values={{ campaignName: selectedCampaign?.name }}>
                        Tem certeza que deseja deletar a campanha <strong>"{selectedCampaign?.name}"</strong>?
                    </Trans>
                </Typography>
                <Alert severity="error" sx={{ mt: 2 }}>{t('campaignsPage.deleteDialog.warning')}</Alert>
            </DialogContent>
            <DialogActions sx={{ p: '16px 24px' }}>
                <Button onClick={handleCloseDialogs} disabled={deleteCampaignMutation.isLoading} color="inherit" sx={{ color: theme.palette.text.secondary }}>
                  {t('common.cancel')}
                </Button>
                <GradientButton onClick={onDeleteConfirm} color="error" disabled={deleteCampaignMutation.isLoading} sx={{ background: theme.palette.error.main }}>
                    {deleteCampaignMutation.isLoading ? <CircularProgress size={24} color="inherit" /> : t('campaignsPage.deleteDialog.deleteButton')}
                </GradientButton>
            </DialogActions>
        </StyledDialog>
    </Box>
  );
}