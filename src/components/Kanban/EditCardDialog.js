import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Chip,
  Autocomplete,
  Box,
  IconButton,
  Divider,
  useTheme,
  alpha,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Close as CloseIcon, Save as SaveIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { priorityConfig } from './kanbanConfig';

const tagOptions = [
  'Funcionalidade',
  'Bug',
  'Melhora',
  'Urgente',
  'Design',
  'Backend',
  'Frontend'
];

export const EditCardDialog = ({
  open,
  onClose,
  card,
  onSave,
  onDelete
}) => {
  const theme = useTheme();
  const [editedCard, setEditedCard] = useState({
    title: '',
    description: '',
    priority: 'Baixa',
    tags: []
  });

  useEffect(() => {
    if (card) {
      setEditedCard({
        title: card.title || '',
        description: card.description || '',
        priority: card.priority || 'Baixa',
        tags: card.tags || []
      });
    }
  }, [card]);

  const handleChange = (field) => (e) => {
    setEditedCard(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleTagsChange = (event, value) => {
    setEditedCard(prev => ({
      ...prev,
      tags: value
    }));
  };

  const handleSubmit = () => {
    onSave({
      ...card,
      ...editedCard
    });
    onClose();
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  // Estilos reutilizáveis para os TextFields
  const textFieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      '& fieldset': { borderColor: theme.palette.divider },
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
      },
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{
        p: 3,
        borderBottom: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box display="flex" alignItems="center">
          <EditIcon sx={{
            mr: 1.5,
            color: 'primary.main',
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            borderRadius: '50%',
            p: 1,
            fontSize: '1.8rem'
          }} />
          <span style={{ fontWeight: 700, fontSize: '1.25rem' }}>Editar Cartão</span>
        </Box>
        <IconButton onClick={onClose} sx={{
          color: theme.palette.text.secondary,
          '&:hover': {
            color: theme.palette.text.primary,
            backgroundColor: alpha(theme.palette.text.primary, 0.05)
          }
        }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3} py={2}>
          <TextField
            autoFocus
            fullWidth
            label="Título"
            value={editedCard.title}
            onChange={handleChange('title')}
            variant="outlined"
            sx={textFieldSx}
          />

          <TextField
            fullWidth
            label="Descrição"
            value={editedCard.description}
            onChange={handleChange('description')}
            variant="outlined"
            multiline
            rows={4}
            sx={textFieldSx}
          />

          <FormControl fullWidth>
            <InputLabel id="priority-label-edit">Prioridade</InputLabel>
            <Select
              labelId="priority-label-edit"
              label="Prioridade"
              value={editedCard.priority}
              onChange={handleChange('priority')}
              sx={{ borderRadius: '8px' }}
              renderValue={(selected) => (
                <Chip
                  icon={priorityConfig[selected]?.icon}
                  label={selected}
                  color={priorityConfig[selected]?.color}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              )}
            >
              {Object.entries(priorityConfig).map(([key, { icon, color }]) => (
                <MenuItem key={key} value={key}>
                  <Chip icon={icon} label={key} color={color} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Autocomplete
            multiple
            freeSolo
            options={tagOptions}
            value={editedCard.tags}
            onChange={handleTagsChange}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  key={option}
                  label={option}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Etiquetas"
                placeholder="Adicionar etiqueta"
                sx={textFieldSx}
              />
            )}
          />
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
        <Button
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
          color="error"
        >
          Excluir
        </Button>
        <Box>
          <Button onClick={onClose} sx={{ mr: 1, color: 'text.secondary', fontWeight: 600 }}>
            Cancelar
          </Button>
          <Button
            startIcon={<SaveIcon />}
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            sx={{ fontWeight: 600 }}
          >
            Salvar
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};