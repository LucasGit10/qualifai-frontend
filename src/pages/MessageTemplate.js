import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box, Typography, Button, Paper, DialogTitle, DialogContent,
  DialogActions, TextField, Card, CardContent, CardActions, Chip, Alert,
  Grid, LinearProgress, FormControl, InputLabel, Select, MenuItem,
  IconButton, Tooltip, Stack, CardHeader, Divider,
  Switch, FormControlLabel, Tabs, Tab, useTheme, alpha
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Send as SendIcon, CheckCircle as ApprovedIcon, HighlightOff as RejectedIcon,
  HourglassEmpty as PendingIcon, Drafts as DraftIcon, Notes as TemplateIcon,
  Close as CloseIcon, WarningAmber as WarningIcon,
  DeleteForever as DeleteForeverIcon
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useTranslation, Trans } from 'react-i18next';
import api from '../services/api';
import socket from '../services/socket';
import MetaPricingTable from '../components/templates/MetaPricingTable';
import { StyledDialog } from '../components/ui/StyledDialog';
import { GradientButton } from '../components/ui/GradientButton';

// -- Funções Auxiliares --
const formatTemplateNameForDisplay = (name) => { if (!name) return ''; return name.split('_v')[0]; };
const applyNameMask = (value) => { if (!value) return ''; return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''); };

