import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton, Box, Typography, Divider, useTheme, alpha } from '@mui/material';
import { Edit as EditIcon, Close as CloseIcon } from '@mui/icons-material';

export const EditColumnDialog = ({ open, name, onChange, onClose, onSave }) => {
  const theme = useTheme();

  const handleSave = () => {
    if (name.trim()) {
      onSave();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <EditIcon sx={{
            mr: 1.5,
            color: 'primary.main',
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            borderRadius: '50%',
            p: 1,
            fontSize: '1.8rem'
          }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Editar Coluna
          </Typography>
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
      <Divider />
      <DialogContent sx={{ py: 4 }}>
        <TextField
          autoFocus
          fullWidth
          variant="outlined"
          label="Novo nome da coluna"
          value={name}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); handleSave(); }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '& fieldset': { borderColor: theme.palette.divider },
              '&:hover fieldset': { borderColor: theme.palette.primary.main },
            }
          }}
        />
      </DialogContent>
      <Divider />
      <DialogActions sx={{
        px: 3,
        py: 2
      }}>
        <Button
          onClick={onClose}
          sx={{ borderRadius: '8px', px: 2, fontWeight: 600, color: 'text.secondary' }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{ borderRadius: '8px', px: 2, fontWeight: 600 }}
          disabled={!name.trim()}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};