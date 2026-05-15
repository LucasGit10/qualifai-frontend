import {
  DialogTitle, DialogContent, Box, Typography, IconButton, Paper, Avatar,
  CircularProgress, FormControlLabel, Switch, Tooltip, useTheme, TextField,
  InputAdornment, Button, Alert, Chip, Select, MenuItem, InputLabel, FormControl, alpha,
} from '@mui/material';
import { 
  Close as CloseIcon, 
  Send as SendIcon, 
  Info as InfoIcon, 
  WhatsApp as WhatsAppIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  RecordVoiceOver as AiIcon,
  SmartToy as SmartToyIcon,
  PowerOff as PowerOffIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import React, { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';
import NotesDialog from './NotesDialog';
import api from '../../services/api';
import { toast } from 'react-toastify';

// ALTERAÇÃO: Importando nossos componentes de UI reutilizáveis
import { StyledDialog } from '../../components/ui/StyledDialog';
import { GradientButton } from '../../components/ui/GradientButton';

const locales = { pt: ptBR, en: enUS };

const MessageBubble = ({ message, safeFormatDate, getMessageRoleLabel, theme, t }) => {
  const isLead = message.role === 'lead';
  
  const getAvatar = () => {
    switch(message.role) {
      case 'ai':
        return (
          <Avatar sx={{ width: 32, height: 32, background: 'linear-gradient(45deg, #0288d1 30%, #26c6da 90%)', color: 'white' }}>
            <AiIcon fontSize="small" />
          </Avatar>
        );
      case 'human':
        return (
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'info.main', color: 'info.contrastText' }}>
            <PersonIcon fontSize="small" />
          </Avatar>
        );
      default: // lead
        return (
          <Avatar sx={{ width: 32, height: 32, background: theme.palette.custom?.gradients?.button, color: 'primary.contrastText' }}>
            <PersonIcon fontSize="small" />
          </Avatar>
        );
    }
  };

  if (message.role === 'system') {
    return (
      <Box sx={{ my: 1.5, display: 'flex', justifyContent: 'center' }}>
        <Chip 
          icon={<InfoIcon />} 
          label={message.content.replace('[SISTEMA] ', '')} 
          size="small"
          sx={{ 
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(5px)',
            color: theme.palette.text.primary,
            border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
          }} 
        />
      </Box>
    );
  }

  return (
    <Box sx={{
      my: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: isLead ? 'flex-start' : 'flex-end',
    }}>
      <Paper
        elevation={1}
        sx={{
          p: 1.5,
          borderRadius: isLead ? '20px 20px 20px 5px' : '20px 20px 5px 20px',
          background: isLead 
            ? (theme.palette.custom?.gradients?.button || 'linear-gradient(45deg, #8E24AA 30%, #D81B60 90%)')
            : (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)'),
          backdropFilter: isLead ? 'none' : 'blur(10px)',
          color: isLead ? 'primary.contrastText' : theme.palette.text.primary,
          maxWidth: '80%',
          minWidth: '100px',
          border: isLead ? 'none' : `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexDirection: isLead ? 'row' : 'row-reverse' }}>
          {getAvatar()}
          <Typography variant="caption" sx={{ fontWeight: 'bold', color: isLead ? 'rgba(255,255,255,0.9)' : theme.palette.text.primary }}>
            {getMessageRoleLabel(message.role)}
          </Typography>
        </Box>
        {message.metadata?.audioUrl && (
          <Box sx={{ my: 1, maxWidth: '100%' }}>
            <audio controls style={{ width: '100%', height: '40px' }} src={message.metadata.audioUrl}>
              {t('conversationDialog.audioNotSupported')}
            </audio>
          </Box>
        )}
        <Typography variant="body2" sx={{ 
          whiteSpace: 'pre-wrap', 
          wordBreak: 'break-word', 
          my: 1,
          color: isLead ? 'rgba(255,255,255,0.95)' : theme.palette.text.primary,
        }}>
          {message.content}
        </Typography>
        <Typography variant="caption" sx={{ 
          color: isLead ? 'rgba(255, 255, 255, 0.7)' : theme.palette.text.secondary, 
          textAlign: 'right',
          width: '100%',
          display: 'block'
        }}>
          {safeFormatDate(message.timestamp)}
        </Typography>
      </Paper>
    </Box>
  );
};

export default function ConversationDialog({
  open, onClose, conversation, isLoading, onToggleAI,
  isToggleAILoading, userRole, onAdminUpdate, isUpdatingByAdmin,
}) {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [notesOpen, setNotesOpen] = useState(false);
  const [message, setMessage] = useState('');
  const currentLocale = locales[i18n.language] || ptBR;
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (open) setMessage('');
    scrollToBottom();
  }, [open, conversation?.messages]);

  const formatPhoneNumber = (phone) => {
    if (!phone) return t('conversationDialog.noPhone');
    const cleaned = ('' + phone).replace(/\D/g, '');
    if (cleaned.length === 13) return `+${cleaned.substring(0, 2)} (${cleaned.substring(2, 4)}) ${cleaned.substring(4, 9)}-${cleaned.substring(9)}`;
    if (cleaned.length === 11) return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
    return phone;
  };
  
  const safeFormatDate = (dateString) => {
    try {
      if (!dateString) return '';
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? '' : format(date, 'Pp', { locale: currentLocale });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return '';
    }
  };

  const sendMessageMutation = useMutation(
    async ({ messagePayload, provider }) => {
      const endpoint = provider === 'whatsapp' && conversation.channel === 'whatsapp'
        ? '/whatsapp/send'
        : `/conversations/${messagePayload.conversationId}/messages`;
      return api.post(endpoint, messagePayload);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['conversation', conversation?._id]);
        setMessage('');
        toast.success(t('conversationDialog.toasts.sendSuccess'));
      },
      onError: (error) => toast.error(error.response?.data?.message || t('conversationDialog.toasts.sendError')),
    }
  );

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !conversation) return;
    try {
      const response = await queryClient.fetchQuery('whatsappProvider', () => api.get('/whatsapp-ai/whatsapp-provider'));
      const provider = response?.data?.provider || 'whatsapp';

      sendMessageMutation.mutate({ 
        messagePayload: { conversationId: conversation._id, message: message, senderRole: 'human' }, 
        provider 
      });
    } catch (error) {
      toast.error(t('conversationDialog.toasts.providerConfigError'));
      console.error("Erro na requisição de whatsappProvider:", error);
    }
  };

  const handleKeyPress = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); } };
  const handleAdminUpdate = (updates) => onAdminUpdate?.({ conversationId: conversation._id, updates });
  
  const isAdmin = userRole === 'admin';
  const isLoadingAnything = isLoading || isToggleAILoading || isUpdatingByAdmin;
  
  const messages = conversation?.messages || [];
  const getMessageRoleLabel = (role) => t(`conversationDialog.messageRoles.${role}`, { defaultValue: role });

  return (
    <>
      <StyledDialog 
        open={open} 
        onClose={onClose} 
        maxWidth="md" 
        fullWidth 
        PaperProps={{ sx: { height: '90vh', maxHeight: '800px', display: 'flex', flexDirection: 'column' } }}
      >
        <DialogTitle sx={{ 
          p: 2, 
          borderBottom: 1, 
          borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6" component="div" fontWeight="bold" color={theme.palette.text.primary}>
                {conversation?.lead?.name || t('conversationDialog.titleFallback')}
              </Typography>
              <Typography variant="body2" color={theme.palette.text.secondary}>
                {conversation?.lead?.company || t('conversationDialog.noCompany')}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Tooltip title={t('conversationDialog.tooltips.viewNotes')}>
                <IconButton onClick={() => setNotesOpen(true)} color="primary" disabled={!conversation}>
                  <DescriptionIcon />
                </IconButton>
              </Tooltip>
              <IconButton onClick={onClose}>
                <CloseIcon sx={{ color: theme.palette.text.primary }} />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent 
          dividers={false} 
          sx={{ 
            p: 0, 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            overflow: 'hidden',
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.5)',
          }}
        >
          {(isLoading || !conversation) ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Box sx={{ 
                p: 2, 
                borderBottom: 1, 
                borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
              }}>
                {conversation.status === 'escalated' && (
                  <Alert severity="warning" variant="outlined" sx={{ 
                    mb: 2, 
                    borderColor: 'warning.light', 
                    color: 'warning.light', 
                    '& .MuiAlert-icon': { color: 'warning.light' } 
                  }}>
                    {t('conversationDialog.escalatedAlert')}
                  </Alert>
                )}
                {conversation.aiEnabled === false && (
                  <Box sx={{
                    mb: 2,
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    borderRadius: 2,
                    background: theme.palette.mode === 'dark'
                      ? `linear-gradient(135deg, ${alpha(theme.palette.error.dark, 0.35)} 0%, ${alpha(theme.palette.warning.dark, 0.2)} 100%)`
                      : `linear-gradient(135deg, ${alpha(theme.palette.error.light, 0.18)} 0%, ${alpha(theme.palette.warning.light, 0.12)} 100%)`,
                    border: `1px solid ${alpha(theme.palette.error.main, 0.4)}`,
                    boxShadow: `0 0 20px ${alpha(theme.palette.error.main, 0.15)}`,
                    animation: 'aiDisabledPulse 3s ease-in-out infinite',
                    '@keyframes aiDisabledPulse': {
                      '0%, 100%': { boxShadow: `0 0 12px ${alpha(theme.palette.error.main, 0.1)}` },
                      '50%': { boxShadow: `0 0 24px ${alpha(theme.palette.error.main, 0.25)}` },
                    },
                  }}>
                    <Box sx={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <SmartToyIcon sx={{ 
                        fontSize: 28, 
                        color: theme.palette.error.main, 
                        opacity: 0.5,
                      }} />
                      <PowerOffIcon sx={{ 
                        fontSize: 16, 
                        color: theme.palette.error.main, 
                        position: 'absolute', 
                        bottom: -2, 
                        right: -4,
                        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#fff',
                        borderRadius: '50%',
                        padding: '1px',
                      }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ 
                        color: theme.palette.error.main, 
                        fontWeight: 700,
                        lineHeight: 1.2,
                      }}>
                        IA Desativada
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        color: theme.palette.text.secondary,
                        lineHeight: 1.3,
                      }}>
                        A automação está pausada. Ative o switch acima para retomar.
                      </Typography>
                    </Box>
                  </Box>
                )}
                <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                  <Chip 
                    icon={<WhatsAppIcon />} 
                    label={formatPhoneNumber(conversation.lead?.phone)} 
                    variant="outlined" 
                    size="small"
                    sx={{ 
                      color: theme.palette.text.primary,
                      borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                    }}
                  />
                  <Box display="flex" alignItems="center" gap={2}>
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={conversation.aiEnabled ?? true} 
                          onChange={(e) => isAdmin ? handleAdminUpdate({ aiEnabled: e.target.checked }) : onToggleAI(e)} 
                          disabled={isLoadingAnything || (conversation.handedOffToHuman && !isAdmin)} 
                          color="secondary" 
                        />
                      }
                      label={t('conversationDialog.aiSwitchLabel')}
                      labelPlacement="start"
                      sx={{ mr: 1, color: theme.palette.text.secondary }}
                    />
                    {isAdmin && (
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel sx={{ color: theme.palette.text.primary }}>
                          {t('conversationDialog.statusLabel')}
                        </InputLabel>
                        <Select
                          value={conversation.status}
                          label={t('conversationDialog.statusLabel')}
                          onChange={(e) => handleAdminUpdate({ status: e.target.value })}
                          disabled={isLoadingAnything}
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
                          <MenuItem value="active">{t('conversationDialog.statuses.active')}</MenuItem>
                          <MenuItem value="closed">{t('conversationDialog.statuses.closed')}</MenuItem>
                          <MenuItem value="escalated">{t('conversationDialog.statuses.escalated')}</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  </Box>
                </Box>
              </Box>

              <Box sx={{ 
                flex: 1, 
                overflowY: 'auto', 
                p: 2,
                '&::-webkit-scrollbar': { width: 8 },
                '&::-webkit-scrollbar-track': {
                  background: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.common.white, 0.03)
                    : alpha(theme.palette.primary.main, 0.04),
                  borderRadius: 4,
                },
                '&::-webkit-scrollbar-thumb': {
                  background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.5)}, ${alpha(theme.palette.secondary.main, 0.4)})`,
                  borderRadius: 4,
                  border: `2px solid transparent`,
                  backgroundClip: 'padding-box',
                  '&:hover': {
                    background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  },
                },
                scrollbarWidth: 'thin',
                scrollbarColor: `${alpha(theme.palette.primary.main, 0.4)} ${alpha(theme.palette.primary.main, 0.06)}`,
              }}>
                {messages.map((message, index) => (
                  <MessageBubble 
                    key={index} 
                    message={message} 
                    safeFormatDate={safeFormatDate}
                    getMessageRoleLabel={getMessageRoleLabel}
                    theme={theme}
                    t={t}
                  />
                ))}
                <div ref={messagesEndRef} />
              </Box>

              <Box 
                component="form" 
                onSubmit={handleSendMessage} 
                sx={{ 
                  p: 2, 
                  borderTop: 1, 
                  borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                }}
              >
                <TextField
                  fullWidth
                  multiline
                  maxRows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('conversationDialog.inputPlaceholder')}
                  variant="outlined"
                  autoFocus
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
                          {sendMessageMutation.isLoading ? <CircularProgress size={24} /> : <SendIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </>
          )}
        </DialogContent>
      </StyledDialog>
      {conversation && ( <NotesDialog open={notesOpen} onClose={() => setNotesOpen(false)} conversationId={conversation._id} /> )}
    </>
  );
}