import React, { useState, useEffect, useMemo, forwardRef } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box, Typography, Button, Paper, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem, IconButton, Tooltip, Grid,
  CircularProgress, Card, CardContent, InputAdornment, useTheme, Pagination,
  Skeleton, CardActions, alpha, DialogContentText
} from '@mui/material';
import {
  Search as SearchIcon, Delete as DeleteIcon, Phone as PhoneIcon,
  Email as EmailIcon, Business as BusinessIcon, DeleteSweep as DeleteSweepIcon,
  WarningAmber as WarningIcon
  // O SendIcon foi removido pois o modal de template não é mais usado aqui
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import api from '../services/api';
import { StyledDialog } from '../components/ui/StyledDialog';
import { GradientButton } from '../components/ui/GradientButton'; // Este import pode ser removido se não for usado em outro lugar

// --- COMPONENTE DE MODAL REUTILIZADO DE Leads.js ---
// Removido - TemplateSelectionModal não é mais necessário nesta página
// --- FIM DA REMOÇÃO ---


// --- NOVO COMPONENTE DE CONFIRMAÇÃO (Sem alteração) ---
const ConfirmationDialog = ({ open, onClose, onConfirm, title, message, isLoading, style }) => {
  const { t } = useTranslation();

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { ...style, borderRadius: '16px', border: style.border } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
        <WarningIcon />
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText color="text.secondary">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={onClose} color="inherit">{t('common.cancel')}</Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
        >
          {t('common.delete')}
        </Button
>
      </DialogActions>
    </StyledDialog>
  );
};