// ==========================================================================================
//  COMPONENTE: Diálogo de Formulário (Estilo Vidro)
// ==========================================================================================
const TemplateFormDialog = ({ open, onClose, onSubmit, template, isLoading }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: { name: '', category: 'MARKETING', language: 'pt_BR', bodyText: '', templateType: 'conversation' }
  });
  const selectedCategory = watch('category');

  useEffect(() => {
    if (open) {
      if (template) {
        reset({ name: formatTemplateNameForDisplay(template.name), category: template.category, language: template.language, bodyText: template.components?.find(c => c.type === 'BODY')?.text || '', templateType: template.templateType || 'conversation' });
      } else {
        reset({ name: '', category: 'MARKETING', language: 'pt_BR', bodyText: '', templateType: 'conversation' });
      }
    }
  }, [template, open, reset]);

  const isEditMode = !!template;
  const submitButtonText = isEditMode && template?.status === 'rejected' ? t('templatesPage.formDialog.correctAndResubmit') : (isEditMode ? t('templatesPage.formDialog.saveChanges') : t('templatesPage.formDialog.createTemplate'));

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="lg" fullWidth component="form" onSubmit={handleSubmit(onSubmit)}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'text.primary', pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 40, height: 40, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.15) 0%, rgba(33, 203, 243, 0.05) 100%)', color: '#21CBF3', border: '1px solid rgba(33, 203, 243, 0.2)' }}>
            <TemplateIcon />
          </Box>
          <Typography variant="h6" fontWeight="bold">
            {isEditMode ? t('templatesPage.formDialog.editTitle') : t('templatesPage.formDialog.newTitle')}
          </Typography>
        </Box>
        <IconButton aria-label="close" onClick={onClose} sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <Grid container spacing={3} sx={{ pt: 1 }}>
          <Grid item xs={12} md={7}>
            <Stack spacing={3}>
              <Alert severity="info" variant="outlined" sx={{ borderColor: 'info.light', color: 'text.primary', bgcolor: theme.palette.mode === 'dark' ? 'rgba(2, 136, 209, 0.1)' : 'rgba(2, 136, 209, 0.05)', borderRadius: 2 }}>
                {t('templatesPage.formDialog.infoAlert')}
              </Alert>

              {/* Bloco 1: Configurações Gerais */}
              <Box sx={{ p: 3, borderRadius: 3, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)', border: '1px solid', borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="700" sx={{ mb: 3, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.7rem' }}>
                  ⚙️ Configurações Gerais
                </Typography>
                
                <Stack spacing={2.5}>
                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: t('templatesPage.formDialog.nameRequired') }}
                    render={({ field: { onChange, ...restField } }) => (
                      <TextField {...restField} label={t('templatesPage.formDialog.nameLabel')} error={!!errors.name} helperText={errors.name?.message} onChange={(e) => onChange(applyNameMask(e.target.value))} fullWidth sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' }, '&:hover fieldset': { borderColor: 'primary.main' } } }} />
                    )}
                  />
                  <Controller
                    name="templateType"
                    control={control}
                    rules={{ required: t('templatesPage.formDialog.typeRequired') }}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel sx={{ color: 'text.secondary' }}>{t('templatesPage.formDialog.typeLabel')}</InputLabel>
                        <Select {...field} label={t('templatesPage.formDialog.typeLabel')} sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' } }}>
                          <MenuItem value="conversation">{t('templatesPage.formDialog.typeConversation')}</MenuItem>
                          <MenuItem value="follow_up">{t('templatesPage.formDialog.typeFollowUp')}</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="category"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <FormControl fullWidth>
                            <InputLabel sx={{ color: 'text.secondary' }}>{t('templatesPage.formDialog.categoryLabel')}</InputLabel>
                            <Select {...field} label={t('templatesPage.formDialog.categoryLabel')} sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' } }}>
                              <MenuItem value="MARKETING">{t('templatesPage.formDialog.categoryMarketing')}</MenuItem>
                              <MenuItem value="UTILITY">{t('templatesPage.formDialog.categoryUtility')}</MenuItem>
                              <MenuItem value="AUTHENTICATION">{t('templatesPage.formDialog.categoryAuth')}</MenuItem>
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="language"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <FormControl fullWidth>
                            <InputLabel sx={{ color: 'text.secondary' }}>{t('templatesPage.formDialog.languageLabel')}</InputLabel>
                            <Select {...field} label={t('templatesPage.formDialog.languageLabel')} sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' } }}>
                              <MenuItem value="pt_BR">{t('templatesPage.formDialog.langPtBr')}</MenuItem>
                              <MenuItem value="en_US">{t('templatesPage.formDialog.langEnUs')}</MenuItem>
                              <MenuItem value="es_ES">{t('templatesPage.formDialog.langEsEs')}</MenuItem>
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>
                  </Grid>
                </Stack>
              </Box>

              {/* Bloco 2: Corpo da Mensagem */}
              <Box sx={{ p: 3, borderRadius: 3, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)', border: '1px solid', borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="700" sx={{ mb: 3, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.7rem' }}>
                  ✍️ Composição da Mensagem
                </Typography>
                <Controller
                  name="bodyText"
                  control={control}
                  rules={{ required: t('templatesPage.formDialog.bodyRequired') }}
                  render={({ field }) => (
                    <TextField 
                      {...field} 
                      label={t('templatesPage.formDialog.bodyLabel')} 
                      multiline rows={8} 
                      error={!!errors.bodyText} 
                      helperText={errors.bodyText?.message || t('templatesPage.formDialog.bodyHelper')} 
                      fullWidth 
                      sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' }, '&:hover fieldset': { borderColor: 'primary.main' } } }} 
                    />
                  )}
                />
              </Box>

            </Stack>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box sx={{ position: 'sticky', top: 0 }}>
              <Paper sx={{
                p: 2,
                borderRadius: 3,
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'background.paper',
                border: '1px solid',
                borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'divider',
                boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 4px 12px rgba(0,0,0,0.05)'
              }}>
                <MetaPricingTable selectedCategory={selectedCategory} />
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px', justifyContent: 'space-between' }}>
        <Button onClick={onClose} disabled={isLoading} color="inherit" sx={{ color: 'text.secondary' }}>
          {t('common.cancel')}
        </Button>
        <GradientButton type="submit" disabled={isLoading} sx={{ px: 4 }}>
          {submitButtonText}
        </GradientButton>
      </DialogActions>
    </StyledDialog>
  );
};

