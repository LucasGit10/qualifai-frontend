import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Avatar, Box, IconButton, Paper, TextField, Typography, Tooltip, useTheme, alpha,
  Grid, Pagination, Chip, Badge, Button, CircularProgress, DialogActions,
  DialogContent, DialogTitle, Skeleton, Dialog, GlobalStyles
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import PersonIcon from '@mui/icons-material/Person';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import NoteIcon from '@mui/icons-material/Note';
import VoiceOverOffIcon from '@mui/icons-material/VoiceOverOff';
import RefreshIcon from '@mui/icons-material/Refresh';
import LockIcon from '@mui/icons-material/Lock';
import WarningIcon from '@mui/icons-material/Warning';
import NoResultsIcon from '@mui/icons-material/SearchOff';
import { useTranslation, Trans } from 'react-i18next';
import api from '../services/api';
import { toast } from 'react-toastify';
import ConversationDialog from '../components/ConversationPage/ConversationDialog';
import { useShowcaseContext } from '../contexts/ShowcaseContext';
import { MOCK_CONVERSATIONS } from '../mocks';
import { USE_MOCKS } from '../config/env';
import socketService from '../services/socket';
import { useAuthStore } from '../stores/authStore';

// ALTERAÇÃO: Importando nossos componentes de UI customizados
import { StyledDialog } from '../components/ui/StyledDialog';
import { GradientButton } from '../components/ui/GradientButton';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { formatPhoneNumber, getChannelIcon, getStatusColor, getStatusLabel, hasNote } from '../utils/conversationUtils';

