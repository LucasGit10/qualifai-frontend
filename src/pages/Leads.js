import React, { useState, useEffect, forwardRef, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useLocation } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import {
  Box, Typography, Button, Paper, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem, Chip, IconButton, Tooltip, Grid,
  CircularProgress, Card, CardContent, InputAdornment, useTheme, Menu, ListItemIcon, ListItemText,
  FormControlLabel, Switch, useMediaQuery, Badge, Skeleton, Pagination, Divider
} from '@mui/material';
import {
  Add as AddIcon, Chat as ChatIcon, Edit as EditIcon, Delete as DeleteIcon, Sync as SyncIcon,
  Email as EmailIcon, GetApp as GetAppIcon, Search as SearchIcon, AddCircleOutline as AddCircleOutlineIcon,
  FileUpload as FileUploadIcon, Send as SendIcon, MoreVert as MoreVertIcon, Close as CloseIcon, FilterList as FilterListIcon,
  Business as BusinessIcon, RequestQuote as RequestQuoteIcon
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { IMaskInput } from 'react-imask';
import { useTranslation } from 'react-i18next';

import api from '../services/api';
import { useShowcaseContext } from '../contexts/ShowcaseContext';
import { MOCK_DEBTORS } from '../mocks';
import { USE_MOCKS } from '../config/env';
import ShowcaseBlocker from '../components/Showcase/ShowcaseBlocker';
import ImportFileDialog from '../components/ImportFileDialog';
import DebtManagementDialog from '../components/DebtManagementDialog';

import { StyledDialog } from '../components/ui/StyledDialog';
import { GradientButton } from '../components/ui/GradientButton';

// --- IMPORTAÇÃO ADICIONAL PARA O TOUR ---
import { useTour } from '../contexts/TourContext';

// --- COMPONENTES AUXILIARES ---
const PhoneMaskAdapter = forwardRef(function PhoneMaskAdapter(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="+00 (00) 00000-0000"
      definitions={{ '#': /[1-9]/ }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

const TemplateSelectionModal = ({ open, onClose, onConfirm, leadsToContact, isLoadingConfirm }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [selectedInstanceId, setSelectedInstanceId] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');

  const { data: instances, isLoading: isLoadingInstances } = useQuery('whatsappInstances', () => api.get('/whatsapp/').then(res => res.data), { enabled: open });
  const { data: templates, isLoading: isLoadingTemplates } = useQuery('messageTemplates', () => api.get('/template-message').then(res => res.data), { enabled: open });

  const handleConfirm = () => {
    if (!selectedInstanceId || !selectedTemplateId) {
      toast.warn(t('leadsPage.toasts.selectInstanceAndTemplate'));
      return;
    }
    onConfirm({ instanceId: selectedInstanceId, templateId: selectedTemplateId, leads: leadsToContact });
  };

  useEffect(() => {
    if (!open) {
      setSelectedInstanceId('');
      setSelectedTemplateId('');
    }
  }, [open]);

  const selectStyles = {
    '& fieldset': { borderColor: theme.palette.divider },
    '&:hover fieldset': { borderColor: 'primary.main' },
    '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main, borderWidth: '2px' },
    '& .MuiSvgIcon-root': { color: 'text.primary' },
    color: 'text.primary'
  };

  return (
    <StyledDialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('leadsPage.templateModal.title')}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography>{t('leadsPage.templateModal.description', { count: leadsToContact.length })}</Typography>
          <FormControl fullWidth disabled={isLoadingInstances}>
            <InputLabel>{t('leadsPage.templateModal.instanceLabel')}</InputLabel>
            <Select value={selectedInstanceId} label={t('leadsPage.templateModal.instanceLabel')} onChange={(e) => setSelectedInstanceId(e.target.value)} sx={selectStyles}>
              {isLoadingInstances && <MenuItem value=""><em>{t('leadsPage.templateModal.loading')}</em></MenuItem>}
              {instances?.map(instance => (<MenuItem key={instance._id} value={instance._id}>{instance.instanceName} ({instance.phoneNumber})</MenuItem>))}
            </Select>
          </FormControl>
          <FormControl fullWidth disabled={isLoadingTemplates}>
            <InputLabel>{t('leadsPage.templateModal.templateLabel')}</InputLabel>
            <Select value={selectedTemplateId} label={t('leadsPage.templateModal.templateLabel')} onChange={(e) => setSelectedTemplateId(e.target.value)} sx={selectStyles}>
              {isLoadingTemplates && <MenuItem value=""><em>{t('leadsPage.templateModal.loading')}</em></MenuItem>}
              {templates?.map(template => (<MenuItem key={template._id} value={template._id}>{template.name}</MenuItem>))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" sx={{ color: 'text.secondary', '&:hover': { backgroundColor: 'action.hover', color: 'text.primary' } }}>{t('common.cancel')}</Button>
        <GradientButton onClick={handleConfirm} startIcon={isLoadingConfirm ? <CircularProgress size={20} color="inherit" /> : <SendIcon />} disabled={isLoadingConfirm} sx={{ background: 'linear-gradient(45deg, #2196F3, #21CBF3)', color: 'white', '&:hover': { background: 'linear-gradient(45deg, #1976D2, #00ACC1)' }, '&:disabled': { background: 'grey.300', color: 'grey.500' } }}>{t('leadsPage.templateModal.sendButton')}</GradientButton>
      </DialogActions>
    </StyledDialog>
  );
};

const MobileLeadCard = ({ lead, statusColor, onOpenMenu, t, transparentPaperStyle }) => (
  <Card sx={{ ...transparentPaperStyle, p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', height: '100%' }}>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, minWidth: 0 }}>
      <Typography variant="subtitle2" component="div" fontWeight="bold" noWrap sx={{ fontSize: '0.85rem' }}>
        {lead.name}
      </Typography>
      <Chip
        label={t(`dashboard.funnelLabels.${lead.status.toLowerCase()}`, lead.status)}
        sx={{ backgroundColor: statusColor, color: 'white', height: 20, fontSize: '0.65rem' }}
        size="small"
      />
      <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'flex', alignItems: 'center', gap: 0.5, pt: 0.5, fontSize: '0.65rem' }}>
        <EmailIcon sx={{ fontSize: 12 }} /> {lead.email || 'N/A'}
      </Typography>
      <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.65rem' }}>
        <BusinessIcon sx={{ fontSize: 12 }} /> {lead.company || 'N/A'}
      </Typography>
    </Box>
    <IconButton size="small" onClick={(event) => onOpenMenu(event, lead)}>
      <MoreVertIcon fontSize="small" />
    </IconButton>
  </Card>
);

const MobileLeadCardSkeleton = ({ transparentPaperStyle }) => (
  <Card sx={{ ...transparentPaperStyle, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
    <Box>
      <Skeleton variant="text" width={150} height={32} />
      <Skeleton variant="rectangular" width={80} height={22} sx={{ mt: 1, borderRadius: '16px' }} />
      <Skeleton variant="text" width={180} height={20} sx={{ mt: 2 }} />
      <Skeleton variant="text" width={120} height={20} />
    </Box>
    <Skeleton variant="circular" width={40} height={40} />
  </Card>
);


// --- COMPONENTE PRINCIPAL ---
export default function PaginaLeads() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isVerySmall = useMediaQuery('(max-width:450px)');
  
  // --- HOOKS PARA O TOUR ---
  const { isTourActive, currentStage, runStepTour, advanceTour } = useTour();

  const [open, setOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [selectedLeadForEmail, setSelectedLeadForEmail] = useState(null);
  const [selectionModel, setSelectionModel] = useState([]);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const location = useLocation();

  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [leadsToContact, setLeadsToContact] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [rowMenuAnchorEl, setRowMenuAnchorEl] = useState(null);
  const [selectedRowForMenu, setSelectedRowForMenu] = useState(null);
  
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [debtDialogOpen, setDebtDialogOpen] = useState(false);
  const [selectedLeadForDebt, setSelectedLeadForDebt] = useState(null);

  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [showSemRespostaStatus, setShowSemRespostaStatus] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: isMobile ? 10 : 25 });
  const [textFilter, setTextFilter] = useState(location.state?.leadName || '');
  const [debouncedTextFilter, setDebouncedTextFilter] = useState(location.state?.leadName || '');

  const queryClient = useQueryClient();
  const { isGuestMode } = useShowcaseContext();

  // --- CÓDIGO DE "ESCUTA" DO TOUR ADICIONADO AQUI ---
  useEffect(() => {
    if (isTourActive && currentStage?.path === '/app/leads') {
      setTimeout(() => {
        runStepTour(currentStage.steps, advanceTour);
      }, 500);
    }
  }, [isTourActive, currentStage, runStepTour, advanceTour]);

  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedTextFilter(textFilter); }, 500);
    return () => clearTimeout(handler);
  }, [textFilter]);

  const { control, handleSubmit, reset, formState: { errors } } = useForm();
  const { control: emailControl, handleSubmit: handleEmailSubmit, reset: resetEmailForm, formState: { errors: emailErrors } } = useForm();
  const { data: statusEnumData, isLoading: isLoadingStatusEnum } = useQuery('leadStatusEnums', () => api.get('/leads/statuses').then(res => res.data), { staleTime: 60000, initialData: [] });

  const baseStatuses = statusEnumData && Array.isArray(statusEnumData) && statusEnumData.length > 0
    ? statusEnumData
    : ['novo', 'contatado', 'em_negociacao', 'acordado', 'quitado'];
  const availableStatuses = showSemRespostaStatus ? [...baseStatuses, 'sem_resposta'] : baseStatuses;

  const { data: apiData, isLoading: apiIsLoading } = useQuery(['leads', paginationModel, debouncedTextFilter, statusFilter, sourceFilter], () => {
    const params = new URLSearchParams({ page: paginationModel.page + 1, limit: paginationModel.pageSize, sort: '-createdAt' });
    if (debouncedTextFilter) params.append('search', debouncedTextFilter);
    if (statusFilter) params.append('status', statusFilter);
    if (sourceFilter) params.append('source', sourceFilter);
    return api.get(`/leads?${params.toString()}`).then(res => res.data);
  }, { keepPreviousData: true, enabled: !isGuestMode });

  const data = USE_MOCKS ? { leads: MOCK_DEBTORS.map(d => ({ ...d, _id: d.id, status: 'ativo', source: 'whatsapp' })), totalCount: MOCK_DEBTORS.length } : apiData;
  const isLoading = USE_MOCKS ? false : apiIsLoading;

  const statusCountsMap = useMemo(() => (data?.leads || []).reduce((map, lead) => { if (lead.status) { map[lead.status] = (map[lead.status] || 0) + 1; } return map; }, {}), [data?.leads]);
  const semRespostaCount = useMemo(() => !showSemRespostaStatus || !data?.leads ? 0 : (statusCountsMap['sem_resposta'] || 0), [data?.leads, showSemRespostaStatus, statusCountsMap]);

  const { data: whatsAppProviderData, isLoading: isLoadingProvider } = useQuery('whatsappProvider', () => api.get('/whatsapp-ai/whatsapp-provider').then(res => res.data), { enabled: !isGuestMode, staleTime: Infinity, retry: false });

  const importFromFileMutation = useMutation((file) => { const formData = new FormData(); formData.append('leadFile', file); return api.post('/leads/import-file', formData, { headers: { 'Content-Type': 'multipart/form-data' } }); }, { onSuccess: (response) => { const { created, skipped, errors } = response.data; toast.success(t('leadsPage.toasts.importSuccess', { count: created })); if (skipped > 0) toast.info(t('leadsPage.toasts.importSkipped', { count: skipped })); if (errors > 0) toast.warning(t('leadsPage.toasts.importInvalid', { count: errors })); queryClient.invalidateQueries('leads'); setImportDialogOpen(false); }, onError: (error) => toast.error(error.response?.data?.message || t('leadsPage.toasts.importError')), });
  const createLeadMutation = useMutation((leadData) => api.post('/leads', leadData), { onSuccess: () => { queryClient.invalidateQueries('leads'); toast.success(t('leadsPage.toasts.createSuccess')); handleCloseDialog(); }, onError: (error) => { toast.error(error.response?.data?.message || t('leadsPage.toasts.createError')); } });
  const updateLeadMutation = useMutation(({ id, data }) => api.put(`/leads/${id}`, data), { onSuccess: () => { queryClient.invalidateQueries('leads'); toast.success(t('leadsPage.toasts.updateSuccess')); handleCloseDialog(); }, onError: (error) => { toast.error(error.response?.data?.message || t('leadsPage.toasts.updateError')); } });
  const deleteLeadMutation = useMutation((id) => api.delete(`/leads/${id}`), { onSuccess: () => { queryClient.invalidateQueries('leads'); toast.success(t('leadsPage.toasts.deleteSuccess')); }, onError: (error) => { toast.error(error.response?.data?.message || t('leadsPage.toasts.deleteError')); } });
  const deleteMultipleLeadsMutation = useMutation((ids) => api.post('/leads/delete-multiple', { ids }), { onSuccess: (response) => { queryClient.invalidateQueries('leads'); toast.success(response.data.message || t('leadsPage.toasts.deleteMultipleSuccess')); setSelectionModel([]); }, onError: (error) => { toast.error(error.response?.data?.message || t('leadsPage.toasts.deleteMultipleError')); } });
  const startZapiConversationMutation = useMutation(({ leadId }) => api.post('/ai/conversation/start', { leadId, channel: 'whatsapp' }), { onSuccess: () => { toast.success(t('leadsPage.toasts.conversationStartSuccess')); queryClient.invalidateQueries(['leads', 'conversations', 'dashboard-stats']); }, onError: (error) => { toast.error(error.response?.data?.message || t('leadsPage.toasts.conversationStartError')); } });
  const startMultipleZapiConversationsMutation = useMutation(({ leadIds }) => api.post('/ai/conversation/start-multiple', { leadIds, channel: 'whatsapp' }), { onSuccess: (response) => { const { successCount, errorCount, errors } = response.data; if (successCount > 0) { toast.success(t('leadsPage.toasts.batchConversationStartSuccess', { count: successCount })); } if (errorCount > 0) { toast.error(t('leadsPage.toasts.batchConversationStartError', { count: errorCount })); console.error('Falhas:', errors); } queryClient.invalidateQueries(['leads', 'conversations', 'dashboard-stats']); setSelectionModel([]); }, onError: (error) => { toast.error(error.response?.data?.message || t('leadsPage.toasts.batchConversationError')); } });
  const startWhatsappConversationMutation = useMutation((data) => api.post('/whatsapp-ai/start', data), { onSuccess: () => { toast.success(t('leadsPage.toasts.whatsappOfficialStartSuccess')); queryClient.invalidateQueries(['leads', 'conversations']); setTemplateModalOpen(false); }, onError: (error) => toast.error(error.response?.data?.message || t('leadsPage.toasts.conversationStartError')), });
  const startMultipleWhatsappConversationsMutation = useMutation((data) => api.post('/whatsapp-ai/start-batch', data), { onSuccess: (response) => { const { successCount, errorCount } = response.data; if (successCount > 0) toast.success(t('leadsPage.toasts.batchConversationStartSuccess', { count: successCount })); if (errorCount > 0) toast.error(t('leadsPage.toasts.batchConversationStartError', { count: errorCount })); queryClient.invalidateQueries(['leads', 'conversations']); setTemplateModalOpen(false); setSelectionModel([]); }, onError: (error) => toast.error(error.response?.data?.message || t('leadsPage.toasts.conversationStartError')), });
  const sendEmailMutation = useMutation(({ leadId, subject, body }) => api.post(`/leads/${leadId}/send-email`, { subject, body }), { onSuccess: () => { queryClient.invalidateQueries('conversations'); toast.success(t('leadsPage.toasts.emailSentSuccess')); handleCloseEmailDialog(); }, onError: (error) => { toast.error(error.response?.data?.message || t('leadsPage.toasts.emailSentError')); } });
  const syncAllLeadsMutation = useMutation(() => api.post('/leads/sync-all'), { onSuccess: (response) => { toast.success(t('leadsPage.toasts.syncSuccess')); queryClient.invalidateQueries(['leads', 'dashboard-stats']); }, onError: (error) => { toast.error(error.response?.data?.message || t('leadsPage.toasts.syncError')); } });
  const importFromCRMsMutation = useMutation(() => api.post('/integrations/import-from-all-crms'), { onSuccess: (response) => { const { created, skipped } = response.data; if (created > 0) { toast.success(t('leadsPage.toasts.crmImportSuccess', { created })); } else { toast.info(t('leadsPage.toasts.crmImportNoNew')); } if (skipped > 0) { toast.info(t('leadsPage.toasts.crmImportSkipped', { skipped })); } queryClient.invalidateQueries(['leads', 'dashboard-stats']); }, onError: (error) => { toast.error(error.response?.data?.message || t('leadsPage.toasts.crmImportError')); } });

  const handleOpenDialog = (lead = null) => { 
    setEditingLead(lead); 
    if (lead) { 
      // Achatar os objetos aninhados para o formulário
      reset({
        ...lead,
        street: lead.address?.street || '',
        number: lead.address?.number || '',
        complement: lead.address?.complement || '',
        city: lead.address?.city || '',
        state: lead.address?.state || '',
        zipCode: lead.address?.zipCode || '',
        linkedin: lead.socialMedia?.linkedin || '',
        facebook: lead.socialMedia?.facebook || '',
        instagram: lead.socialMedia?.instagram || ''
      }); 
    } else { 
      reset({ name: '', email: '', phone: '', company: '', position: '', source: 'form', taxId: '', street: '', number: '', complement: '', city: '', state: '', zipCode: '', linkedin: '', facebook: '', instagram: '' }); 
    } 
    setOpen(true); 
  };
  const handleCloseDialog = () => { setOpen(false); setEditingLead(null); reset(); };

  const onSubmit = (data) => { 
    const leadData = { 
      ...data, 
      phone: data.phone ? ('' + data.phone).replace(/\D/g, '') : '',
      taxId: data.taxId,
      address: {
        street: data.street,
        number: data.number,
        complement: data.complement,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode
      },
      socialMedia: {
        linkedin: data.linkedin,
        facebook: data.facebook,
        instagram: data.instagram
      }
    }; 
    if (editingLead) { 
      updateLeadMutation.mutate({ id: editingLead._id, data: leadData }); 
    } else { 
      createLeadMutation.mutate(leadData); 
    } 
  };
  const handleStartSingleConversation = async (lead) => { if (!lead.phone || !lead.phone.trim()) { toast.warn(t('leadsPage.toasts.noPhoneError')); return; } const provider = whatsAppProviderData?.provider; if (provider === 'zapi') { try { const statusResponse = await api.get('/zapi/status'); if (!statusResponse.data?.success || !statusResponse.data.status?.connected) { toast.warn(t('leadsPage.toasts.zapiNotConnected')); return; } startZapiConversationMutation.mutate({ leadId: lead._id }); } catch (error) { toast.error(t('leadsPage.toasts.providerError')); } } else if (provider === 'whatsapp') { setLeadsToContact([lead]); setTemplateModalOpen(true); } else { toast.error(isLoadingProvider ? t('leadsPage.toasts.checkingProvider') : t('leadsPage.toasts.providerConfigError')); } };
  const handleStartMultipleConversations = async () => { const selectedLeads = data?.leads.filter(lead => selectionModel.includes(lead._id)) || []; const leadsWithoutPhone = selectedLeads.filter(lead => !lead.phone || !lead.phone.trim()); if (leadsWithoutPhone.length > 0) { toast.warn(t('leadsPage.toasts.batchNoPhoneError', { count: leadsWithoutPhone.length })); return; } const provider = whatsAppProviderData?.provider; if (provider === 'zapi') { try { const statusResponse = await api.get('/zapi/status'); if (!statusResponse.data?.success || !statusResponse.data.status?.connected) { toast.warn(t('leadsPage.toasts.zapiNotConnected')); return; } startMultipleZapiConversationsMutation.mutate({ leadIds: selectionModel }); } catch (error) { toast.error(t('leadsPage.toasts.providerError')); } } else if (provider === 'whatsapp') { setLeadsToContact(selectedLeads); setTemplateModalOpen(true); } else { toast.error(isLoadingProvider ? t('leadsPage.toasts.checkingProvider') : t('leadsPage.toasts.providerConfigError')); } };
  const handleTemplateModalConfirm = ({ instanceId, templateId, leads }) => { if (leads.length === 1) { startWhatsappConversationMutation.mutate({ instanceId, templateId, leadId: leads[0]._id }); } else { startMultipleWhatsappConversationsMutation.mutate({ instanceId, templateId, leadIds: leads.map(lead => lead._id) }); } };
  const handleDeleteLead = (id) => { if (window.confirm(t('leadsPage.dialogs.confirmDelete'))) { deleteLeadMutation.mutate(id); } };
  const handleDeleteSelected = () => { if (selectionModel.length === 0) return; if (window.confirm(t('leadsPage.dialogs.confirmDeleteMultiple', { count: selectionModel.length }))) { deleteMultipleLeadsMutation.mutate(selectionModel); } };
  const handleOpenEmailDialog = (lead) => { setSelectedLeadForEmail(lead); resetEmailForm({ subject: '', body: '' }); setEmailDialogOpen(true); };
  const handleCloseEmailDialog = () => { setEmailDialogOpen(false); setSelectedLeadForEmail(null); };
  const onEmailSubmit = (data) => { sendEmailMutation.mutate({ leadId: selectedLeadForEmail._id, subject: data.subject, body: data.body, }); };
  const handleImportFromFile = (file) => { importFromFileMutation.mutate(file); };
  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);
  const handleOpenRowMenu = (event, row) => { setRowMenuAnchorEl(event.currentTarget); setSelectedRowForMenu(row); };
  const handleCloseRowMenu = () => { setRowMenuAnchorEl(null); setSelectedRowForMenu(null); };
  const handleStatusCardClick = (status) => { setStatusFilter(prevStatus => prevStatus === status ? '' : status); };
  const handleOpenDebtDialog = (lead) => { setSelectedLeadForDebt(lead); setDebtDialogOpen(true); };
  const handleCloseDebtDialog = () => { setDebtDialogOpen(false); setSelectedLeadForDebt(null); };
  const handleToggleSemRespostaStatus = () => { setShowSemRespostaStatus(prev => !prev); if (statusFilter === 'sem_resposta') { setStatusFilter(''); } };
  
  const handlePageChange = (event, value) => {
    setPaginationModel(prev => ({ ...prev, page: value - 1 }));
  };

  const statusColorsByIndex = useMemo(() => { if (!availableStatuses || availableStatuses.length === 0) { return {}; } const totalStatuses = availableStatuses.length; return availableStatuses.reduce((acc, status, index) => { if (status === 'sem_resposta') { acc[status] = '#ff6b6b'; } else { const hue = (index * (360 / totalStatuses)) % 360; acc[status] = `hsl(${hue}, 80%, 60%)`; } return acc; }, {}); }, [availableStatuses]);

  const columns = useMemo(() => [
    { field: 'name', headerName: t('leadsPage.table.name'), minWidth: 120, flex: 1 },
    { field: 'email', headerName: t('leadsPage.table.email'), minWidth: 200, flex: 1.5 },
    { field: 'company', headerName: t('leadsPage.table.company'), minWidth: 130, flex: 1 },
    { field: 'status', headerName: t('leadsPage.table.status'), width: 130, renderCell: (params) => (<Chip label={t(`dashboard.funnelLabels.${params.value.toLowerCase()}`, params.value)} sx={{ backgroundColor: statusColorsByIndex[params.value], color: 'white' }} size="small" />) },
    { field: 'actions', headerName: t('leadsPage.table.actions'), width: 150, sortable: false, align: 'center', headerAlign: 'center', renderCell: (params) => (<Box><Tooltip title={t('leadsPage.table.tooltip.startIaConversation')}><IconButton size="small" onClick={() => handleStartSingleConversation(params.row)}><ChatIcon fontSize="small" /></IconButton></Tooltip><Tooltip title={t('leadsPage.table.tooltip.edit')}><IconButton size="small" onClick={() => handleOpenDialog(params.row)}><EditIcon fontSize="small" /></IconButton></Tooltip><Tooltip title={t('leadsPage.table.tooltip.delete')}><IconButton size="small" onClick={() => handleDeleteLead(params.row._id)}><DeleteIcon fontSize="small" /></IconButton></Tooltip></Box>), },
  ], [t, statusColorsByIndex]);

  const transparentPaperStyle = useMemo(() => (theme.palette.mode === 'dark' ? { backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', border: `1px solid rgba(255, 255, 255, 0.2)`, } : { backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, }), [theme.palette.mode]);
  const datagridStyle = { '.MuiDataGrid-root': { border: 'none', '& .MuiDataGrid-columnHeaders': { backgroundColor: 'rgba(255, 255, 255, 0.12)', borderBottom: `1px solid ${theme.palette.divider}`, }, '& .MuiDataGrid-cell': { borderColor: theme.palette.divider, }, '& .MuiDataGrid-row': { '&.Mui-selected': { backgroundColor: 'rgba(142, 68, 173, 0.3)', }, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)', } }, } };
  const pageCount = Math.ceil((data?.total || 0) / paginationModel.pageSize);

  const FilterControls = () => (
    <>
      <FormControl fullWidth variant="outlined" size="small" disabled={isGuestMode}>
        <InputLabel>{t('leadsPage.filters.status')}</InputLabel>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label={t('leadsPage.filters.status')}>
          <MenuItem value=""><em>{t('leadsPage.filters.allStatuses')}</em></MenuItem>
          {availableStatuses.map((status) => (<MenuItem key={status} value={status} sx={{ color: statusColorsByIndex[status], fontWeight: 'bold' }}>{t(`dashboard.funnelLabels.${status.toLowerCase().replace(/_/g, '')}`, status)}</MenuItem>))}
        </Select>
      </FormControl>
      <FormControl fullWidth variant="outlined" size="small" disabled={isGuestMode}>
        <InputLabel>{t('leadsPage.filters.source')}</InputLabel>
        <Select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} label={t('leadsPage.filters.source')}>
          <MenuItem value=""><em>{t('leadsPage.filters.allSources')}</em></MenuItem>
          {Object.entries(t('dashboard.leadSources', { returnObjects: true })).map(([key, label]) => (<MenuItem key={key} value={key}>{label}</MenuItem>))}
        </Select>
      </FormControl>
    </>
  );

  return (
    <Box sx={{ position: 'relative' }}>
      {theme.palette.mode === 'light' && <Box sx={{ position: 'absolute', top: '-24px', left: '-24px', right: '-24px', bottom: '-24px', backgroundColor: theme.palette.background.default, zIndex: -1, }} />}
      <Paper id="tour-leads-header" sx={{ p: 2, mb: 3, borderRadius: 3, backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'background.paper', backdropFilter: theme.palette.mode === 'dark' ? 'blur(10px)' : 'none', border: `1px solid ${theme.palette.divider}`, boxShadow: theme.shadows[2] }}>
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid item xs={12} sm="auto"><Typography variant="h4" fontWeight="bold" sx={{ color: 'text.primary', ...(theme.palette.mode === 'dark' && { background: theme.palette.custom?.gradients?.text || 'linear-gradient(45deg, #D8B4FE 30%, #8E24AA 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }) }}>{t('leadsPage.title')}</Typography></Grid>
          <Grid item xs={12} sm><Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={isMobile ? 12 : 6}><TextField label={t('leadsPage.filters.searchPlaceholder')} variant="outlined" fullWidth size="small" value={textFilter} onChange={(e) => setTextFilter(e.target.value)} disabled={isGuestMode} InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>), }} /></Grid>
            {isMobile ? (<Grid item xs={12}><Badge color="primary" variant="dot" invisible={!statusFilter && !sourceFilter}><Button variant="outlined" startIcon={<FilterListIcon />} onClick={() => setFilterDialogOpen(true)} fullWidth>{t('common.filters')}</Button></Badge></Grid>
            ) : (<Grid item container md={6} spacing={2}>
              <Grid item xs={6}><FormControl fullWidth variant="outlined" size="small" disabled={isGuestMode}><InputLabel>{t('leadsPage.filters.status')}</InputLabel><Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label={t('leadsPage.filters.status')}><MenuItem value=""><em>{t('leadsPage.filters.allStatuses')}</em></MenuItem>{availableStatuses.map((status) => (<MenuItem key={status} value={status} sx={{ color: statusColorsByIndex[status], fontWeight: 'bold' }}>{t(`dashboard.funnelLabels.${status.toLowerCase().replace(/_/g, '')}`, status)}</MenuItem>))}</Select></FormControl></Grid>
              <Grid item xs={6}><FormControl fullWidth variant="outlined" size="small" disabled={isGuestMode}><InputLabel>{t('leadsPage.filters.source')}</InputLabel><Select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} label={t('leadsPage.filters.source')}><MenuItem value=""><em>{t('leadsPage.filters.allSources')}</em></MenuItem>{Object.entries(t('dashboard.leadSources', { returnObjects: true })).map(([key, label]) => (<MenuItem key={key} value={key}>{label}</MenuItem>))}</Select></FormControl></Grid>
            </Grid>)}
          </Grid></Grid>
        </Grid>
      </Paper>

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <FormControlLabel
          control={<Switch checked={showSemRespostaStatus} onChange={handleToggleSemRespostaStatus} color="primary" />}
          label={<Typography variant="body2">Mostrar status "Não respondeu"</Typography>}
        />
      </Box>

      <Grid container spacing={{ xs: 2, sm: 3 }} mb={3} id="tour-leads-status-cards">
        {availableStatuses.map((status) => {
          const count = status === 'sem_resposta' ? semRespostaCount : (statusCountsMap[status] || 0);
          const statusColor = statusColorsByIndex[status];
          const isActive = statusFilter === status;
          return (<Grid item xs={12} sm={6} lg={Math.max(2, 12 / availableStatuses.length)} key={status}><Card sx={{ ...transparentPaperStyle, borderLeft: `5px solid ${statusColor}`, cursor: 'pointer', transition: 'all 0.3s ease', backgroundColor: isActive ? statusColor : transparentPaperStyle.backgroundColor, boxShadow: isActive ? `0 6px 20px -5px ${statusColor}` : 'none', transform: isActive ? 'translateY(-3px)' : 'none', '&:hover': { transform: 'translateY(-2px)', backgroundColor: isActive ? statusColor : alpha(statusColor, 0.1) } }} onClick={() => handleStatusCardClick(status)}><CardContent><Typography variant="h6" fontWeight="bold" sx={{ color: isActive ? 'common.white' : statusColor }}>{t(`dashboard.funnelLabels.${status.toLowerCase().replace(/_/g, '')}`, status)}</Typography><Typography variant="h3" fontWeight="light" color={isActive ? 'common.white' : 'text.primary'}>{isLoadingStatusEnum || isLoading ? <CircularProgress size={20} color="inherit" /> : count}</Typography></CardContent></Card></Grid>)
        })}
      </Grid>
      
      {(statusFilter || sourceFilter) && (<Box display="flex" gap={1} alignItems="center" flexWrap="wrap" mb={2}>
        <Typography variant="caption" color="text.secondary">{t('common.activeFilters')}:</Typography>
        {statusFilter && <Chip label={t(`dashboard.funnelLabels.${statusFilter.toLowerCase().replace(/_/g, '')}`, statusFilter)} onDelete={() => setStatusFilter('')} deleteIcon={<CloseIcon style={{ color: 'inherit' }} />} sx={{ backgroundColor: statusColorsByIndex[statusFilter], color: 'common.white', fontWeight: 'bold' }} />}
        {sourceFilter && <Chip label={t(`dashboard.leadSources.${sourceFilter}`, sourceFilter)} onDelete={() => setSourceFilter('')} deleteIcon={<CloseIcon style={{ color: 'inherit' }} />} sx={{ backgroundColor: theme.palette.secondary.main, color: 'common.white', fontWeight: 'bold' }} />}
      </Box>)}

      <Box component={Paper} id="tour-leads-action-bar" sx={{ ...transparentPaperStyle, p: 2, mb: 3, borderRadius: 2, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', md: 'center' }, gap: 2 }}>
        <Box display="flex" alignItems="center" gap={2} sx={{ flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' } }}>
          {selectionModel.length > 0 && !isGuestMode ? (<>
            <Typography variant="subtitle1" color="text.secondary" sx={{ textAlign: 'center' }}>{t('leadsPage.buttons.selected', { count: selectionModel.length })}</Typography>
            <GradientButton startIcon={startMultipleZapiConversationsMutation.isLoading || startMultipleWhatsappConversationsMutation.isLoading ? <CircularProgress size={20} color="inherit" /> : <ChatIcon />} onClick={handleStartMultipleConversations} disabled={startMultipleZapiConversationsMutation.isLoading || startMultipleWhatsappConversationsMutation.isLoading} sx={{ background: 'linear-gradient(45deg, #10B981 30%, #059669 90%)', textTransform: 'none', }}>{isVerySmall ? `(${selectionModel.length})` : t('leadsPage.buttons.startConversation', { count: selectionModel.length })}</GradientButton>
            <IconButton title={t('common.deleteSelected')} color="error" onClick={handleDeleteSelected} disabled={deleteMultipleLeadsMutation.isLoading} sx={{ background: alpha(theme.palette.error.main, 0.2), '&:hover': { background: alpha(theme.palette.error.main, 0.4) } }}>{deleteMultipleLeadsMutation.isLoading ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}</IconButton>
          </>) : (<Typography variant="subtitle1" color="text.secondary">{t('leadsPage.selectHint')}</Typography>)}
        </Box>
        <Box display="flex" gap={2} sx={{ justifyContent: 'center', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center' }}>
          <GradientButton startIcon={<AddIcon />} onClick={() => handleOpenDialog()} sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: 150 }}>
            {t('leadsPage.buttons.newLead')}
          </GradientButton>
          <Tooltip title={t('common.managementActions')} placement="bottom"><IconButton onClick={handleOpenMenu} sx={{ background: 'rgba(255, 255, 255, 0.1)', '&:hover': { background: 'rgba(255, 255, 255, 0.2)' } }}><MoreVertIcon /></IconButton></Tooltip>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu} PaperProps={{ sx: transparentPaperStyle }}>
            <ShowcaseBlocker><MenuItem onClick={() => { importFromCRMsMutation.mutate(); handleCloseMenu(); }} disabled={importFromCRMsMutation.isLoading}><ListItemIcon>{importFromCRMsMutation.isLoading ? <CircularProgress size={20} /> : <GetAppIcon />}</ListItemIcon><ListItemText>{t('leadsPage.buttons.importFromCrm')}</ListItemText></MenuItem></ShowcaseBlocker>
            <MenuItem onClick={() => { syncAllLeadsMutation.mutate(); handleCloseMenu(); }} disabled={syncAllLeadsMutation.isLoading}><ListItemIcon>{syncAllLeadsMutation.isLoading ? <CircularProgress size={20} /> : <SyncIcon />}</ListItemIcon><ListItemText>{t('leadsPage.buttons.syncWithCrm')}</ListItemText></MenuItem>
            <ShowcaseBlocker><MenuItem onClick={() => { setImportDialogOpen(true); handleCloseMenu(); }}><ListItemIcon><FileUploadIcon /></ListItemIcon><ListItemText>{t('leadsPage.buttons.importFile')}</ListItemText></MenuItem></ShowcaseBlocker>
          </Menu>
        </Box>
      </Box>
      
      <Box id="tour-leads-list">
        {isMobile ? (
          <>
            <Grid container spacing={2}>
              {isLoading ? (
                Array.from(new Array(6)).map((_, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <MobileLeadCardSkeleton transparentPaperStyle={transparentPaperStyle} />
                  </Grid>
                ))
              ) : !data?.leads || data.leads.length === 0 ? (
                <Grid item xs={12}>
                  <Paper sx={{ ...transparentPaperStyle, p: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary">{t('common.noData')}</Typography>
                  </Paper>
                </Grid>
              ) : (
                data.leads.map((lead) => (
                  <Grid item xs={12} sm={6} md={3} key={lead._id}>
                    <MobileLeadCard
                      lead={lead}
                      statusColor={statusColorsByIndex[lead.status]}
                      onOpenMenu={handleOpenRowMenu}
                      t={t}
                      transparentPaperStyle={transparentPaperStyle}
                    />
                  </Grid>
                ))
              )}
            </Grid>
            {pageCount > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={pageCount}
                  page={paginationModel.page + 1}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            )}
          </>
        ) : (
          <Card sx={{ ...transparentPaperStyle }}>
            <CardContent sx={{ p: 0, '&:last-child': { paddingBottom: 0 } }}>
              <Box sx={{ height: 'calc(100vh - 480px)', width: '100%', ...datagridStyle }}>
                <DataGrid rows={data?.leads || []} columns={columns} rowCount={data?.total || 0} loading={isLoading} pageSizeOptions={[25, 50, 100]} paginationModel={paginationModel} onPaginationModelChange={isGuestMode ? undefined : setPaginationModel} paginationMode={isGuestMode ? "client" : "server"} getRowId={(row) => row._id} checkboxSelection={!isGuestMode} onRowSelectionModelChange={(newSelectionModel) => { if (!isGuestMode) setSelectionModel(newSelectionModel); }} rowSelectionModel={selectionModel} disableRowSelectionOnClick />
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>

      <Menu anchorEl={rowMenuAnchorEl} open={Boolean(rowMenuAnchorEl)} onClose={handleCloseRowMenu} PaperProps={{ sx: transparentPaperStyle }}>
        <MenuItem onClick={() => { handleStartSingleConversation(selectedRowForMenu); handleCloseRowMenu(); }}><ListItemIcon><ChatIcon fontSize="small" /></ListItemIcon><ListItemText>{t('leadsPage.table.tooltip.startIaConversation')}</ListItemText></MenuItem>
        <MenuItem onClick={() => { handleOpenDebtDialog(selectedRowForMenu); handleCloseRowMenu(); }}><ListItemIcon><RequestQuoteIcon fontSize="small" /></ListItemIcon><ListItemText>Gestão de Dívida</ListItemText></MenuItem>
        <MenuItem onClick={() => { handleOpenDialog(selectedRowForMenu); handleCloseRowMenu(); }}><ListItemIcon><EditIcon fontSize="small" /></ListItemIcon><ListItemText>{t('leadsPage.table.tooltip.edit')}</ListItemText></MenuItem>
        <MenuItem onClick={() => { handleDeleteLead(selectedRowForMenu._id); handleCloseRowMenu(); }} sx={{ color: 'error.main' }}><ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon><ListItemText>{t('leadsPage.table.tooltip.delete')}</ListItemText></MenuItem>
      </Menu>

      <StyledDialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle sx={{ display: 'flex', alignItems: "center", gap: 1, color: theme.palette.primary.light }}><AddCircleOutlineIcon color="primary" />{editingLead ? t('leadsPage.leadModal.editTitle') : t('leadsPage.leadModal.newTitle')}</DialogTitle>
          <DialogContent><Box sx={{ pt: 2, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
            <Controller name="name" control={control} rules={{ required: t('leadsPage.validation.nameRequired') }} render={({ field }) => <TextField {...field} label={t('leadsPage.leadModal.nameLabel')} error={!!errors.name} helperText={errors.name?.message} fullWidth />} />
            <Controller name="email" control={control} rules={{ required: t('leadsPage.validation.emailRequired'), pattern: { value: /^\S+@\S+$/i, message: t('leadsPage.validation.emailInvalid') } }} render={({ field }) => <TextField {...field} label={t('leadsPage.leadModal.emailLabel')} type="email" error={!!errors.email} helperText={errors.email?.message} fullWidth />} />
            <Controller name="phone" control={control} render={({ field }) => (<TextField {...field} label={t('leadsPage.leadModal.phoneLabel')} fullWidth InputProps={{ inputComponent: PhoneMaskAdapter }} />)} />
            <Controller name="company" control={control} rules={{ required: t('leadsPage.validation.companyRequired') }} render={({ field }) => <TextField {...field} label={t('leadsPage.leadModal.companyLabel')} error={!!errors.company} helperText={errors.company?.message} fullWidth />} />
            <Controller name="position" control={control} render={({ field }) => <TextField {...field} label={t('leadsPage.leadModal.positionLabel')} fullWidth />} />
            <Controller name="source" control={control} defaultValue="form" rules={{ required: t('leadsPage.validation.sourceRequired') }} render={({ field }) => (<FormControl fullWidth error={!!errors.source}><InputLabel>{t('leadsPage.leadModal.sourceLabel')}</InputLabel><Select {...field} label={t('leadsPage.leadModal.sourceLabel')} sx={{ '& fieldset': { borderColor: theme.palette.divider }, '& .MuiSvgIcon-root': { color: 'text.secondary' } }}>{Object.entries(t('dashboard.leadSources', { returnObjects: true })).map(([key, label]) => (<MenuItem key={key} value={key}>{label}</MenuItem>))}</Select></FormControl>)} />
            
            <Divider sx={{ gridColumn: '1 / -1', my: 1 }} />
            <Typography variant="subtitle2" sx={{ gridColumn: '1 / -1' }}>Informações Pessoais e Endereço</Typography>
            
            <Controller name="taxId" control={control} render={({ field }) => <TextField {...field} label="CPF/CNPJ" fullWidth />} />
            <Controller name="zipCode" control={control} render={({ field }) => <TextField {...field} label="CEP" fullWidth />} />
            <Controller name="street" control={control} render={({ field }) => <TextField {...field} label="Logradouro" fullWidth />} />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Controller name="number" control={control} render={({ field }) => <TextField {...field} label="Nº" sx={{ width: '80px' }} />} />
              <Controller name="complement" control={control} render={({ field }) => <TextField {...field} label="Complemento" fullWidth />} />
            </Box>
            <Controller name="city" control={control} render={({ field }) => <TextField {...field} label="Cidade" fullWidth />} />
            <Controller name="state" control={control} render={({ field }) => <TextField {...field} label="Estado" fullWidth />} />

            <Divider sx={{ gridColumn: '1 / -1', my: 1 }} />
            <Typography variant="subtitle2" sx={{ gridColumn: '1 / -1' }}>Redes Sociais</Typography>
            
            <Controller name="linkedin" control={control} render={({ field }) => <TextField {...field} label="LinkedIn" fullWidth />} />
            <Controller name="instagram" control={control} render={({ field }) => <TextField {...field} label="Instagram" fullWidth />} />
            <Controller name="facebook" control={control} render={({ field }) => <TextField {...field} label="Facebook" fullWidth />} />
          </Box></DialogContent>
          <DialogActions sx={{ p: '16px 24px' }}><Button onClick={handleCloseDialog} color="inherit">{t('common.cancel')}</Button><GradientButton type="submit" disabled={createLeadMutation.isLoading || updateLeadMutation.isLoading}>{createLeadMutation.isLoading || updateLeadMutation.isLoading ? <CircularProgress size={24} color="inherit" /> : (editingLead ? t('leadsPage.leadModal.updateButton') : t('leadsPage.leadModal.createButton'))}</GradientButton></DialogActions>
        </form>
      </StyledDialog>

      <StyledDialog open={filterDialogOpen} onClose={() => setFilterDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>{t('common.filters')}</DialogTitle>
        <DialogContent><Box display="flex" flexDirection="column" gap={3} pt={1}><FilterControls /></Box></DialogContent>
        <DialogActions><Button onClick={() => setFilterDialogOpen(false)}>{t('common.close')}</Button></DialogActions>
      </StyledDialog>

      <StyledDialog open={emailDialogOpen} onClose={handleCloseEmailDialog} fullWidth maxWidth="md">
        <form onSubmit={handleEmailSubmit(onEmailSubmit)}>
          <DialogTitle>{t('leadsPage.emailModal.title', { leadName: selectedLeadForEmail?.name })}</DialogTitle>
          <DialogContent><Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label={t('leadsPage.emailModal.toLabel')} value={selectedLeadForEmail?.email || ''} fullWidth InputProps={{ readOnly: true }} variant="filled" />
            <Controller name="subject" control={emailControl} rules={{ required: t('leadsPage.validation.subjectRequired') }} render={({ field }) => <TextField {...field} label={t('leadsPage.emailModal.subjectLabel')} fullWidth error={!!emailErrors.subject} helperText={emailErrors.subject?.message} />} />
            <Controller name="body" control={emailControl} rules={{ required: t('leadsPage.validation.bodyRequired') }} render={({ field }) => <TextField {...field} label={t('leadsPage.emailModal.messageLabel')} fullWidth multiline rows={10} error={!!emailErrors.body} helperText={emailErrors.body?.message} />} />
          </Box></DialogContent>
          <DialogActions><Button onClick={handleCloseEmailDialog} color="inherit">{t('common.cancel')}</Button><GradientButton type="submit" disabled={sendEmailMutation.isLoading}>{sendEmailMutation.isLoading ? <CircularProgress size={24} color="inherit" /> : t('leadsPage.emailModal.sendButton')}</GradientButton></DialogActions>
        </form>
      </StyledDialog>
      
      <ImportFileDialog open={importDialogOpen} onClose={() => setImportDialogOpen(false)} onSubmit={handleImportFromFile} isLoading={importFromFileMutation.isLoading}/>
      <TemplateSelectionModal open={templateModalOpen} onClose={() => setTemplateModalOpen(false)} onConfirm={handleTemplateModalConfirm} leadsToContact={leadsToContact} isLoadingConfirm={startWhatsappConversationMutation.isLoading || startMultipleWhatsappConversationsMutation.isLoading}/>
      <DebtManagementDialog open={debtDialogOpen} onClose={handleCloseDebtDialog} leadId={selectedLeadForDebt?._id} leadName={selectedLeadForDebt?.name} />
    
    </Box>
  );
}