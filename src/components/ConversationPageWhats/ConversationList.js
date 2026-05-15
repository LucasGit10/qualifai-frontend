import React, { useEffect, useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  Box, Typography, TextField, List, ListItemText, CircularProgress, Divider, alpha, 
  InputAdornment, Tooltip, useTheme, keyframes, Button, DialogTitle, DialogContent, Badge,
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
import { useSocket } from 'contexts/SocketContext';

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
  const unreadCount = conversation.unreadCount || 0;
  const hasUnread = unreadCount > 0;
  const unreadColor = theme.palette.warning.main;

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
    <ListItemButton
      selected={isSelected}
      onClick={() => onSelect(conversation._id)}
      sx={{
        py: 1.5,
        px: 2,
        alignItems: 'flex-start',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 1.5,
        transition: 'background-color 0.2s, opacity 0.3s, box-shadow 0.2s, transform 0.2s',
        ...getStatusStyles(),
        borderLeft: hasUnread ? `5px solid ${unreadColor}` : undefined,
        boxShadow: hasUnread ? `inset 0 0 0 1px ${alpha(unreadColor, 0.28)}, 0 6px 18px ${alpha(unreadColor, 0.18)}` : undefined,
        backgroundColor: theme.palette.mode === 'dark' 
          ? (isSelected ? alpha(theme.palette.primary.main, 0.25) : hasUnread ? alpha(unreadColor, 0.18) : 'rgba(255, 255, 255, 0.05)')
          : (isSelected ? alpha(theme.palette.primary.main, 0.15) : hasUnread ? alpha(unreadColor, 0.12) : 'rgba(255, 255, 255, 0.8)'),
        '&:hover': {
          transform: 'translateX(2px)',
          backgroundColor: theme.palette.mode === 'dark' 
            ? (hasUnread ? alpha(unreadColor, 0.24) : 'rgba(255, 255, 255, 0.1)')
            : (hasUnread ? alpha(unreadColor, 0.18) : 'rgba(255, 255, 255, 0.9)')
        },
      }}
    >
      <ListItemAvatar sx={{ mt: 0.5 }}>
        <Badge
          color="error"
          overlap="circular"
          badgeContent={hasUnread ? unreadCount : null}
          max={99}
        >
          <Avatar sx={{ background: theme.palette.custom?.gradients?.button, width: 40, height: 40 }}>
              {conversation.lead?.name ? conversation.lead.name.charAt(0).toUpperCase() : '?'}
          </Avatar>
        </Badge>
      </ListItemAvatar>
      <ListItemText
        disableTypography
        primary={
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
            <Box display="flex" alignItems="center" gap={0.5} sx={{ minWidth: 0 }}>
              <Typography variant="subtitle1" noWrap fontWeight={hasUnread ? 800 : 'bold'} color={theme.palette.text.primary}>
                {conversation.lead?.name || 'Lead Desconhecido'}
              </Typography>
              <Tooltip title={isAiActive ? "IA Ativa" : "IA Desativada (Modo Manual)"}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {isAiActive 
                      ? <AiIcon color="info" sx={{ fontSize: 18, opacity: 0.8 }} /> 
                      : <VoiceOverOffIcon sx={{ fontSize: 18, color: theme.palette.error.main }} />
                  }
                </Box>
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                {conversation.lead?.company && (
                  <Chip 
                    icon={<BusinessIcon fontSize="small" />} 
                    label={conversation.lead.company} 
                    size="small" 
                    variant="outlined" 
                    sx={{ height: 20, fontSize: '0.65rem' }}
                  />
                )}
                {!isAiActive && (
                  <Chip 
                    label="IA OFF" 
                    size="small" 
                    color="error"
                    variant="filled"
                    sx={{ height: 20, fontSize: '0.65rem', fontWeight: 'bold' }}
                  />
                )}
            </Box>
            <Typography variant="body2" color={theme.palette.text.secondary} noWrap sx={{ display: 'block', mb: 0.5, fontSize: '0.75rem' }}>
                {formatPhoneNumber(conversation.lead?.phone)}
            </Typography>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color={theme.palette.text.secondary} noWrap sx={{ flex: 1, fontSize: '0.8rem' }}>
                {lastMessage?.content || 'Nenhuma mensagem ainda'}
              </Typography>
              <Box display="flex" gap={0.5} ml={1} alignItems="center">
                {hasNotes && <Tooltip title="Possui notas"><NoteIcon sx={{ fontSize: 14, color: 'warning.main' }} /></Tooltip>}
                <IconButton edge="end" size="small" onClick={(e) => { e.stopPropagation(); onDelete(conversation._id); }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </>
        }
      />
    </ListItemButton>
  );
};

