import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
  Chip,
  Typography,
  Box,
  IconButton,
  alpha,
  useTheme,
  Stack,
  Divider
} from '@mui/material';
import {
  Edit as EditIcon, Delete as DeleteIcon, Close as CloseIcon,
  CalendarToday as CalendarTodayIcon, Label as LabelIcon
} from '@mui/icons-material';
import { priorityConfig } from './kanbanConfig';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const CardDetailDialog = ({ item, onClose, onEdit, onDelete }) => {
  const theme = useTheme();
  if (!item) return null;

  return (
    <Dialog open={!!item} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{
        borderBottom: theme => `1px solid ${theme.palette.divider}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 3
      }}>
        <Box display="flex" alignItems="center">
          <Avatar
            sx={{
              bgcolor: item.color || 'primary.main',
              width: 40,
              height: 40,
              mr: 2,
              color: 'white',
            }}
          >
            {item.title?.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="h6" fontWeight={700}>{item.title}</Typography>
        </Box>
        <IconButton onClick={onClose} sx={{
          color: 'text.secondary',
          '&:hover': {
            color: 'text.primary',
            backgroundColor: alpha(theme.palette.text.primary, 0.05)
          }
        }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3} py={2}>
          <Chip
            icon={priorityConfig[item.priority]?.icon}
            label={item.priority}
            color={priorityConfig[item.priority]?.color || 'default'}
            variant="outlined"
            sx={{ fontWeight: 600, alignSelf: 'flex-start' }}
          />

          <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
            {item.description || 'Sem descrição.'}
          </Typography>

          <Divider />

          <Stack direction="row" spacing={2} alignItems="center">
            <CalendarTodayIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {item.date ? `Criado em: ${format(parseISO(item.createdAt || new Date().toISOString()), "dd 'de' MMMM, yyyy", { locale: ptBR })}` : 'Data não informada'}
            </Typography>
          </Stack>

          {item.tags && item.tags.length > 0 && (
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <LabelIcon fontSize="small" color="action" />
                <Typography variant="body2" fontWeight={600} color="text.secondary">
                  Etiquetas
                </Typography>
              </Stack>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {item.tags.map(tag => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    sx={{
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.dark',
                      fontWeight: 500,
                    }}
                  />
                ))}
              </Box>
            </Stack>
          )}
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions sx={{
        px: 3,
        py: 2,
        justifyContent: 'space-between'
      }}>
        <Button
          startIcon={<DeleteIcon />}
          onClick={() => {
            onDelete();
            onClose();
          }}
          color="error"
        >
          Excluir
        </Button>
        <Box>
          <Button
            onClick={onClose}
            sx={{
              borderRadius: '8px',
              px: 2,
              fontWeight: 600,
              color: 'text.secondary',
            }}
          >
            Fechar
          </Button>
          <Button
            startIcon={<EditIcon />}
            onClick={() => onEdit(item)}
            variant="contained"
            sx={{ borderRadius: '8px', px: 2, fontWeight: 600 }}
          >
            Editar
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};