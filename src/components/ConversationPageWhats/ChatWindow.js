import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
    Box, Typography, CircularProgress, useTheme, IconButton, Avatar, Paper, 
    TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel, 
    FormControlLabel, Switch, Tooltip, Button, DialogActions, DialogContent, DialogTitle, Chip
} from '@mui/material';
import { 
    ArrowBack as ArrowBackIcon, Send as SendIcon, Description as DescriptionIcon, 
    Delete as DeleteIcon, Warning as WarningIcon, Business as BusinessIcon, Phone as PhoneIcon, WhatsApp as WhatsAppIcon,
    SmartToy as SmartToyIcon, PowerOff as PowerOffIcon, InsertDriveFile as InsertDriveFileIcon
} from '@mui/icons-material';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import DocGeneratorDialog from './DocGeneratorDialog';
import api from 'services/api';
import { format } from 'date-fns'; 
import { ptBR } from 'date-fns/locale';
import { toast } from 'react-toastify';
import NotesDialog from '../ConversationPage/NotesDialog';
import NegotiationIntelligencePanel from '../ConversationPage/NegotiationIntelligencePanel';

import { useAuthStore } from 'stores/authStore';
import { useTranslation, Trans } from 'react-i18next';

// ALTERAÇÃO: Importando nossos componentes de UI
import { StyledDialog } from 'components/ui/StyledDialog';
import { GradientButton } from 'components/ui/GradientButton';

const formatPhoneNumber = (phone) => {
    if (!phone) return null;
    const cleaned = ('' + phone).replace(/\D/g, '');
    if (cleaned.length === 13) return `+${cleaned.substring(0, 2)} (${cleaned.substring(2, 4)}) ${cleaned.substring(4, 9)}-${cleaned.substring(9)}`;
    if (cleaned.length === 11) return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
    return phone;
};

const conversationScrollbarSx = (theme) => ({
  scrollbarWidth: 'thin',
  scrollbarColor: `${theme.palette.mode === 'dark' ? 'rgba(37, 117, 252, 0.6)' : 'rgba(109, 40, 217, 0.5)'} transparent`,
  '&::-webkit-scrollbar': { width: 10 },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(180deg, rgba(37, 117, 252, 0.62), rgba(215, 109, 119, 0.5))'
      : 'linear-gradient(180deg, rgba(109, 40, 217, 0.48), rgba(236, 72, 153, 0.38))',
    borderRadius: 999,
    border: '3px solid transparent',
    backgroundClip: 'padding-box',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(180deg, rgba(37, 117, 252, 0.85), rgba(215, 109, 119, 0.72))'
      : 'linear-gradient(180deg, rgba(109, 40, 217, 0.68), rgba(236, 72, 153, 0.56))',
    backgroundClip: 'padding-box',
  },
});

// ALTERAÇÃO: Bolhas de mensagem totalmente reestilizadas
const MessageBubble = ({ message, theme }) => {
    const isLead = message.role === 'lead';
    const isSystem = message.role === 'system';

    if (isSystem) {
      return (
        <Box sx={{ my: 2, display: 'flex', justifyContent: 'center' }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 1, 
              px: 2,
              borderRadius: '12px', 
              background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
              color: theme.palette.text.secondary, 
              maxWidth: '90%',
              border: `1px dashed ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
            }}
          >
            <Typography variant="caption" sx={{ whiteSpace: 'pre-wrap', textAlign: 'center', display: 'block', fontWeight: '500' }}>
              {message.content}
            </Typography>
          </Paper>
        </Box>
      );
    }

    return (
        <Box sx={{ my: 1, display: 'flex', justifyContent: isLead ? 'flex-start' : 'flex-end' }}>
            <Paper 
              elevation={1} 
              sx={{ 
                p: 1.5, 
                borderRadius: isLead ? '20px 20px 20px 5px' : '20px 20px 5px 20px', 
                background: isLead 
                  ? (theme.palette.custom?.gradients?.button || 'linear-gradient(45deg, #8E24AA 30%, #D81B60 90%)')
                  : (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)'),
                backdropFilter: isLead ? 'none' : 'blur(5px)',
                color: isLead ? 'white' : theme.palette.text.primary, 
                maxWidth: '70%',
                border: isLead ? 'none' : `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
              }}
            >
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {message.content}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'block', 
                    textAlign: 'right', 
                    opacity: 0.8, 
                    mt: 1,
                    color: isLead ? 'rgba(255, 255, 255, 0.7)' : theme.palette.text.secondary
                  }}
                >
                  {message.timestamp ? format(new Date(message.timestamp), 'HH:mm', { locale: ptBR }) : ''}
                </Typography>
            </Paper>
        </Box>
    );
};