const ConversationCard = ({ conversation, onOpen, onDelete, theme }) => {
  const { t } = useTranslation();

  // ALTERAÇÃO: Lógica de estilos totalmente refeita para o tema de vidro
  const getStatusStyles = (status) => {
    const baseHover = {
      transform: 'translateY(-4px)',
      borderColor: 'primary.main',
    };

    switch (status) {
      case 'escalated':
        return {
          borderColor: 'error.main',
          boxShadow: `0 0 12px 2px ${alpha(theme.palette.error.main, 0.5)}`,
          '&:hover': { ...baseHover, boxShadow: `0 6px 16px 4px ${alpha(theme.palette.error.main, 0.6)}` },
        };
      case 'active':
        return {
          borderColor: 'success.main',
          '&:hover': { ...baseHover, boxShadow: `0 6px 16px 4px ${alpha(theme.palette.success.main, 0.4)}` },
        };
      case 'closed':
        return {
          opacity: 0.6,
          '&:hover': { ...baseHover, opacity: 1, boxShadow: `0 6px 16px 4px ${alpha(theme.palette.grey[500], 0.2)}` },
        };
      default:
        return {
          '&:hover': { ...baseHover, boxShadow: `0 6px 16px 4px ${alpha(theme.palette.primary.main, 0.3)}` },
        };
    }
  };

  const getStatusChip = (status) => {
    const styles = { height: 'auto', '& .MuiChip-label': { py: '2px', px: '6px', fontSize: '0.7rem' }, color: 'white' };
    switch (status) {
      case 'active': return <Chip label={t('conversationsPage.status.active')} size="small" sx={{ ...styles, backgroundColor: alpha(theme.palette.success.main, 0.3), border: `1px solid ${alpha(theme.palette.success.main, 0.7)}`}} />;
      case 'escalated': return <Chip label={t('conversationsPage.status.escalated')} size="small" sx={{ ...styles, backgroundColor: alpha(theme.palette.error.main, 0.4), border: `1px solid ${alpha(theme.palette.error.main, 0.8)}`}} />;
      case 'closed': return <Chip label={t('conversationsPage.status.closed')} size="small" variant="outlined" sx={{...styles, borderColor: 'grey.700', color: 'text.secondary'}} />;
      default: return <Chip label={status} size="small" sx={styles} />;
    }
  };
  
  const isAIActive = conversation.aiEnabled !== false;

  return (
    <Paper
      // ALTERAÇÃO: Estilos base de vidro aplicados aqui
      sx={{
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        cursor: 'pointer',
        border: '1px solid',
        transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s, opacity 0.2s',
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
        ...getStatusStyles(conversation.status),
      }}
      onClick={() => onOpen(conversation._id)}
    >
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
        <Box display="flex" alignItems="center" gap={2}>
          <Badge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} badgeContent={getChannelIcon(conversation.channel)}>
            <Avatar sx={{ background: theme.palette.custom?.gradients?.button, width: 48, height: 48 }}>
              {conversation.lead?.name ? conversation.lead.name.charAt(0).toUpperCase() : <PersonIcon />}
            </Avatar>
          </Badge>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" noWrap color={theme.palette.text.primary}>
              {conversation.lead?.name || t('conversationsPage.contactWithoutName')}
            </Typography>
            <Typography variant="body2" color={theme.palette.text.secondary} noWrap>
              {conversation.lead?.company || t('conversationsPage.companyNotProvided')}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" alignItems="center">
            {conversation.notes?.length > 0 && (
                <Tooltip title={t('conversationsPage.tooltips.hasNotes')}>
                    <NoteIcon sx={{ color: 'warning.main', fontSize: 20, mr: 1 }} />
                </Tooltip>
            )}
            <Tooltip title={t('conversationsPage.tooltips.deleteConversation')}>
                <IconButton size="small" onClick={(e) => onDelete(conversation._id, e)}><DeleteIcon fontSize="small" color="error" /></IconButton>
            </Tooltip>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {getStatusChip(conversation.status)}
        <Chip 
          icon={isAIActive ? <AutoAwesomeIcon /> : <VoiceOverOffIcon />}
          label={isAIActive ? t('conversationsPage.cards.aiActive') : t('conversationsPage.cards.aiInactive')}
          size="small"
          variant="outlined"
          color={isAIActive ? "info" : "default"}
          sx={{ height: 'auto', '& .MuiChip-label': { py: '2px', px: '6px', fontSize: '0.7rem' } }}
        />
      </Box>

      <Typography variant="body2" sx={{
        mt: 'auto',
        pt: 1.5,
        borderTop: `1px solid ${theme.palette.divider}`,
        color: theme.palette.text.secondary,
        overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box',
        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        fontSize: '0.8rem'
      }}>
        {conversation.messages?.length > 0
          ? conversation.messages[conversation.messages.length - 1].content
          : t('conversationsPage.cards.noMessagesYet')
        }
      </Typography>
    </Paper>
  );
};

const EmptyState = ({ message, onClearFilters }) => {
  const theme = useTheme();
  
  return (
      <Grid item xs={12}>
          <Paper sx={{ 
            p: 4, 
            textAlign: 'center', 
            borderRadius: 3, 
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)', 
            border: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)'
          }}>
              <NoResultsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.primary" gutterBottom>{message}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Tente ajustar seus filtros ou aguarde novas conversas chegarem.
              </Typography>
              {onClearFilters && (
                  <Button variant="outlined" onClick={onClearFilters}>
                      Limpar Filtros
                  </Button>
              )}
          </Paper>
      </Grid>
  );
};