// --- COMPONENTE DO CARD DE LEAD (Sem alteração) ---
const LeadCard = ({ lead, onCall, onDelete, style }) => {
  const theme = useTheme();

  return (
    <Card sx={{ ...style, borderRadius: '16px' }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" noWrap>{lead.name}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
          <EmailIcon fontSize="small" /> {lead.email || 'N/A'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PhoneIcon fontSize="small" /> {lead.phone || 'N/A'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BusinessIcon fontSize="small" /> {lead.company || 'N/A'}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Tooltip title="Ligar (Iniciar Conversa por Voz)">
          <IconButton
            onClick={() => onCall(lead)}
            sx={{ color: theme.palette.success.main, '&:hover': { background: alpha(theme.palette.success.main, 0.1) } }}
          >
            <PhoneIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Deletar Lead">
          <IconButton
            onClick={() => onDelete(lead._id)}
            sx={{ color: theme.palette.error.main, '&:hover': { background: alpha(theme.palette.error.main, 0.1) } }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

// --- SKELETON PARA O CARD DE LEAD (Sem alteração) ---
const LeadCardSkeleton = ({ style }) => (
  <Card sx={{ ...style, borderRadius: '16px' }}>
    <CardContent>
      <Skeleton variant="text" width="70%" height={32} />
      <Skeleton variant="text" width="90%" height={20} sx={{ mt: 1 }} />
      <Skeleton variant="text" width="60%" height={20} />
      <Skeleton variant="text" width="50%" height={20} />
    </CardContent>
    <CardActions sx={{ justifyContent: 'flex-end' }}>
      <Skeleton variant="circular" width={40} height={40} />
      <Skeleton variant="circular" width={40} height={40} />
    </CardActions>
  </Card>
);

// --- COMPONENTE PRINCIPAL DA PÁGINA ---
export default function NoResponseLeads() {
  const { t } = useTranslation();
  const theme = useTheme();

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 12 });
  const [textFilter, setTextFilter] = useState('');
  const [debouncedTextFilter, setDebouncedTextFilter] = useState('');

  // Estados do modal de template (REMOVIDOS)
  // const [templateModalOpen, setTemplateModalOpen] = useState(false);
  // const [leadsToContact, setLeadsToContact] = useState([]);

  const [confirmState, setConfirmState] = useState({
    open: false,
    targetId: null,
    all: false
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedTextFilter(textFilter); }, 500);
    return () => clearTimeout(handler);
  }, [textFilter]);

  const transparentPaperStyle = useMemo(() => (
    theme.palette.mode === 'dark'
      ? {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: `1px solid rgba(255, 255, 255, 0.2)`,
      }
      : {
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
      }
  ), [theme.palette.mode, theme.palette.background.paper, theme.palette.divider]);

  const { data, isLoading } = useQuery(
    // ... (código da query - sem alteração)
    ['noResponseLeads', paginationModel, debouncedTextFilter],
    () => {
      const params = new URLSearchParams({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        sort: '-createdAt',
        status: 'nao_respondeu'
      });
      if (debouncedTextFilter) params.append('search', debouncedTextFilter);
      return api.get(`/leads?${params.toString()}`).then(res => res.data);
    },
    { keepPreviousData: true }
  );

  // Query do provedor de WhatsApp (REMOVIDA)
  // const { data: whatsAppProviderData, isLoading: isLoadingProvider } = useQuery(...)

  const handleCloseConfirmDialog = () => {
    setConfirmState({ open: false, targetId: null, all: false });
  };

  const deleteLeadMutation = useMutation((id) => api.delete(`/leads/${id}`), {
    onSuccess: () => {
      queryClient.invalidateQueries('noResponseLeads');
      toast.success(t('leadsPage.toasts.deleteSuccess'));
      handleCloseConfirmDialog();
    },
    onError: (error) => { toast.error(error.response?.data?.message || t('leadsPage.toasts.deleteError')); }
  });

  const deleteAllNoResponseMutation = useMutation(() => api.post('/leads/delete-by-status', { status: 'nao_respondeu' }), {
    onSuccess: (response) => {
      queryClient.invalidateQueries('noResponseLeads');
      toast.success(response.data.message || 'Todos os leads que não responderam foram deletados.');
      handleCloseConfirmDialog();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erro ao deletar leads.');
    }
  });

  // Mutações de WhatsApp (REMOVIDAS)
  // const startZapiConversationMutation = useMutation(...)
  // const startWhatsappConversationMutation = useMutation(...)
  
  // --- NOVA MUTAÇÃO PARA INICIAR CHAMADA DE VOZ ---
  const startVoiceCallMutation = useMutation(
    (payload) => api.post('/voice-agent/start-call', payload),
    {
      onSuccess: () => {
        toast.success('Iniciando chamada de voz...');
        // Não precisamos invalidar a query, pois a chamada é assíncrona
        // e o status do lead não muda imediatamente.
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erro ao iniciar chamada de voz');
      }
    }
  );
  // --- FIM DA NOVA MUTAÇÃO ---


  const handleDeleteLead = (id) => {
    setConfirmState({ open: true, targetId: id, all: false });
  };

  const handleDeleteAll = () => {
    setConfirmState({ open: true, targetId: null, all: true });
  };

  const handleConfirmDelete = () => {
    if (confirmState.all) {
      deleteAllNoResponseMutation.mutate();
    } else if (confirmState.targetId) {
      deleteLeadMutation.mutate(confirmState.targetId);
    }
  };

  // --- HANDLER DE CHAMADA (TOTALMENTE SUBSTITUÍDO) ---
  const handleStartVoiceCall = (lead) => {
    if (!lead.phone || !lead.phone.trim()) {
      toast.warn(t('leadsPage.toasts.noPhoneError', 'Lead não possui um número de telefone.'));
      return;
    }

    // A rota /start-call espera um 'phoneNumber'
    // O backend do controller já trata a normalização, mas é bom garantir o +
    const formattedPhone = lead.phone.startsWith('+') ? lead.phone : `+${lead.phone}`;

    startVoiceCallMutation.mutate({
      phoneNumber: formattedPhone
      // 'initialMessage' é opcional, o backend usará o padrão.
    });
  };
  // --- FIM DA SUBSTITUIÇÃO ---

  // Handler do modal de template (REMOVIDO)
  // const handleTemplateModalConfirm = (...)

  const handlePageChange = (event, value) => {
    setPaginationModel(prev => ({ ...prev, page: value - 1 }));
  };

  const pageCount = Math.ceil((data?.total || 0) / paginationModel.pageSize);

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, position: 'relative' }}>

      {/* CABEÇALHO (Sem alteração) */}
      <Paper
        sx={{
          ...transparentPaperStyle,
          borderRadius: '16px',
          p: 3,
          mb: 4,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: 'text.primary' }}>
            Leads que Não Responderam
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Revise, contate ou remova leads inativos.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', md: 'auto' }, flexDirection: { xs: 'column', sm: 'row' } }}>
          <TextField
            label="Buscar por nome ou email..."
            variant="outlined"
            size="small"
            value={textFilter}
            onChange={(e) => setTextFilter(e.target.value)}
            InputProps={{
              startAdornment: (<InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>),
              sx: {
                borderRadius: '12px',
                background: alpha(theme.palette.background.default, 0.5),
                '& fieldset': { borderColor: 'transparent' },
                '&:hover fieldset': { borderColor: theme.palette.primary.main }
              }
            }}
            sx={{ width: { xs: '100%', sm: 300 } }}
          />
          <Button
            variant="contained"
            color="error"
            startIcon={deleteAllNoResponseMutation.isLoading ? <CircularProgress size={20} color="inherit" /> : <DeleteSweepIcon />}
            onClick={handleDeleteAll}
            disabled={deleteAllNoResponseMutation.isLoading || (!data?.leads || data.leads.length === 0)}
            sx={{
              borderRadius: '12px',
              boxShadow: '0 4px 15px rgba(239, 83, 80, 0.3)',
              textTransform: 'none',
              fontWeight: 600,
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            Deletar Todos
          </Button>
        </Box>
      </Paper>

      {/* GRADE DE LEADS */}
      <Box>
        {isLoading ? (
          <Grid container spacing={3}>
            {Array.from(new Array(paginationModel.pageSize)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <LeadCardSkeleton style={transparentPaperStyle} />
              </Grid>
            ))}
          </Grid>
        ) : !data?.leads || data.leads.length === 0 ? (
          <Paper sx={{ ...transparentPaperStyle, borderRadius: '16px', p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Nenhum lead encontrado
            </Typography>
            <Typography color="text.secondary">
              Não há leads com o status "Não Respondeu" no momento.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {data.leads.map((lead) => (
              <Grid item xs={12} sm={6} md={4} key={lead._id}>
                <LeadCard
                  lead={lead}
                  onCall={handleStartVoiceCall} // <-- ATUALIZADO AQUI
                  onDelete={handleDeleteLead}
                  style={transparentPaperStyle}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* PAGINAÇÃO (Sem alteração) */}
      {pageCount > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={pageCount}
            page={paginationModel.page + 1}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      {/* MODAL de Template (REMOVIDO) */}
      {/* <TemplateSelectionModal ... /> */}

      {/* DIALOG DE CONFIRMAÇÃO (Sem alteração) */}
      <ConfirmationDialog
        open={confirmState.open}
        onClose={handleCloseConfirmDialog}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        message={
          confirmState.all
            ? "Você tem certeza que quer deletar TODOS os leads que não responderam? Esta ação não pode ser desfeita."
            : "Você tem certeza que quer deletar este lead?"
        }
        isLoading={deleteLeadMutation.isLoading || deleteAllNoResponseMutation.isLoading}
        style={transparentPaperStyle}
      />
    </Box>
  );
}