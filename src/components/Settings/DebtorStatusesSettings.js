import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import {
  Box, Typography, Paper, Button, Grid, TextField, IconButton,
  List, ListItem, ListItemText, ListItemSecondaryAction, Fade
} from '@mui/material';
import { toast } from 'react-toastify';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import api from '../../services/api';
import { useAuthStore } from '../../stores/authStore';
import { GradientButton } from '../ui/GradientButton';

export default function DebtorStatusesSettings() {
  const { user, updateUser } = useAuthStore();
  const queryClient = useQueryClient();

  const [statuses, setStatuses] = useState([]);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    if (user?.settings?.debtorStatuses) {
      setStatuses(user.settings.debtorStatuses);
    }
  }, [user]);

  const updateSettingsMutation = useMutation((data) => api.put('/auth/profile', data), {
    onSuccess: (response) => { 
      toast.success('Status salvos com sucesso!'); 
      updateUser(response.data.user); 
      queryClient.invalidateQueries('user-profile'); 
    },
    onError: (error) => { 
      toast.error(error.response?.data?.message || 'Erro ao salvar configurações.'); 
    }
  });

  const handleAddStatus = () => {
    const trimmed = newStatus.trim();
    if (!trimmed) return;
    if (statuses.includes(trimmed)) {
      toast.warn('Este status já existe.');
      return;
    }
    setStatuses([...statuses, trimmed]);
    setNewStatus('');
  };

  const handleRemoveStatus = (statusToRemove) => {
    setStatuses(statuses.filter(s => s !== statusToRemove));
  };

  const handleSave = () => {
    const payload = { settings: { ...user.settings, debtorStatuses: statuses } };
    updateSettingsMutation.mutate(payload);
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>Status de Devedores</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Crie e gerencie os status personalizados para classificar os devedores no sistema. (Os status padrões continuarão sendo exibidos se não houver nenhum personalizado salvo ou para devedores antigos).
      </Typography>

      <Fade in timeout={300}>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.2)' }}>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Grid item xs>
              <TextField 
                fullWidth 
                size="small" 
                label="Novo Status" 
                value={newStatus} 
                onChange={(e) => setNewStatus(e.target.value)} 
                onKeyPress={(e) => { if (e.key === 'Enter') handleAddStatus(); }}
                sx={{ 
                  '& .MuiInputLabel-root': { color: 'text.secondary' },
                  '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }, '&:hover fieldset': { borderColor: 'primary.light' } }
                }}
              />
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={handleAddStatus} startIcon={<AddIcon />}>
                Adicionar
              </Button>
            </Grid>
          </Grid>

          {statuses.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
              Nenhum status personalizado cadastrado. Os status padrão continuarão sendo exibidos.
            </Typography>
          ) : (
            <List>
              {statuses.map((status, idx) => (
                <ListItem key={idx} sx={{ backgroundColor: 'rgba(0,0,0,0.2)', mb: 1, borderRadius: 1, border: '1px solid rgba(255,255,255,0.1)' }}>
                  <ListItemText primary={status} />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" color="error" onClick={() => handleRemoveStatus(status)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Fade>

      <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <GradientButton onClick={handleSave} loading={updateSettingsMutation.isLoading}>
          Salvar Configurações
        </GradientButton>
      </Box>
    </Box>
  );
}