// ==========================================================================================
//  COMPONENTE: Card de Template (Novo Estilo Limpo)
// ==========================================================================================
const TemplateCard = ({ template, onAction }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const bodyComponent = template.components?.find(c => c.type === 'BODY');
  const displayName = formatTemplateNameForDisplay(template.name);

  const getStatusIcon = (status) => {
    const iconProps = { sx: { fontSize: '1.1rem' } };
    switch (status) {
      case 'approved': return <ApprovedIcon {...iconProps} />;
      case 'rejected': return <RejectedIcon {...iconProps} />;
      case 'pending_approval': return <PendingIcon {...iconProps} />;
      default: return <DraftIcon {...iconProps} />;
    }
  };

  const getStatusStyles = (status) => {
    const baseHover = { transform: 'translateY(-4px)', borderColor: 'primary.main' };
    switch (status) {
      case 'approved': return { borderColor: 'success.main', '&:hover': { ...baseHover, boxShadow: `0 6px 16px 4px ${alpha(theme.palette.success.main, 0.4)}` } };
      case 'rejected': return { borderColor: 'error.main', '&:hover': { ...baseHover, boxShadow: `0 6px 16px 4px ${alpha(theme.palette.error.main, 0.4)}` } };
      case 'pending_approval': return { borderColor: 'warning.main', '&:hover': { ...baseHover, boxShadow: `0 6px 16px 4px ${alpha(theme.palette.warning.main, 0.4)}` } };
      default: return { '&:hover': { ...baseHover, boxShadow: `0 6px 16px 4px ${alpha(theme.palette.grey[500], 0.2)}` } };
    }
  };

  return (
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 3,
      transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
      border: `1px solid ${theme.palette.divider}`,
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'background.paper',
      backdropFilter: theme.palette.mode === 'dark' ? 'blur(10px)' : 'none',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[6],
        borderColor: 'primary.main'
      },
      ...getStatusStyles(template.status),
    }}>
      <CardHeader
        action={
          <Stack direction="row">
            {['draft', 'rejected'].includes(template.status) && (
              <Tooltip title={t('templatesPage.card.editTooltip')}>
                <IconButton
                  size="small"
                  onClick={() => onAction('edit', template)}
                  sx={{ color: 'text.secondary' }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {['draft', 'rejected', 'pending_approval'].includes(template.status) && (
              <Tooltip title={t('templatesPage.card.deleteTooltip')}>
                <IconButton
                  size="small"
                  onClick={() => onAction('delete', template)}
                  sx={{ color: 'error.main' }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        }
        title={
          <Typography
            variant="subtitle1" fontWeight="bold" noWrap sx={{ color: 'text.primary' }}>
            {displayName}
          </Typography>
        }
        subheader={
          <Chip
            icon={getStatusIcon(template.status)}
            label={t(`templatesPage.status.${template.status.toLowerCase()}`)}
            color={template.status === 'approved' ? 'success' : template.status === 'rejected' ? 'error' : template.status === 'pending_approval' ? 'warning' : 'default'}
            size="small"
            sx={{ mt: 0.5 }}
          />
        }
      />
      <CardContent sx={{ flexGrow: 1, pt: 0 }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('templatesPage.card.categoryLabel')} {template.category}
            </Typography>
            <Chip
              label={template.templateType === 'follow_up' ? t('templatesPage.card.followUpChip') : t('templatesPage.card.conversationChip')}
              size="small"
              variant="outlined"
            />
          </Stack>
          <Typography
            variant="body2"
            sx={{
              whiteSpace: 'pre-wrap',
              maxHeight: 150,
              overflowY: 'auto',
              p: 1.5,
              borderRadius: 1,
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: 'action.hover',
              color: 'text.primary'
            }}
          >
            {bodyComponent?.text || t('templatesPage.card.noBodyText')}
          </Typography>
          {template.status === 'rejected' && (<Alert severity="error" variant="outlined">
            {t('templatesPage.card.rejectionReason')} {template.rejectionReason || t('templatesPage.card.notSpecified')}
          </Alert>
          )}
        </Stack>
      </CardContent>
      {template.status === 'draft' && (
        <CardActions sx={{ p: 2, mt: 'auto' }}>
          <GradientButton
            fullWidth
            size="small"
            startIcon={<SendIcon />}
            onClick={() => onAction('submit', template)}>
            {t('templatesPage.card.submitButton')}
          </GradientButton>
        </CardActions>
      )}
    </Card>
  );
};

// ==========================================================================================
//  OUTROS DIÁLOGOS (Estilo Vidro)
// ==========================================================================================
const SubmitApprovalDialog = ({ open, onClose, onSubmit, isLoading, template }) => {
  const { t } = useTranslation();
  const [instanceId, setInstanceId] = useState('');
  const { data: instances, isLoading: instancesLoading } = useQuery('officialWhatsappInstances', async () => {
    if (USE_MOCKS) return [{ _id: '1', instanceName: 'WhatsApp Cobrança', phoneNumber: '+55 11 99999-9999' }];
    const res = await api.get('/whatsapp/');
    return res.data;
  }, { enabled: open });
  const handleSubmit = () => { if (!instanceId) { toast.error(t('templatesPage.toasts.selectInstance')); return; } onSubmit(instanceId); };
  return (<StyledDialog open={open} onClose={onClose} maxWidth="xs" fullWidth><DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}><SendIcon />{t('templatesPage.submitDialog.title')}</DialogTitle><DialogContent dividers sx={{ borderColor: 'rgba(255,255,255,0.08)' }}><Stack spacing={2} sx={{ pt: 2 }}><Typography><Trans i18nKey="templatesPage.submitDialog.description" values={{ templateName: formatTemplateNameForDisplay(template?.name) }}>Selecione a instância para submeter o template <Typography component="span" fontWeight="bold">"{formatTemplateNameForDisplay(template?.name)}"</Typography> à Meta.</Trans></Typography><FormControl fullWidth><InputLabel>{t('templatesPage.submitDialog.instanceLabel')}</InputLabel><Select value={instanceId} label={t('templatesPage.submitDialog.instanceLabel')} onChange={(e) => setInstanceId(e.target.value)} disabled={instancesLoading} sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' } }}>{instances?.map((instance) => (<MenuItem key={instance._id} value={instance._id}>{instance.instanceName} ({instance.phoneNumber})</MenuItem>))}</Select>{instancesLoading && <Typography variant="caption" sx={{ mt: 1 }}>{t('templatesPage.submitDialog.loadingInstances')}</Typography>}</FormControl></Stack></DialogContent><DialogActions sx={{ p: '16px 24px' }}><Button onClick={onClose} color="inherit" disabled={isLoading} sx={{ color: 'text.secondary' }}>{t('common.cancel')}</Button><GradientButton onClick={handleSubmit} loading={isLoading} disabled={!instanceId}>{t('templatesPage.submitDialog.sendButton')}</GradientButton></DialogActions></StyledDialog>);
};

const DeleteConfirmationDialog = ({ open, onClose, onConfirm, isLoading, templateName }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  return (<StyledDialog open={open} onClose={onClose} maxWidth="xs" fullWidth><DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}><WarningIcon />{t('templatesPage.deleteDialog.title')}</DialogTitle><DialogContent sx={{ textAlign: 'center' }}><DeleteForeverIcon sx={{ fontSize: 60, color: 'error.light', mb: 2 }} /><Typography><Trans i18nKey="templatesPage.deleteDialog.message" values={{ templateName: formatTemplateNameForDisplay(templateName) }}>Você está prestes a deletar o template <Typography component="span" fontWeight="bold">"{formatTemplateNameForDisplay(templateName)}"</Typography>.</Trans></Typography><Alert severity="error" sx={{ mt: 2, textAlign: 'left' }}>{t('templatesPage.deleteDialog.warning')}</Alert></DialogContent><DialogActions sx={{ p: '16px 24px' }}><Button onClick={onClose} disabled={isLoading} color="inherit">{t('common.cancel')}</Button><GradientButton onClick={onConfirm} loading={isLoading} color="error" sx={{ background: theme.palette.error.main }}>{t('templatesPage.deleteDialog.deleteButton')}</GradientButton></DialogActions></StyledDialog>);
};

const TemplateEmptyState = ({ onAction }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  return (<Paper sx={{
    p: 6, textAlign: 'center', borderRadius: 3,
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'background.paper',
    backdropFilter: theme.palette.mode === 'dark' ? 'blur(10px)' : 'none',
    border: `1px solid ${theme.palette.divider}`
  }}><TemplateIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} /><Typography variant="h6" color="text.primary">{t('templatesPage.emptyState.title')}</Typography><Typography color="text.secondary" sx={{ mb: 3 }}>{t('templatesPage.emptyState.message')}</Typography><GradientButton startIcon={<AddIcon />} onClick={onAction}>{t('templatesPage.emptyState.button')}</GradientButton></Paper>);
};

// ==========================================================================================
//  PÁGINA PRINCIPAL
// ==========================================================================================
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (<div role="tabpanel" hidden={value !== index} id={`template-tabpanel-${index}`} aria-labelledby={`template-tab-${index}`} {...other}>{value === index && (<Box sx={{ pt: 3 }}>{children}</Box>)}</div>);
}
function a11yProps(index) { return { id: `template-tab-${index}`, 'aria-controls': `template-tabpanel-${index}` }; }

export default function MessageTemplates() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [dialogState, setDialogState] = useState({ create: false, edit: false, submit: false, delete: false });
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [correctedData, setCorrectedData] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const queryClient = useQueryClient();
  const { data: templates, isLoading } = useQuery('messageTemplates', async () => {
    if (USE_MOCKS) return MOCK_TEMPLATES;
    const res = await api.get('/template-message');
    return res.data;
  });

  const { conversationTemplates, followUpTemplates } = useMemo(() => {
    if (!templates) return { conversationTemplates: [], followUpTemplates: [] };
    const conversation = templates.filter(t => t.templateType !== 'follow_up');
    const followUp = templates.filter(t => t.templateType === 'follow_up');
    return { conversationTemplates: conversation, followUpTemplates: followUp };
  }, [templates]);

  const handleTabChange = (event, newValue) => { setCurrentTab(newValue); };

  useEffect(() => {
    const handleTemplateUpdate = (updatedTemplate) => { toast.info(t('templatesPage.toasts.statusUpdate', { templateName: formatTemplateNameForDisplay(updatedTemplate.name) })); queryClient.invalidateQueries('messageTemplates'); };
    socket.on('template_status_updated', handleTemplateUpdate);
    return () => { socket.off('template_status_updated', handleTemplateUpdate); };
  }, [queryClient, t]);

  const createTemplateMutation = useMutation((data) => api.post('/template-message', data), { onSuccess: () => { queryClient.invalidateQueries('messageTemplates'); toast.success(t('templatesPage.toasts.templateSaved')); handleCloseDialogs(); }, onError: (err) => toast.error(err.response?.data?.message || t('templatesPage.toasts.templateSaveError')), });
  const updateTemplateMutation = useMutation(({ templateId, data }) => api.put(`/template-message/${templateId}`, data), { onSuccess: () => { queryClient.invalidateQueries('messageTemplates'); toast.success(t('templatesPage.toasts.templateUpdated')); handleCloseDialogs(); }, onError: (err) => toast.error(err.response?.data?.message || t('templatesPage.toasts.templateUpdateError')), });
  const deleteTemplateMutation = useMutation((templateId) => api.delete(`/template-message/${templateId}`), { onSuccess: () => { queryClient.invalidateQueries('messageTemplates'); toast.success(t('templatesPage.toasts.templateDeleted')); handleCloseDialogs(); }, onError: (err) => toast.error(err.response?.data?.message || t('templatesPage.toasts.templateDeleteError')), });
  const submitTemplateMutation = useMutation(({ templateId, whatsappInstanceId }) => api.post(`/template-message/${templateId}/submit`, { whatsappInstanceId }), { onSuccess: () => { queryClient.invalidateQueries('messageTemplates'); toast.success(t('templatesPage.toasts.templateSubmitted')); handleCloseDialogs(); }, onError: (err) => toast.error(err.response?.data?.message || t('templatesPage.toasts.templateSubmitError')), });
  const resubmitTemplateMutation = useMutation(({ templateId, payload }) => api.post(`/template-message/${templateId}/resubmit`, payload), { onSuccess: (response) => { queryClient.invalidateQueries('messageTemplates'); toast.success(response.data.message || t('templatesPage.toasts.templateResubmitted')); handleCloseDialogs(); }, onError: (err) => toast.error(err.response?.data?.message || t('templatesPage.toasts.templateResubmitError')), });

  const handleOpenDialog = (dialog, template = null) => { setSelectedTemplate(template); setDialogState(prev => ({ ...prev, [dialog]: true })); };
  const handleCloseDialogs = () => { setDialogState({ create: false, edit: false, submit: false, delete: false }); setSelectedTemplate(null); setCorrectedData(null); };
  const handleCardAction = (action, template) => { if (['edit', 'submit', 'delete'].includes(action)) { handleOpenDialog(action, template); } };
  const formatPayload = (formData) => ({ name: formData.name, category: formData.category, language: formData.language, templateType: formData.templateType, components: [{ type: 'BODY', text: formData.bodyText }] });

  const handleFormSubmit = (formData) => {
    const payload = formatPayload(formData);
    if (dialogState.create) { createTemplateMutation.mutate(payload); }
    else if (selectedTemplate?.status === 'draft') { updateTemplateMutation.mutate({ templateId: selectedTemplate._id, data: payload }); }
    else if (selectedTemplate?.status === 'rejected') { setCorrectedData(payload); setDialogState({ create: false, edit: false, submit: true, delete: false }); }
  };

  const onSubmitApproval = (whatsappInstanceId) => { if (!selectedTemplate) return; if (correctedData) { resubmitTemplateMutation.mutate({ templateId: selectedTemplate._id, payload: { ...correctedData, whatsappInstanceId } }); } else { submitTemplateMutation.mutate({ templateId: selectedTemplate._id, whatsappInstanceId }); } };
  const onDeleteConfirm = () => { if (!selectedTemplate) return; deleteTemplateMutation.mutate(selectedTemplate._id); };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Paper sx={{
        p: 2,
        mb: 3,
        borderRadius: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'background.paper',
        backdropFilter: theme.palette.mode === 'dark' ? 'blur(10px)' : 'none',
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.shadows[2]
      }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: 'text.primary' }}>
          {t('templatesPage.title')}
        </Typography>
        <GradientButton
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('create')}
        >
          {t('templatesPage.newTemplateButton')}
        </GradientButton>
      </Paper>

      {isLoading && <LinearProgress sx={{ mb: 3 }} />}

      {!isLoading && templates?.length === 0 ? (
        <Box sx={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          py: 8, px: 2, mt: 4, borderRadius: 4,
          border: '1px dashed',
          borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
          backdropFilter: theme.palette.mode === 'dark' ? 'blur(10px)' : 'none'
        }}>
          <Box sx={{
            width: 80, height: 80, mb: 3, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 203, 243, 0.05) 100%)',
            color: '#2196f3'
          }}>
            <TemplateIcon sx={{ fontSize: 40 }} />
          </Box>
          <Typography variant="h5" fontWeight="700" color="text.primary" gutterBottom>
            Nenhum template encontrado
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center', maxWidth: 400 }}>
            Você ainda não possui templates de mensagem criados no QualifAI. Crie seu primeiro template para padronizar suas abordagens.
          </Typography>
          <GradientButton
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('create')}
            sx={{ px: 4, py: 1.5 }}
          >
            Criar meu primeiro Template
          </GradientButton>
        </Box>
      ) : !isLoading && (
        <Box>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              aria-label="Abas de templates"
              sx={{
                '& .MuiTab-root': {
                  color: 'text.secondary',
                  '&.Mui-selected': {
                    color: 'primary.main'
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: 'primary.main'
                }
              }}
            >
              <Tab label={t('templatesPage.tabs.conversation')} {...a11yProps(0)} />
              <Tab label={t('templatesPage.tabs.followUp')} {...a11yProps(1)} />
            </Tabs>
          </Box>
          <TabPanel value={currentTab} index={0}>
            {conversationTemplates.length > 0 ? (
              <Grid container spacing={3}>
                {conversationTemplates.map((template) => (
                  <Grid item xs={12} md={6} lg={4} key={template._id}>
                    <TemplateCard template={template} onAction={handleCardAction} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography sx={{ color: 'text.secondary', mt: 4, textAlign: 'center' }}>
                {t('templatesPage.noConversationTemplates')}
              </Typography>
            )}
          </TabPanel>
          <TabPanel value={currentTab} index={1}>
            {followUpTemplates.length > 0 ? (
              <Grid container spacing={3}>
                {followUpTemplates.map((template) => (
                  <Grid item xs={12} md={6} lg={4} key={template._id}>
                    <TemplateCard template={template} onAction={handleCardAction} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography sx={{ color: 'text.secondary', mt: 4, textAlign: 'center' }}>
                {t('templatesPage.noFollowUpTemplates')}
              </Typography>
            )}
          </TabPanel>
        </Box>
      )}

      <TemplateFormDialog
        open={dialogState.create || dialogState.edit}
        onClose={handleCloseDialogs}
        onSubmit={handleFormSubmit}
        template={dialogState.edit ? selectedTemplate : null}
        isLoading={createTemplateMutation.isLoading || updateTemplateMutation.isLoading || resubmitTemplateMutation.isLoading}
      />
      <SubmitApprovalDialog
        open={dialogState.submit}
        onClose={handleCloseDialogs}
        onSubmit={onSubmitApproval}
        isLoading={submitTemplateMutation.isLoading || resubmitTemplateMutation.isLoading}
        template={selectedTemplate}
      />
      <DeleteConfirmationDialog
        open={dialogState.delete}
        onClose={handleCloseDialogs}
        onConfirm={onDeleteConfirm}
        isLoading={deleteTemplateMutation.isLoading}
        templateName={selectedTemplate?.name}
      />
    </Box>
  );
}