export default function ChatWindow({ conversationId, onClose, onDelete }) {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const [notesOpen, setNotesOpen] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [docAnchorEl, setDocAnchorEl] = useState(null);
  const [generatorOpen, setGeneratorOpen] = useState(false);
  const [docTypeToGenerate, setDocTypeToGenerate] = useState(null);
  
  const [message, setMessage] = useState('');

  const { data, isLoading, isError } = useQuery(
    ['conversation', conversationId],
    () => api.get(`/conversations/${conversationId}`).then(res => res.data),
    { enabled: !!conversationId, refetchInterval: 3000 }
  );

  const { mutate: markAsRead, isLoading: isMarkingAsRead } = useMutation(
    () => api.put(`/conversations/${conversationId}/read`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('conversationsList');
        queryClient.invalidateQueries(['conversation', conversationId]);
      },
    }
  );

  useEffect(() => {
    if (conversationId && data?.conversation?.unreadCount > 0 && !isMarkingAsRead) {
      markAsRead();
    }
  }, [conversationId, data?.conversation?.unreadCount, isMarkingAsRead, markAsRead]);

  const sendMessageMutation = useMutation(
    async ({ messagePayload, provider }) => {
      const endpoint = provider === 'whatsapp' && data?.conversation?.channel === 'whatsapp'
        ? '/whatsapp/send'
        : `/conversations/${messagePayload.conversationId}/messages`;
      return api.post(endpoint, messagePayload);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['conversation', conversationId]);
        setMessage('');
        toast.success(t('conversationDialog.toasts.sendSuccess'));
      },
      onError: (error) => toast.error(error.response?.data?.message || t('conversationDialog.toasts.sendError')),
    }
  );

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !conversationId) return;
    try {
      const response = await queryClient.fetchQuery('whatsappProvider', () => api.get('/whatsapp-ai/whatsapp-provider'));
      const provider = response?.data?.provider || 'whatsapp';
      sendMessageMutation.mutate({ 
        messagePayload: { conversationId: conversationId, message: message, senderRole: 'human' }, 
        provider 
      });
    } catch (error) {
      toast.error(t('conversationDialog.toasts.providerConfigError'));
      console.error("Erro na requisição de whatsappProvider:", error);
    }
  };
  
  const handleKeyPress = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); } };
  
  const updateConversationMutation = useMutation(
    ({ updates }) => api.put(`/conversations/${conversationId}`, updates),
    {
      onSuccess: () => {
        toast.success('Conversa atualizada!');
        queryClient.invalidateQueries(['conversation', conversationId]);
        queryClient.invalidateQueries('conversationsList');
      },
      onError: (error) => toast.error(error.response?.data?.message || 'Erro ao atualizar a conversa.'),
    }
  );

  const analyzeNegotiationMutation = useMutation(
    () => api.post(`/conversations/${conversationId}/negotiation-intelligence`),
    {
      onSuccess: (response) => {
        queryClient.setQueryData(['conversation', conversationId], response.data);
        queryClient.invalidateQueries(['conversation', conversationId]);
        queryClient.invalidateQueries('conversationsList');
        toast.success('Central inteligente atualizada.');
      },
      onError: (error) => toast.error(error.response?.data?.message || 'Erro ao analisar a negociação.'),
    }
  );
  
  const handleDelete = () => {
    onDelete(conversationId);
    setConfirmDeleteDialogOpen(false);
  };

  const handleStatusChange = (e) => updateConversationMutation.mutate({ updates: { status: e.target.value } });
  const handleToggleAI = (e) => updateConversationMutation.mutate({ updates: { aiEnabled: e.target.checked } });

  const handleDocClick = (event) => setDocAnchorEl(event.currentTarget);
  const handleDocClose = () => setDocAnchorEl(null);

  const handleOpenGenerator = (type) => {
    setDocTypeToGenerate(type);
    setGeneratorOpen(true);
    handleDocClose();
  };

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100%',
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.5)',
      }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (isError || !data) {
    return (
      <Box sx={{ 
        p: 3,
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.5)',
      }}>
        <Typography color="error">Erro ao carregar a conversa.</Typography>
      </Box>
    );
  }

  const { conversation } = data;
  const isAdmin = user?.role === 'admin';

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          borderBottom: 1, 
          borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
        }}>
          <IconButton onClick={onClose} sx={{ display: { md: 'none' } }}>
            <ArrowBackIcon sx={{ color: theme.palette.text.primary }} />
          </IconButton>
          <Avatar sx={{ background: theme.palette.custom?.gradients?.button, width: 48, height: 48 }}>
            {conversation.lead?.name ? conversation.lead.name.charAt(0).toUpperCase() : '?'}
          </Avatar>
          <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="bold" color={theme.palette.text.primary}>
                {conversation.lead.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
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
                {conversation.lead?.phone && (
                  <Chip 
                    icon={<PhoneIcon fontSize="small" />} 
                    label={formatPhoneNumber(conversation.lead.phone)} 
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
                    icon={<WhatsAppIcon fontSize="small" />} 
                    label={conversation.instance.instanceName} 
                    size="small" 
                    sx={{ 
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)',
                      color: theme.palette.text.primary,
                    }}
                  />
                )}
              </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0, sm: 2 } }}>
              <Tooltip title="Gerar Documento">
                <IconButton onClick={handleDocClick}>
                  <InsertDriveFileIcon sx={{ color: theme.palette.text.primary }} />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={docAnchorEl}
                open={Boolean(docAnchorEl)}
                onClose={handleDocClose}
              >
                <MenuItem onClick={() => handleOpenGenerator('aditivo')}>Aditivo Contratual</MenuItem>
                <MenuItem onClick={() => handleOpenGenerator('confissao')}>Termo de Confissão</MenuItem>
              </Menu>
              <Tooltip title="Ver Notas">
                <IconButton onClick={() => setNotesOpen(true)}>
                  <DescriptionIcon sx={{ color: theme.palette.text.primary }} />
                </IconButton>
              </Tooltip>
              <FormControlLabel 
                control={
                  <Switch 
                    checked={conversation.aiEnabled ?? true} 
                    onChange={handleToggleAI} 
                    disabled={updateConversationMutation.isLoading} 
                  />
                } 
                label="IA" 
                labelPlacement="start" 
                sx={{ 
                  color: theme.palette.text.secondary, 
                  display: { xs: 'none', sm: 'flex' }, 
                  '& .MuiTypography-root': { fontSize: '0.8rem' } 
                }} 
              />
              {isAdmin && (
                <FormControl size="small" sx={{ minWidth: 120, display: { xs: 'none', md: 'flex' } }}>
                  <InputLabel sx={{ color: theme.palette.text.primary }}>Status</InputLabel>
                  <Select
                    value={conversation.status}
                    label="Status"
                    onChange={handleStatusChange}
                    disabled={updateConversationMutation.isLoading}
                    sx={{
                      color: theme.palette.text.primary,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                      },
                    }}
                  >
                    <MenuItem value="active">Ativa</MenuItem>
                    <MenuItem value="closed">Fechada</MenuItem>
                    <MenuItem value="escalated">Escalada</MenuItem>
                  </Select>
                </FormControl>
              )}
              <Tooltip title="Excluir Conversa">
                <IconButton onClick={() => setConfirmDeleteDialogOpen(true)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
          </Box>
        </Box>

        {conversation.aiEnabled === false && (
          <Box sx={{
            mx: { xs: 1, sm: 2, md: 3 },
            mt: 2,
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            borderRadius: 2,
            background: theme.palette.mode === 'dark'
              ? `linear-gradient(135deg, rgba(211,47,47,0.3) 0%, rgba(237,108,2,0.15) 100%)`
              : `linear-gradient(135deg, rgba(211,47,47,0.12) 0%, rgba(237,108,2,0.08) 100%)`,
            border: `1px solid rgba(211,47,47,0.4)`,
            boxShadow: `0 0 20px rgba(211,47,47,0.12)`,
            animation: 'aiDisabledPulse 3s ease-in-out infinite',
            '@keyframes aiDisabledPulse': {
              '0%, 100%': { boxShadow: `0 0 12px rgba(211,47,47,0.08)` },
              '50%': { boxShadow: `0 0 24px rgba(211,47,47,0.2)` },
            },
          }}>
            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SmartToyIcon sx={{ fontSize: 28, color: theme.palette.error.main, opacity: 0.5 }} />
              <PowerOffIcon sx={{ 
                fontSize: 16, color: theme.palette.error.main, position: 'absolute', bottom: -2, right: -4,
                backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#fff',
                borderRadius: '50%', padding: '1px',
              }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" sx={{ color: theme.palette.error.main, fontWeight: 700, lineHeight: 1.2 }}>
                IA Desativada
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary, lineHeight: 1.3 }}>
                A automação está pausada. Ative o switch de IA para retomar.
              </Typography>
            </Box>
          </Box>
        )}

        <Box sx={{ px: { xs: 1, sm: 2, md: 3 }, pt: 2 }}>
          <NegotiationIntelligencePanel
            intelligence={conversation.negotiationIntelligence}
            isAnalyzing={analyzeNegotiationMutation.isLoading}
            onAnalyze={() => analyzeNegotiationMutation.mutate()}
            onUseMessage={(suggestedMessage) => setMessage(suggestedMessage || '')}
            compact
          />
        </Box>

        <Box sx={{ 
          flex: 1, 
          overflowY: 'auto', 
          p: { xs: 1, sm: 2, md: 3 }, 
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.5)',
          ...conversationScrollbarSx(theme),
        }}>
          {conversation.messages.map((msg, index) => (
            <MessageBubble key={index} message={msg} theme={theme} />
          ))}
        </Box>

        <Box component="form" onSubmit={handleSendMessage} sx={{ 
          p: 2, 
          borderTop: 1, 
          borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
        }}>
          <TextField 
            fullWidth 
            multiline 
            maxRows={4} 
            placeholder="Digite uma mensagem..." 
            variant="outlined"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            InputProps={{ 
              sx: { 
                borderRadius: 8, 
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)',
                '& .MuiOutlinedInput-input': {
                  color: theme.palette.text.primary,
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                },
              }, 
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton 
                    type="submit" 
                    color="primary" 
                    disabled={!message.trim() || sendMessageMutation.isLoading}
                  >
                    {sendMessageMutation.isLoading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }} 
          />
        </Box>
      </Box>

      <NotesDialog open={notesOpen} onClose={() => setNotesOpen(false)} conversationId={conversationId} />
      
      <DocGeneratorDialog 
        open={generatorOpen} 
        onClose={() => setGeneratorOpen(false)} 
        docType={docTypeToGenerate} 
        conversation={conversation} 
      />
      
      <StyledDialog open={confirmDeleteDialogOpen} onClose={() => setConfirmDeleteDialogOpen(false)}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="error" />
          <Typography variant="h6" color={theme.palette.text.primary}>
            Excluir esta conversa?
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography color={theme.palette.text.primary}>
            <Trans i18nKey="conversationsPage.dialogs.confirmDeleteSingle">
              Você tem certeza que deseja apagar esta conversa com <strong>{{leadName: conversation.lead.name}}</strong>? Esta ação é irreversível.
            </Trans>
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: '16px 24px' }}>
          <Button 
            onClick={() => setConfirmDeleteDialogOpen(false)} 
            color="inherit"
            sx={{ color: theme.palette.text.secondary }}
          >
            Cancelar
          </Button>
          <GradientButton 
            onClick={handleDelete} 
            color="error" 
            sx={{ background: theme.palette.error.main }}
          >
            Confirmar Exclusão
          </GradientButton>
        </DialogActions>
      </StyledDialog>
    </>
  );
}
