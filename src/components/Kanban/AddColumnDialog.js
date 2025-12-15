import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, useTheme, alpha, IconButton, Box, Typography, Divider } from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import { useState } from 'react';

export const AddColumnDialog = ({ open, onClose, onAddColumn }) => {
  const theme = useTheme();
  const [name, setName] = useState('');

  const handleAdd = () => {
    onAddColumn(name);
    setName('');
    onClose(); 
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
          boxShadow: theme.shadows[10],
          overflow: 'visible'
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
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
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
            Nova Coluna
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: theme.palette.text.secondary,
            '&:hover': {
              color: theme.palette.text.primary,
              backgroundColor: alpha(theme.palette.text.primary, 0.05)
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ py: 2}}>
        <TextField
          autoFocus
          fullWidth
          variant="outlined"
          label="Nome da coluna"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); handleAdd(); }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '& fieldset': {
                borderColor: theme.palette.divider,
              },
              '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
              },
            },
            '& .MuiInputLabel-root': {
              transform: 'translate(14px, 14px) scale(1)'
            },
            '& .MuiInputLabel-shrink': {
              transform: 'translate(14px, -9px) scale(0.75)'
            }
          }}
          InputLabelProps={{
            shrink: true,
          }}
          margin="dense"
        />
      </DialogContent>
      
      <Divider sx={{ borderColor: theme.palette.divider }} />
      
      <DialogActions sx={{ 
        p: 2, 
        px: 3,
        gap: 2
      }}>
        <Button 
          onClick={onClose}
          sx={{ 
            borderRadius: '8px',
            px: 3,
            py: 1,
            fontWeight: 600,
            color: theme.palette.text.secondary,
            '&:hover': {
              color: theme.palette.text.primary,
              backgroundColor: alpha(theme.palette.text.primary, 0.05)
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
            py: 1,
            fontWeight: 600,
            background: theme.palette.custom?.gradients?.button || theme.palette.primary.main,
            '&:hover': {
              background: theme.palette.custom?.gradients?.buttonHover || theme.palette.primary.dark,
              transform: 'translateY(-1px)'
            }
          }}
          disabled={!name.trim()}
        >
          Criar Coluna
        </Button>
      </DialogActions>
    </Dialog>
  );
};