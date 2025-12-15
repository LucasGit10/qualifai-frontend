import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  CircularProgress,
  Typography,
  IconButton,
  Box,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import { Close as CloseIcon, EventAvailable as EventAvailableIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import api from '../../services/api';

const MeetingModal = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      company: '',
      email: '',
      dateTime: '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const startDateTime = new Date(data.dateTime);
      const endDateTime = new Date(startDateTime.getTime() + 30 * 60000); 

      const payload = {
        summary: `QualifAI Demo with ${data.company}`,
        description: `Meeting to demonstrate the QualifAI platform.\nRequested by: ${data.name} (${data.email})`,
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString(),
        attendeesEmails: [data.email, 'contato@qualifai.tech'], 
      };

      await api.post('/demo/schedule-demo', payload);

      toast.success('Demonstração agendada com sucesso! Por favor, verifique seu email.');
      reset();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao agendar demonstração. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().slice(0, 16); 

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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '12px' } }}>
      <DialogTitle sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <EventAvailableIcon sx={{
            mr: 1.5,
            color: 'primary.main',
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            borderRadius: '50%',
            p: 1,
            fontSize: '1.8rem'
          }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Agendar uma Demonstração
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ py: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Nome é obrigatório' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Seu Nome"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    sx={textFieldSx}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="company"
                control={control}
                rules={{ required: 'Empresa é obrigatória' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Sua Empresa"
                    error={!!errors.company}
                    helperText={errors.company?.message}
                    sx={textFieldSx}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: 'Email é obrigatório',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Email inválido',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Seu Melhor Email"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    sx={textFieldSx}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="dateTime"
                control={control}
                rules={{ required: 'Data e hora são obrigatórios' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Data e Hora de Preferência"
                    type="datetime-local"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: today }}
                    error={!!errors.dateTime}
                    helperText={errors.dateTime?.message}
                    sx={textFieldSx}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={onClose}
            disabled={loading}
            sx={{ borderRadius: '8px', px: 2, fontWeight: 600, color: 'text.secondary' }}
          >
            Cancelar
          </Button>
          <Button
            type="submit" variant="contained" disabled={loading}
            sx={{ borderRadius: '8px', px: 2, fontWeight: 600 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Agendar Demonstração'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default MeetingModal;