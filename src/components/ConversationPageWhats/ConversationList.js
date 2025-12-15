import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  Box, Typography, TextField, List, ListItemText, CircularProgress, Divider, alpha, 
  InputAdornment, Tooltip, useTheme, keyframes, Button, DialogTitle, DialogContent, 
  DialogActions, IconButton, Chip, ListItemAvatar, Avatar, ListItemButton
} from '@mui/material';
import { 
    Search as SearchIcon, Note as NoteIcon, VoiceOverOff as VoiceOverOffIcon, 
    Delete as DeleteIcon, Warning as WarningIcon, Refresh as RefreshIcon, Business as BusinessIcon,
    AutoAwesome as AiIcon
} from '@mui/icons-material';
import api from 'services/api';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTranslation, Trans } from 'react-i18next';
import { toast } from 'react-toastify';

// ALTERAÇÃO: Importando nossos componentes de UI
import { StyledDialog } from '../ui/StyledDialog';
import { GradientButton } from '../ui/GradientButton';

const pulseAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 ${alpha('#f44336', 0.7)}; }
  70% { box-shadow: 0 0 0 10px rgba(244, 67, 54, 0); }
  100% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0); }
`;

const formatPhoneNumber = (phone) => {
    if (!phone) return null;
    const cleaned = ('' + phone).replace(/\D/g, '');
    if (cleaned.length === 13) return `+${cleaned.substring(0, 2)} (${cleaned.substring(2, 4)}) ${cleaned.substring(4, 9)}-${cleaned.substring(9)}`;
    if (cleaned.length === 11) return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
    return phone;
};

const ConversationListItem = ({ conversation, isSelected, onSelect, onDelete }) => {
  const theme = useTheme();
  const lastMessage = conversation.messages[conversation.messages.length - 1];
  const hasNotes = conversation.notes && conversation.notes.length > 0;
  const isAiActive = conversation.aiEnabled !== false;

  // ALTERAÇÃO: Estilos de status adaptados para o fundo de vidro
  const getStatusStyles = () => {
    switch (conversation.status) {
      case 'escalated':
        return { 
          borderLeft: `4px solid ${theme.palette.error.main}`, 
          animation: `${pulseAnimation} 2s infinite`, 
          backgroundColor: isSelected ? alpha(theme.palette.primary.main, 0.25) : alpha(theme.palette.error.main, 0.15) 
        };
      case 'active':
        return { borderLeft: `4px solid ${theme.palette.success.main}` };
      case 'closed':
        return { borderLeft: `4px solid ${theme.palette.grey[600]}`, opacity: 0.7 };
      default:
        return { borderLeft: `4px solid transparent` };
    }
  };

  return (
    // ALTERAÇÃO: Usando ListItemButton para melhor semântica e efeito de hover
    <ListItemButton
      selected={isSelected}
      onClick={() => onSelect(conversation._id)}
      sx={{
        py: 1.5,
        px: 2,
        alignItems: 'flex-start',
        transition: 'background-color 0.2s, opacity 0.3s',
        ...getStatusStyles(),
        backgroundColor: theme.palette.mode === 'dark' 
          ? (isSelected ? alpha(theme.palette.primary.main, 0.25) : 'rgba(255, 255, 255, 0.05)')
          : (isSelected ? alpha(theme.palette.primary.main, 0.15) : 'rgba(255, 255, 255, 0.8)'),
        '&:hover': {
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(255, 255, 255, 0.9)'
        },
        '&.Mui-selected': { 
          backgroundColor: theme.palette.mode === 'dark'
            ? alpha(theme.palette.primary.main, 0.25)
            : alpha(theme.palette.primary.main, 0.15),
          '&:hover': { 
            backgroundColor: theme.palette.mode === 'dark'
              ? alpha(theme.palette.primary.main, 0.35)
              : alpha(theme.palette.primary.main, 0.25)
          } 
        },
      }}
    >
      <ListItemAvatar sx={{ mt: 0.5 }}>
        <Avatar sx={{ background: theme.palette.custom?.gradients?.button }}>
            {conversation.lead?.name ? conversation.lead.name.charAt(0).toUpperCase() : '?'}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        disableTypography
        primary={
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
            <Box display="flex" alignItems="center" gap={0.5} sx={{ minWidth: 0 }}>
              <Typography variant="subtitle1" noWrap fontWeight="bold" color={theme.palette.text.primary}>
                {conversation.lead?.name || 'Lead Desconhecido'}
              </Typography>
              <Tooltip title={isAiActive ? "IA Ativa" : "IA Desativada"}>
                {isAiActive 
                    ? <AiIcon color="info" sx={{ fontSize: 18 }} /> 
                    : <VoiceOverOffIcon color="action" sx={{ fontSize: 18 }} />
                }
              </Tooltip>
            </Box>
            {lastMessage && (
              <Typography variant="caption" color={theme.palette.text.secondary} sx={{ ml: 1, whiteSpace: 'nowrap' }}>
                {formatDistanceToNow(new Date(lastMessage.timestamp), { locale: ptBR, addSuffix: true })}
              </Typography>
            )}
          </Box>
        }
        secondary={
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                {conversation.lead?.company && (
                  <Chip 
                    icon={<BusinessIcon fontSize="small" />} 
                    label={conversation.lead.company} 
                    size="small" 
                    variant="outlined" 
                    sx={{ 
                      color: theme.palette.text.primary,
                      borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'
                    }}
                  />
                )}
                {conversation.instance?.instanceName && (
                  <Chip 
                    label={conversation.instance.instanceName} 
                    size="small" 
                    variant="outlined" 
                    sx={{ 
                      color: theme.palette.text.primary,
                      borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'
                    }}
                  />
                )}
            </Box>
            <Typography variant="body2" color={theme.palette.text.secondary} noWrap sx={{ display: 'block', mb: 1 }}>
                {formatPhoneNumber(conversation.lead?.phone)}
            </Typography>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color={theme.palette.text.secondary} noWrap sx={{ flex: 1 }}>
                {lastMessage?.content || 'Nenhuma mensagem ainda'}
              </Typography>
              <Box display="flex" gap={1} ml={1}>
                {hasNotes && <Tooltip title="Possui notas"><NoteIcon sx={{ fontSize: 16, color: 'warning.main' }} /></Tooltip>}
                <Tooltip title="Excluir Conversa">
                  <IconButton edge="end" size="small" aria-label="delete" onClick={(e) => onDelete(conversation._id, e)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </>
        }
      />
    </ListItemButton>
  );
};

export default function ConversationList({ channel, selectedConversationId, onSelectConversation, onDeleteConversation }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const [filter, setFilter] = useState('');
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const { data, isLoading, refetch } = useQuery(
    ['conversationsList', channel], 
    () => {
      const params = new URLSearchParams({ limit: 100, sortBy: 'lastContact' });
      if (channel) {
        params.append('channel', channel);
      }
      return api.get(`/conversations?${params.toString()}`).then(res => res.data);
    }
  );

  const deleteAllConversationsMutation = useMutation(
    () => api.delete('/conversations/actions/delete-all'),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('conversationsList');
        toast.success(data.data.message || t('conversationsPage.toasts.resetSuccess'));
        setConfirmDeleteDialogOpen(false);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || t('conversationsPage.toasts.resetError'));
        setConfirmDeleteDialogOpen(false);
      }
    }
  );

  const filteredConversations = useMemo(() => {
    if (!data?.conversations) return [];
    return data.conversations.filter(c => c.lead?.name?.toLowerCase().includes(filter.toLowerCase()));
  }, [data, filter]);

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* ALTERAÇÃO: Header com borda transparente */}
        <Box sx={{ 
          p: 2, 
          borderBottom: 1, 
          borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
        }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom color={theme.palette.text.primary}>
            Conversas
          </Typography>
          <TextField 
            fullWidth 
            variant="outlined" 
            placeholder="Buscar conversas..." 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)} 
            size="small" 
            InputProps={{ 
              startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>, 
              sx: { 
                borderRadius: 8, 
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)',
                '& .MuiOutlinedInput-input': {
                  color: theme.palette.text.primary,
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                },
              } 
            }} 
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button 
              size="small" 
              startIcon={<RefreshIcon />} 
              onClick={() => refetch()} 
              disabled={isLoading}
              sx={{ color: theme.palette.text.primary }}
            >
              Atualizar
            </Button>
            <Button 
              size="small" 
              color="error" 
              startIcon={<DeleteIcon />} 
              onClick={() => setConfirmDeleteDialogOpen(true)} 
              disabled={deleteAllConversationsMutation.isLoading}
            >
              Resetar Todas
            </Button>
          </Box>
        </Box>

        {isLoading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            flex: 1,
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.5)',
          }}>
            <CircularProgress />
          </Box>
        ) : (
          <List sx={{ 
            flex: 1, 
            overflowY: 'auto', 
            p: 0,
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.5)',
          }}>
            {filteredConversations.map((conv) => (
              <React.Fragment key={conv._id}>
                <ConversationListItem
                  conversation={conv}
                  isSelected={selectedConversationId === conv._id}
                  onSelect={onSelectConversation}
                  onDelete={onDeleteConversation}
                />
                <Divider component="li" sx={{ borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)' }} />
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>

      {/* ALTERAÇÃO: Usando StyledDialog e GradientButton */}
      <StyledDialog open={confirmDeleteDialogOpen} onClose={() => setConfirmDeleteDialogOpen(false)}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="error" />
          <Typography variant="h6" color={theme.palette.text.primary}>
            {t('conversationsPage.deleteConfirmDialog.title')}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography color={theme.palette.text.primary}>
            <Trans i18nKey="conversationsPage.deleteConfirmDialog.message">
              Você tem certeza que deseja apagar <strong>TODAS</strong> as suas conversas? Esta ação é irreversível.
            </Trans>
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: '16px 24px' }}>
          <Button 
            onClick={() => setConfirmDeleteDialogOpen(false)} 
            disabled={deleteAllConversationsMutation.isLoading} 
            color="inherit"
            sx={{ color: theme.palette.text.secondary }}
          >
            {t('common.cancel')}
          </Button>
          <GradientButton 
            onClick={() => deleteAllConversationsMutation.mutate()} 
            color="error" 
            disabled={deleteAllConversationsMutation.isLoading}
            sx={{ background: theme.palette.error.main }}
          >
            {deleteAllConversationsMutation.isLoading ? <CircularProgress size={24} color="inherit" /> : t('conversationsPage.deleteConfirmDialog.confirmButton')}
          </GradientButton>
        </DialogActions>
      </StyledDialog>
    </>
  );
}