export default function Conversations({ channel, teamMemberId }) {
  const { t } = useTranslation();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(16); // Este valor agora deve corresponder ao back-end
  const [selectedTags, setSelectedTags] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [columns, setColumns] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [activeContainerId, setActiveContainerId] = useState(null);
  const [note, setNote] = useState('');

  const queryClient = useQueryClient();
  const theme = useTheme();
  const { isGuestMode, openModal } = useShowcaseContext();
  const { user } = useAuthStore();
  
  useEffect(() => {
    if (isGuestMode || !user?._id) return;
    const socket = socketService.connect(user._id);
    const handleEscalation = (data) => {
        toast.warn(t('conversationsPage.toasts.escalation', { leadName: data.conversation?.lead?.name || '' }));
        queryClient.invalidateQueries(['conversations', page]);
        if (selectedConversation) queryClient.invalidateQueries(['conversation', selectedConversation]);
    };
    const handleConversationUpdate = () => {
        queryClient.invalidateQueries(['conversations', page]);
        if (selectedConversation) queryClient.invalidateQueries(['conversation', selectedConversation]);
    };
    socketService.on('conversation_escalated', handleEscalation);
    socketService.on('conversation_updated', handleConversationUpdate);
    return () => {
      socketService.off('conversation_escalated', handleEscalation);
      socketService.off('conversation_updated', handleConversationUpdate);
    };
  }, [queryClient, selectedConversation, isGuestMode, user]);

  const { data: apiConversationsData, isLoading: apiIsLoading, refetch } = useQuery(
	    ['conversations', page, channel, teamMemberId],
    async () => {
      if (USE_MOCKS) return MOCK_CONVERSATIONS;
      const params = new URLSearchParams({ page });
	      if (channel) {
	        params.append('channel', channel);
	      }
	      if (teamMemberId) {
	        params.append('teamMemberId', teamMemberId);
	      } else {
	        params.append('owner', 'master');
	      }
      const res = await api.get(`/conversations?${params.toString()}`);
      return res.data;
    },
    { enabled: true }
  );

  const conversationsData = apiConversationsData;
  const isLoading = apiIsLoading;
  const totalUnread = conversationsData?.totalUnread || 0;

  const { data: conversationDetail, isLoading: isLoadingDetail } = useQuery(
    ['conversation', selectedConversation],
    () => api.get(`/conversations/${selectedConversation}`).then(res => res.data),
    { enabled: !!selectedConversation && !isGuestMode, refetchInterval: 5000 }
  );
  
	  const deleteAllConversationsMutation = useMutation(
	    () => api.delete('/conversations/actions/delete-all'),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('conversations');
        toast.success(data.data.message || 'Todas as conversas foram deletadas.');
        setConfirmDeleteDialogOpen(false);
      },
      onError: (error) => toast.error(error.response?.data?.message || t('conversationsPage.toasts.resetError'))
	    }
	  );

	  // eslint-disable-next-line no-unused-vars
	  const assignLegacyToMasterMutation = useMutation(
	    () => api.post('/conversations/actions/assign-legacy-to-master'),
	    {
	      onSuccess: (response) => {
	        queryClient.invalidateQueries(['conversations', page, channel, teamMemberId]);
	        queryClient.invalidateQueries('conversationsList');
	        toast.success(response.data?.message || 'Conversas antigas associadas ao usuario mestre.');
	      },
	      onError: (error) => toast.error(error.response?.data?.message || 'Erro ao associar conversas antigas.')
	    }
	  );

	  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try { await refetch(); toast.success(t('conversationsPage.toasts.refreshSuccess')); } 
    catch (error) { toast.error(t('conversationsPage.toasts.refreshError')); } 
    finally { setIsRefreshing(false); }
  };

  const allTags = useMemo(() => {
    if (!conversationsData?.conversations) return [];
    const tags = new Set();
    conversationsData.conversations.forEach(conv => {
      if (conv.tags && conv.tags.length > 0) {
        conv.tags.forEach(tag => tags.add(tag));
      }
    });
    return Array.from(tags).sort();
  }, [conversationsData]);

  const isAIActive = (conversation) => {
    return conversation.aiEnabled !== false;
  };
  
  // O filtro agora atua sobre os dados da página atual que a API retornou
  const filteredConversations = useMemo(() => {
    if (!conversationsData?.conversations) return [];
    let filtered = conversationsData.conversations;
    if (filter) {
      const searchTerm = filter.toLowerCase();
      filtered = filtered.filter(c => 
        c.lead?.name?.toLowerCase().includes(searchTerm) ||
        c.lead?.company?.toLowerCase().includes(searchTerm)
      );
    }
    if (selectedTags.length > 0) {
      filtered = filtered.filter(c => c.tags && c.tags.some(tag => selectedTags.includes(tag)));
    }
    return filtered;
  }, [conversationsData, filter, selectedTags]);

  useEffect(() => {
    if (filteredConversations.length > 0) {
      const newColumns = {
        new: { name: 'New Contacts', items: [] },
        engaged: { name: 'Engaged', items: [] },
        qualified: { name: 'Qualified', items: [] },
        scheduledMeeting: { name: 'Meeting Scheduled', items: [] },
        meetingEnded: { name: 'Meeting Ended', items: [] },
        lost: { name: 'Lost (Pre-Sales)', items: [] },
      };

      filteredConversations.forEach(conversation => {
        const qualification = conversation.qualification || 'new';
        if (newColumns[qualification]) {
          newColumns[qualification].items.push(conversation);
        }
      });
      setColumns(newColumns);
    }
  }, [filteredConversations]);

  // ALTERAÇÃO 2: O pageCount agora usa o 'totalPages' que vem da resposta da API.
  const pageCount = conversationsData?.totalPages || 1;

  // ALTERAÇÃO 3: A linha abaixo foi removida, pois a API já entrega os dados paginados.
  // const paginatedConversations = filteredConversations.slice(...);

  const toggleAiMutation = useMutation(
    ({ conversationId, enabled }) => api.put(`/conversations/${conversationId}`, { aiEnabled: enabled }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['conversation', selectedConversation]);
        queryClient.invalidateQueries(['conversations', page]); // Invalida a página atual
        toast.success('Status da IA alterado com sucesso!');
      },
      onError: (error) => toast.error(error.response?.data?.message || t('conversationsPage.toasts.aiStatusError'))
    }
  );

  const updateConversationByAdminMutation = useMutation(
    ({ conversationId, updates }) => api.put(`/admin/conversations/${conversationId}`, updates),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['conversations', page]);
        queryClient.invalidateQueries(['conversation', data.data._id]);
        toast.success(t('conversationsPage.toasts.adminUpdateSuccess'));
      },
      onError: (error) => toast.error(error.response?.data?.message || t('conversationsPage.toasts.adminUpdateError'))
    }
  );

  const updateStatusMutation = useMutation(
    ({ conversationId, status }) => api.patch(`/conversations/${conversationId}/status`, { status }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['conversations', page]);
        toast.success('Status atualizado!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erro ao atualizar status.');
      }
    }
  );

  const deleteConversationMutation = useMutation(
    (conversationId) => api.delete(`/conversations/delete/${conversationId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['conversations', page]);
        toast.success('Conversa deletada com sucesso!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erro ao deletar conversa.');
      }
    }
  );

  const markConversationReadMutation = useMutation(
    (conversationId) => api.put(`/conversations/${conversationId}/read`),
    {
      onSuccess: (_data, conversationId) => {
        queryClient.invalidateQueries(['conversations', page]);
        queryClient.invalidateQueries(['conversation', conversationId]);
      }
    }
  );

  const handleToggleAI = (event) => {
    if (!selectedConversation) return;
    const enabled = event.target.checked;
    toggleAiMutation.mutate({ conversationId: selectedConversation, enabled });
  };

  const handleOpenDialog = (conversationId) => {
    if (isGuestMode) { openModal(); return; }
    setSelectedConversation(conversationId);
    setDialogOpen(true);
    markConversationReadMutation.mutate(conversationId);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedConversation(null);
  };
  
  const handleDeleteConversation = (id, event) => {
    event.stopPropagation();
    deleteConversationMutation.mutate(id);
  };

  const handleDeleteAllConversations = () => {
    deleteAllConversationsMutation.mutate();
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTagClick = (tag) => {
    if (isGuestMode) { openModal(); return; }
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    setPage(1);
  };

  const handleStatusChange = (conversationId, newStatus) => {
    updateStatusMutation.mutate({ conversationId, status: newStatus });
  };

  const handleAddNote = async () => {
    if (!note || !note.trim()) {
      toast.warn('A nota não pode estar vazia.');
      return;
    }
    try {
      await api.post(`/conversations/${selectedConversation}/notes`, { content: note });
      await queryClient.invalidateQueries(['conversation', selectedConversation]);
      await queryClient.invalidateQueries(['conversations', page]);
      toast.success('Nota adicionada com sucesso!');
      setNote('');
    } catch (error) {
      toast.error('Erro ao adicionar nota.');
      console.error('Erro ao adicionar nota:', error);
    }
  };

  const updateQualificationMutation = useMutation(
    ({ conversationId, qualification }) => api.put(`/conversations/${conversationId}`, { qualification }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['conversations', page]);
        toast.success('Qualificação atualizada!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erro ao atualizar qualificação.');
      }
    }
  );

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const findContainer = (id) => {
    return Object.keys(columns).find(
      key => columns[key].items.some(item => item._id === id)
    );
  };

  const handleDragStart = ({ active }) => {
    if (!editMode) return;
    setActiveId(active.id);
    const originalContainer = findContainer(active.id);
    setActiveContainerId(originalContainer);
  };

  const handleDragOver = ({ active, over }) => {
    if (!editMode || !over) {
      return;
    }
  };

  const activeConversation = activeId
    ? Object.values(columns)
      .flatMap(col => col.items)
      .find(item => item._id === activeId)
    : null;

  if (isLoading && !conversationsData) { // Mostra o spinner apenas no carregamento inicial
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'background.default'
      }}>
        <LoadingSpinner />
      </Box>
    );
  }

  return (
    <Box sx={{
      p: 3,
      minHeight: '100vh',
      backgroundColor: 'background.default',
    }}>
      <GlobalStyles styles={{
        'body::-webkit-scrollbar': { width: 10 },
        'body::-webkit-scrollbar-track': {
          background: theme.palette.mode === 'dark'
            ? alpha(theme.palette.common.white, 0.04)
            : alpha(theme.palette.primary.main, 0.06),
        },
        'body::-webkit-scrollbar-thumb': {
          background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.75)}, ${alpha(theme.palette.secondary.main, 0.65)})`,
          borderRadius: 999,
          border: `2px solid ${theme.palette.background.default}`,
        },
        'body::-webkit-scrollbar-thumb:hover': {
          background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        },
        body: {
          scrollbarColor: `${alpha(theme.palette.primary.main, 0.75)} ${alpha(theme.palette.primary.main, 0.08)}`,
          scrollbarWidth: 'thin',
        },
      }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <TextField
          label="Filtrar por nome, empresa ou conteúdo da conversa..."
          variant="outlined"
          fullWidth
          value={filter}
          onChange={(e) => {
            if (isGuestMode) { openModal(); return; }
            setFilter(e.target.value);
            setPage(1);
          }}
          disabled={isGuestMode}
          sx={{ flex: 1 }}
          InputProps={{
            sx: {
              borderRadius: 3,
            }
          }}
        />
        <Tooltip title="Atualizar conversas">
          <IconButton
            onClick={isGuestMode ? openModal : handleManualRefresh}
            color="primary"
            disabled={isRefreshing || isGuestMode}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              }
            }}
          >
            {isRefreshing ? <CircularProgress size={24} color="inherit" /> : <RefreshIcon />}
          </IconButton>
        </Tooltip>
	        {totalUnread > 0 && (
	          <Chip
	            label={`${totalUnread} novas`}
	            color="error"
	            variant="filled"
	            sx={{ fontWeight: 700 }}
	          />
	        )}
	        <Tooltip title="Apagar todas as conversas">
          <span>
            <Button
              onClick={() => {
                if (isGuestMode) { openModal(); return; }
                setConfirmDeleteDialogOpen(true)
              }}
              color="error"
              variant="outlined"
              startIcon={<DeleteIcon />}
              disabled={deleteAllConversationsMutation.isLoading || isGuestMode}
            >
              Resetar
            </Button>
          </span>
        </Tooltip>
      </Box>

      {allTags.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Filtrar por tags:</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {allTags.map(tag => (
              <Chip
                key={tag}
                label={tag}
                clickable
                onClick={() => handleTagClick(tag)}
                color={selectedTags.includes(tag) ? 'primary' : 'default'}
                variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
              />
            ))}
            {selectedTags.length > 0 && (
              <Chip
                label="Limpar filtros"
                clickable
                onClick={() => setSelectedTags([])}
                color="secondary"
                variant="outlined"
                sx={{ ml: 1 }}
              />
            )}
          </Box>
        </Box>
      )}

      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        mb: 3,
        padding: 2,
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1
      }}>
        <Pagination
          count={pageCount}
          page={page}
          onChange={handlePageChange}
          color="primary"
          size="large"
          showFirstButton
          showLastButton
          disabled={isGuestMode}
          sx={{
            '& .MuiPaginationItem-root': {
              fontSize: '1rem',
              margin: '0 4px',
              minWidth: '32px',
              height: '32px',
            },
            '& .Mui-selected': {
              fontWeight: 'bold',
              boxShadow: 1,
            },
          }}
        />
      </Box>

      <Box sx={{ position: 'relative' }}>
        <Grid container spacing={3} sx={{
          mb: 3,
          transition: 'filter 0.3s, opacity 0.3s',
          filter: isGuestMode ? 'blur(4px)' : 'none',
          opacity: isGuestMode ? 0.5 : 1,
          pointerEvents: isGuestMode ? 'none' : 'auto',
        }}>
            {/* ALTERAÇÃO 4: Mapeando a lista filtrada (filteredConversations) em vez da antiga 'paginatedConversations' */}
            {filteredConversations.length > 0 ? (
            filteredConversations.map(conversation => {
                const isEscalated = conversation.status === 'escalated';
                const hasUnread = (conversation.unreadCount || 0) > 0;
                return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={conversation._id}>
                    <Paper
                        elevation={hasUnread ? 8 : 3}
                        sx={{
                        p: 2,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s, background-color 0.2s, border-color 0.2s',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: theme.shadows[6],
                        },
                        border: '1px solid',
                        borderColor: hasUnread ? alpha(theme.palette.warning.main, 0.7) : isEscalated ? theme.palette.error.main : 'transparent',
                        borderLeft: `5px solid ${hasUnread ? theme.palette.warning.main : isEscalated ? theme.palette.error.dark : theme.palette[getStatusColor(conversation.status)]?.main || theme.palette.divider}`,
                        backgroundColor: hasUnread
                          ? alpha(theme.palette.warning.main, 0.11)
                          : isEscalated ? alpha(theme.palette.error.light, 0.15) : 'background.paper',
                        boxShadow: hasUnread ? `0 10px 30px ${alpha(theme.palette.warning.main, 0.23)}` : undefined,
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': hasUnread ? {
                          content: '""',
                          position: 'absolute',
                          inset: 0,
                          pointerEvents: 'none',
                          background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.2)} 0%, transparent 42%)`,
                        } : undefined,
                        }}
                        onClick={() => handleOpenDialog(conversation._id)}
                    >
                        {hasNote(conversation) && (
                        <Tooltip title="Possui notas">
                            <IconButton
                            sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                color: theme.palette.warning.main,
                            }}
                            >
                            <NoteIcon />
                            </IconButton>
                        </Tooltip>
                        )}

                        <Tooltip title="Deletar conversa">
                        <IconButton
                            sx={{
                            position: 'absolute',
                            top: 8,
                            right: hasNote(conversation) ? 48 : 8,
                            color: theme.palette.error.main,
                            }}
                            onClick={(e) => handleDeleteConversation(conversation._id, e)}
                        >
                            <DeleteIcon />
                        </IconButton>
                        </Tooltip>

                        <Box display="flex" alignItems="center" gap={2} mb={1.5}>
                        <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={getChannelIcon(conversation.channel, { fontSize: 'small' })}
                        >
                            <Avatar sx={{ bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}>
                            {conversation.lead?.name ? (
                                conversation.lead.name.charAt(0).toUpperCase()
                            ) : (
                                <PersonIcon />
                            )}
                            </Avatar>
                        </Badge>
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {conversation.lead?.name || 'Contato sem nome'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatPhoneNumber(conversation.lead?.phone)}
                            </Typography>
                            {conversation.channel === 'whatsapp' && conversation.instance && (
                              <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                                <WhatsAppIcon sx={{ fontSize: '0.8rem', mr: 0.5 }} />
                                {conversation.instance.instanceName}
                              </Typography>
                            )}
                        </Box>
                        </Box>

                        {conversation.lead?.company && (
                        <Typography variant="body2" sx={{ mb: 1.5 }}>
                            <strong>Empresa:</strong> {conversation.lead.company}
                        </Typography>
                        )}

                        {conversation.tags?.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
                            {conversation.tags.map(tag => (
                            <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                color="primary"
                                variant="outlined"
                            />
                            ))}
                        </Box>
                        )}

                        <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 1,
                        flexWrap: 'wrap',
                        }}>
                        <Chip
                          label={getStatusLabel(conversation.status)}
                          size="small"
                          color={getStatusColor(conversation.status)}
                          variant="filled"
                          icon={isEscalated ? <WarningIcon sx={{ fontSize: '1rem', color: theme.palette.error.contrastText }} /> : undefined}
                          sx={isEscalated ? {
                            fontWeight: 'bold',
                            color: theme.palette.error.contrastText,
                            backgroundColor: theme.palette.error.main,
                           } : {}}
                        />

                        {(conversation.unreadCount || 0) > 0 && (
                          <Chip
                            label={conversation.unreadCount === 1 ? 'Nova mensagem' : `${conversation.unreadCount} novas mensagens`}
                            size="small"
                            color="warning"
                            sx={{ fontWeight: 900, boxShadow: `0 0 0 3px ${alpha(theme.palette.warning.main, 0.14)}` }}
                          />
                        )}

                        {(conversation.readCount || 0) > 0 && (
                          <Chip
                            label={`${conversation.readCount} lida${conversation.readCount > 1 ? 's' : ''}`}
                            size="small"
                            color="success"
                            variant="outlined"
                          />
                        )}

                        {isAIActive(conversation) ? (
                            <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            backgroundColor: alpha(theme.palette.info.main, 0.1),
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            }}>
                            <AutoAwesomeIcon sx={{
                                fontSize: 16,
                                color: theme.palette.info.main
                            }} />
                            <Typography variant="caption" sx={{
                                color: theme.palette.info.dark,
                                fontWeight: 500,
                            }}>
                                IA Ativa
                            </Typography>
                            </Box>
                        ) : (
                            <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.18)} 0%, ${alpha(theme.palette.warning.main, 0.1)} 100%)`,
                            border: `1px solid ${alpha(theme.palette.error.main, 0.35)}`,
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            animation: 'aiOffPulse 2.5s ease-in-out infinite',
                            '@keyframes aiOffPulse': {
                              '0%, 100%': { opacity: 0.85 },
                              '50%': { opacity: 1 },
                            },
                            }}>
                            <VoiceOverOffIcon sx={{
                                fontSize: 16,
                                color: theme.palette.error.main
                            }} />
                            <Typography variant="caption" sx={{
                                color: theme.palette.error.main,
                                fontWeight: 700,
                            }}>
                                ⚠ IA Desativada
                            </Typography>
                            </Box>
                        )}
                        {conversation.negotiationIntelligence?.temperature &&
                          conversation.negotiationIntelligence.temperature !== 'desconhecido' && (
                            <Chip
                              label={`Temp. ${conversation.negotiationIntelligence.temperature}`}
                              size="small"
                              color={
                                conversation.negotiationIntelligence.temperature === 'quente' ? 'success' :
                                conversation.negotiationIntelligence.temperature === 'morno' ? 'warning' :
                                conversation.negotiationIntelligence.temperature === 'critico' ? 'error' :
                                'info'
                              }
                              variant="outlined"
                              sx={{ fontWeight: 700 }}
                            />
                          )}
                        {['alto', 'critico'].includes(conversation.negotiationIntelligence?.riskLevel) && (
                          <Chip
                            label={`Risco ${conversation.negotiationIntelligence.riskLevel}`}
                            size="small"
                            color="error"
                            sx={{ fontWeight: 800 }}
                          />
                        )}
                        {conversation.negotiationIntelligence?.agreementProbability != null && Number.isFinite(Number(conversation.negotiationIntelligence?.agreementProbability)) && (
                          <Chip
                            label={`${conversation.negotiationIntelligence.agreementProbability}% acordo`}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ fontWeight: 700 }}
                          />
                        )}
                        </Box>

                        {conversation.messages?.length > 0 && (
                        <Typography variant="body2" sx={{
                            mt: 'auto',
                            pt: 1,
                            borderTop: `1px solid ${theme.palette.divider}`,
                            color: 'text.secondary',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                        }}>
                            <strong>Última mensagem:</strong> {conversation.messages[conversation.messages.length - 1].content}
                        </Typography>
                        )}
                    </Paper>
                    </Grid>
                )
            })
            ) : (
            <Grid item xs={12}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                    Nenhuma conversa encontrada
                </Typography>
                </Paper>
            </Grid>
            )}
        </Grid>

        {isGuestMode && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={openModal}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: theme.spacing(3),
                backgroundColor: alpha(theme.palette.background.paper, 0.9),
                borderRadius: '50%',
                boxShadow: theme.shadows[6],
              }}
            >
              <LockIcon sx={{ fontSize: 48, color: 'primary.main' }} />
            </Box>
          </Box>
        )}
      </Box>

      <ConversationDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        conversation={conversationDetail?.conversation}
        isLoading={isLoadingDetail}
        onToggleAI={handleToggleAI}
        isToggleAILoading={toggleAiMutation.isLoading}
        userRole={user?.role}
        onAdminUpdate={updateConversationByAdminMutation.mutate}
        isUpdatingByAdmin={updateConversationByAdminMutation.isLoading}
      />
      
      <Dialog open={confirmDeleteDialogOpen} onClose={() => setConfirmDeleteDialogOpen(false)}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="error" />
          {t('conversationsPage.deleteConfirmDialog.title')}
        </DialogTitle>
        <DialogContent>
          <Typography>
            <Trans i18nKey="conversationsPage.deleteConfirmDialog.message">
              Você tem certeza que deseja apagar <strong>TODAS</strong> as suas conversas? Esta ação é irreversível.
            </Trans>
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: '16px 24px' }}>
          <Button onClick={() => setConfirmDeleteDialogOpen(false)} disabled={deleteAllConversationsMutation.isLoading} color="inherit">
            {t('common.cancel')}
          </Button>
          <GradientButton onClick={() => deleteAllConversationsMutation.mutate()} color="error" disabled={deleteAllConversationsMutation.isLoading} sx={{ background: theme.palette.error.main }}>
            {deleteAllConversationsMutation.isLoading ? <CircularProgress size={24} color="inherit" /> : t('conversationsPage.deleteConfirmDialog.confirmButton')}
          </GradientButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