export default function ConversationList({ channel, teamMemberId, selectedConversationId, onSelectConversation, onDeleteConversation }) {
  const queryClient = useQueryClient();
  const theme = useTheme();
  const { socket } = useSocket();
  const [filter, setFilter] = useState('');
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const { t } = useTranslation();

  const { data, isLoading, refetch } = useQuery(
    ['conversationsList', channel, teamMemberId],
    () => {
      const params = new URLSearchParams({ limit: 100, sortBy: 'lastContact' });
      if (channel) params.append('channel', channel);
      if (teamMemberId) params.append('teamMemberId', teamMemberId);
      else params.append('owner', 'master');
      return api.get(`/conversations?${params.toString()}`).then(res => res.data);
    }
  );

  useEffect(() => {
    if (!socket) return;
    const handleUpdate = () => queryClient.invalidateQueries(['conversationsList']);
    socket.on('conversation_updated', handleUpdate);
    socket.on('new_conversation', handleUpdate);
    return () => {
      socket.off('conversation_updated', handleUpdate);
      socket.off('new_conversation', handleUpdate);
    };
  }, [socket, queryClient]);

  const filteredConversations = useMemo(() => {
    if (!data?.conversations) return [];
    return data.conversations.filter(c => c.lead?.name?.toLowerCase().includes(filter.toLowerCase()));
  }, [data, filter]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" fontWeight="bold">Conversas</Typography>
          <IconButton size="small" onClick={() => refetch()}><RefreshIcon /></IconButton>
        </Box>
        <TextField 
          fullWidth 
          variant="outlined" 
          placeholder="Buscar..." 
          size="small"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          InputProps={{ 
            startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
            sx: { borderRadius: 2 }
          }}
        />
      </Box>

      {isLoading ? (
        <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>
      ) : (
        <List sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
          {filteredConversations.map((conv) => (
            <React.Fragment key={conv._id}>
              <ConversationListItem
                conversation={conv}
                isSelected={selectedConversationId === conv._id}
                onSelect={onSelectConversation}
                onDelete={onDeleteConversation}
              />
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}

      <Box sx={{ p: 1, borderTop: 1, borderColor: 'divider' }}>
        <Button 
          fullWidth 
          color="error" 
          size="small" 
          startIcon={<DeleteIcon />}
          onClick={() => setConfirmDeleteDialogOpen(true)}
        >
          Limpar Tudo
        </Button>
      </Box>

      <StyledDialog open={confirmDeleteDialogOpen} onClose={() => setConfirmDeleteDialogOpen(false)}>
        <DialogTitle>Limpar Conversas?</DialogTitle>
        <DialogContent>Deseja apagar todas as conversas? Esta ação é irreversível.</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteDialogOpen(false)}>Cancelar</Button>
          <GradientButton onClick={async () => {
            await api.delete('/conversations/actions/delete-all');
            queryClient.invalidateQueries('conversationsList');
            setConfirmDeleteDialogOpen(false);
          }}>Limpar</GradientButton>
        </DialogActions>
      </StyledDialog>
    </Box>
  );
}
