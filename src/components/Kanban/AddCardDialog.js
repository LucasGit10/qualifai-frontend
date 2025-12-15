import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Chip,
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useTheme,
  alpha,
  Stack,
  Divider,
  IconButton
} from '@mui/material';
import {
  Add as AddIcon,
  Close as CloseIcon,
  Label as LabelIcon
} from '@mui/icons-material';
import { priorityConfig } from './kanbanConfig';

const initialState = {
  title: '',
  description: '',
  priority: 'Baixa',
  tags: []
};

export const AddCardDialog = ({
  open,
  onClose,
  columns,
  onAddItem,
  onSelectColumn
}) => {
  const theme = useTheme();
  const [item, setItem] = useState(initialState);
  const [selectedColumn, setSelectedColumn] = useState('');
  const [newTag, setNewTag] = useState('');

  const handleChange = (field) => (event) => {
    setItem(prev => ({ ...prev, [field]: event.target.value }));
  };

  const handleAdd = () => {
    onAddItem(item);
    setItem(initialState);
    setSelectedColumn('');
    onClose(); 
  };

  const handleAddTag = () => {
    if (newTag.trim() && !item.tags.includes(newTag.trim())) {
      setItem(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setItem(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

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
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: '12px',
          background: theme.palette.background.paper,
          boxShadow: theme.shadows[10]
        }
      }}
    >
      <DialogTitle sx={{
        p: 3,
        borderBottom: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AddIcon sx={{
            mr: 1.5,
            color: 'primary.main',
            backgroundColor: alpha(theme.palette.primary.main, 0.1), // Corrigido
            borderRadius: '50%',
            p: 1,
            fontSize: '1.8rem'
          }} />
          <Typography variant="h6" sx={{
            fontWeight: 700,
            background: theme.palette.custom?.gradients?.text || theme.palette.primary.main,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Novo Cartão
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: theme.palette.text.secondary,
            '&:hover': {
              color: theme.palette.text.primary,
              backgroundColor: alpha(theme.palette.text.primary, 0.05) // Corrigido
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3} py={4}>
          <TextField
            autoFocus
            fullWidth
            variant="outlined"
            label="Título"
            value={item.title}
            onChange={handleChange('title')}
            sx={textFieldSx}
          />

          <TextField
            fullWidth
            variant="outlined"
            label="Descrição"
            multiline
            rows={4}
            value={item.description}
            onChange={handleChange('description')}
            sx={textFieldSx}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="priority-label" sx={{
                '&.Mui-focused': {
                  color: theme.palette.primary.main
                }
              }}>
                Prioridade
              </InputLabel>
              <Select
                labelId="priority-label"
                label="Prioridade"
                value={item.priority}
                onChange={handleChange('priority')}
                sx={{
                  borderRadius: '8px',
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }
                }}
                renderValue={(selected) => (
                  <Chip
                    icon={priorityConfig[selected].icon}
                    label={selected}
                    color={priorityConfig[selected].color}
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                )}
              >
                {Object.entries(priorityConfig).map(([key, { icon, color }]) => (
                  <MenuItem key={key} value={key} sx={{ py: 1 }}>
                    <Chip
                      icon={icon}
                      label={key}
                      color={color}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="column-label" sx={{
                '&.Mui-focused': {
                  color: theme.palette.primary.main
                }
              }}>
                Coluna
              </InputLabel>
              <Select
                labelId="column-label"
                label="Coluna"
                value={selectedColumn}
                onChange={(e) => {
                  setSelectedColumn(e.target.value);
                  onSelectColumn(e.target.value);
                }}
                sx={{ borderRadius: '8px' }}
              >
                {Object.values(columns).map(column => (
                  <MenuItem key={column.id} value={column.id}>{column.title}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box>
            <Typography variant="body2" sx={{
              mb: 1,
              fontWeight: 600,
              color: theme.palette.text.secondary,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <LabelIcon fontSize="small" color="secondary" />
              Etiquetas
            </Typography>

            <Box sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              mb: 1,
              minHeight: '32px'
            }}>
              {item.tags.map(tag => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  color="secondary"
                  size="small"
                  sx={{
                    fontWeight: 500,
                    '& .MuiChip-deleteIcon': {
                      color: theme.palette.secondary.light
                    }
                  }}
                />
              ))}
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Adicionar etiqueta"
                size="small"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); }
                }}
                sx={textFieldSx}
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={handleAddTag}
                disabled={!newTag.trim()}
                sx={{
                  minWidth: '40px',
                  borderRadius: '8px',
                  px: 0
                }}
              >
                <AddIcon />
              </Button>
            </Box>
          </Box>
        </Stack>
      </DialogContent>

      <Divider sx={{ borderColor: theme.palette.divider }} />

      <DialogActions sx={{ p: 2, px: 3 }}>
        <Button
          onClick={onClose}
          sx={{
            borderRadius: '8px',
            px: 3,
            fontWeight: 600,
            color: theme.palette.text.secondary,
            '&:hover': {
              color: theme.palette.text.primary,
              backgroundColor: alpha(theme.palette.text.primary, 0.05) // Corrigido
            }
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleAdd}
          variant="contained"
          sx={{
            borderRadius: '8px',
            px: 3,
            fontWeight: 600,
            background: theme.palette.custom?.gradients?.button || theme.palette.primary.main,
            '&:hover': {
              background: theme.palette.custom?.gradients?.buttonHover || theme.palette.primary.dark,
              transform: 'translateY(-1px)'
            }
          }}
          disabled={!item.title.trim() || !selectedColumn}
        >
          Adicionar Cartão
        </Button>
      </DialogActions>
    </Dialog>
  );
};