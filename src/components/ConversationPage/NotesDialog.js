import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Paper,
  TextField,
  CircularProgress,
  Divider,
  Avatar,
  Skeleton,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Close as CloseIcon,
  Send as SendIcon,
  StickyNote2 as NoteIcon,
  SpeakerNotesOff as NoNotesIcon,
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../stores/authStore';

// ALTERAÇÃO: Importando os componentes reutilizáveis
import { StyledDialog } from '../../components/ui/StyledDialog';
import { GradientButton } from '../../components/ui/GradientButton';

// ALTERAÇÃO: Componente de nota totalmente reestilizado para o tema de vidro
const NoteItem = ({ noteText, theme }) => {
  // Regex aprimorado para ser mais robusto
  const parts = noteText.match(/^(.*?) \[(.*?)\]:\s*(.*)$/s);
  
  // Se a nota não tiver o formato [Autor][Data]: Conteúdo, exibe como uma nota simples
  if (!parts) {
    return (
      <Paper
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(5px)',
          border: `1px solid ${alpha(theme.palette.primary.light, 0.2)}`,
          display: 'flex',
          gap: 2,
          alignItems: 'flex-start',
        }}
      >
        <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.3) }}><NoteIcon fontSize="small" /></Avatar>
        <Typography variant="body2" sx={{ whiteSpace: 'pre-line', color: theme.palette.text.primary, pt: 0.5 }}>{noteText}</Typography>
      </Paper>
    );
  }

  const [, author, timestamp, content] = parts;
  
  const formattedDate = () => {
    try {
      return format(parseISO(timestamp), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch {
      return timestamp;
    }
  };

  return (
    <Paper
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2,
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(5px)',
        border: `1px solid ${alpha(theme.palette.primary.light, 0.2)}`,
        display: 'flex',
        gap: 2,
        alignItems: 'flex-start',
      }}
    >
      <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.3) }}>{author.charAt(0).toUpperCase()}</Avatar>
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
            {author}
          </Typography>
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
            {formattedDate()}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ whiteSpace: 'pre-line', color: theme.palette.text.primary }}>
          {content.trim()}
        </Typography>
      </Box>
    </Paper>
  );
};

const NotesDialog = ({ open, onClose, conversationId }) => {
  const [newNote, setNewNote] = useState('');
  const queryClient = useQueryClient();
  const theme = useTheme();
  const { user } = useAuthStore();

  const { data: conversation, isLoading } = useQuery(
    ['conversation', conversationId],
    () => api.get(`/conversations/${conversationId}`).then(res => res.data),
    { enabled: !!conversationId && open, refetchInterval: 5000 }
  );

  const addNoteMutation = useMutation(
    (noteContent) => api.post(`/conversations/${conversationId}/notes`, { content: noteContent }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['conversation', conversationId]);
        setNewNote('');
        toast.success('Nota adicionada com sucesso!');
      },
      onError: (error) => toast.error(error.response?.data?.message || 'Erro ao adicionar nota')
    }
  );

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    addNoteMutation.mutate(newNote);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleAddNote();
    }
  };

  const notes = conversation?.conversation?.notes || [];

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${theme.palette.divider}`
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <NoteIcon color="primary" />
          <Typography variant="h6" color={theme.palette.text.primary}>
            Notas da Conversa
          </Typography>
          {notes.length > 0 && (
            <Box
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: 1,
                backgroundColor: alpha(theme.palette.primary.main, 0.2),
                color: theme.palette.primary.main,
                fontSize: '0.75rem',
                fontWeight: 'bold',
              }}
            >
              {notes.length}
            </Box>
          )}
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ 
        p: 0,
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.7)',
      }}>
        {/* Área de Nova Nota */}
        <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <TextField
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            placeholder="Digite sua nota aqui... (Ctrl + Enter para enviar)"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={addNoteMutation.isLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(5px)',
                '& fieldset': {
                  borderColor: alpha(theme.palette.primary.light, 0.3),
                },
                '&:hover fieldset': {
                  borderColor: alpha(theme.palette.primary.light, 0.5),
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <GradientButton
              onClick={handleAddNote}
              disabled={!newNote.trim() || addNoteMutation.isLoading}
              startIcon={addNoteMutation.isLoading ? <CircularProgress size={16} /> : <SendIcon />}
              sx={{ minWidth: 120 }}
            >
              {addNoteMutation.isLoading ? 'Enviando...' : 'Adicionar Nota'}
            </GradientButton>
          </Box>
        </Box>

        {/* Lista de Notas */}
        <Box sx={{ p: 2, maxHeight: 400, overflow: 'auto' }}>
          {isLoading ? (
            Array.from(new Array(3)).map((_, index) => (
              <Paper key={index} sx={{ p: 2, mb: 2, display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Skeleton variant="text" width={100} height={20} />
                    <Skeleton variant="text" width={80} height={16} />
                  </Box>
                  <Skeleton variant="text" height={16} />
                  <Skeleton variant="text" height={16} />
                  <Skeleton variant="text" width="60%" height={16} />
                </Box>
              </Paper>
            ))
          ) : notes.length > 0 ? (
            notes.map((note, index) => (
              <NoteItem key={index} noteText={note} theme={theme} />
            ))
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <NoNotesIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Nenhuma nota ainda
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Seja o primeiro a adicionar uma nota a esta conversa
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ 
        p: 2,
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderTop: `1px solid ${theme.palette.divider}`
      }}>
        <GradientButton onClick={onClose} variant="outlined">
          Fechar
        </GradientButton>
      </DialogActions>
    </StyledDialog>
  );
};

export default NotesDialog;