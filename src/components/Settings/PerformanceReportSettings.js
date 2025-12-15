import React, { useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import {
  Box, Typography, Paper, Button, Switch, FormControlLabel,
  CircularProgress, Grid, Select, MenuItem, TextField, IconButton,
  Collapse, FormGroup, Checkbox, FormControl, InputLabel, Tooltip, Fade, alpha
} from '@mui/material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Delete as DeleteIcon, Add as AddIcon, Info as InfoIcon, Send as SendIcon } from '@mui/icons-material';
import api from '../../services/api';
import { useAuthStore } from '../../stores/authStore';
import ShowcaseBlocker from '../Showcase/ShowcaseBlocker';
import { GradientButton } from '../ui/GradientButton';

const FieldLabel = ({ children, tooltip }) => (
  <Typography variant="subtitle2" component="label" sx={{ mb: 1, fontWeight: 500, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
    {children}
    {tooltip && (
      <Tooltip title={tooltip}>
        <InfoIcon sx={{ fontSize: '1rem', color: 'text.disabled' }} />
      </Tooltip>
    )}
  </Typography>
);

export default function PerformanceReportSettings() {
  const { user, updateUser } = useAuthStore();
  const queryClient = useQueryClient();

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      enabled: false,
      frequency: 'daily',
      deliveryChannels: [],
      recipients: [],
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "recipients" });
  const watchEnabled = watch("enabled");

  useEffect(() => {
    if (user?.settings?.performanceReport) {
      reset(user.settings.performanceReport);
    }
  }, [user, reset]);

  const updateSettingsMutation = useMutation((data) => api.put('/auth/profile', data), {
    onSuccess: (response) => { toast.success('Configurações de relatórios salvas!'); updateUser(response.data.user); queryClient.invalidateQueries('user-profile'); },
    onError: (error) => { toast.error(error.response?.data?.message || 'Erro ao salvar configurações.'); }
  });

  const triggerManualReportMutation = useMutation(() => api.post('/reports/trigger-manual'), {
    onSuccess: () => { toast.success('Relatório manual gerado e enviado com sucesso!'); },
    onError: (error) => { toast.error(error.response?.data?.message || 'Erro ao gerar relatório manual.'); },
  });

  const onSubmit = (data) => {
    const payload = { settings: { ...user.settings, performanceReport: data } };
    updateSettingsMutation.mutate(payload);
  };

  const handleManualTrigger = () => {
    if (!watchEnabled) { toast.warn("Habilite os relatórios e salve as configurações antes."); return; }
    triggerManualReportMutation.mutate();
  };
  
  const formControlStyles = {
    '& .MuiInputLabel-root': { color: 'text.secondary' },
    '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }, '&:hover fieldset': { borderColor: 'primary.light' } },
    '& .MuiSelect-icon': { color: 'text.secondary' }
  };

  return (
    <ShowcaseBlocker featureKey="ADVANCED_REPORTS">
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>Relatórios de Performance</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Receba resumos automáticos com os principais KPIs de vendas, insights e recomendações.
        </Typography>

        <Fade in timeout={300}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.2)' }}>
            <Controller name="enabled" control={control} render={({ field }) => (
              <FormControlLabel control={<Switch {...field} checked={!!field.value} />} label={<Typography fontWeight="bold">Habilitar relatórios de performance</Typography>} />
            )} />
            <Collapse in={watchEnabled}>
              <Grid container spacing={4} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <FieldLabel>Frequência</FieldLabel>
                  <Controller name="frequency" control={control} render={({ field }) => (
                    <FormControl fullWidth><Select {...field} sx={formControlStyles}>
                      <MenuItem value="daily">Diariamente (às 8h)</MenuItem>
                      <MenuItem value="weekly">Semanalmente (toda Segunda)</MenuItem>
                      <MenuItem value="monthly">Mensalmente (todo dia 1º)</MenuItem>
                    </Select></FormControl>
                  )} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FieldLabel>Canais de Entrega</FieldLabel>
                  <FormGroup row>
                    <Controller name="deliveryChannels" control={control} render={({ field }) => (
                      <>
                        <FormControlLabel control={<Checkbox checked={field.value.includes('email')} onChange={(e) => field.onChange(e.target.checked ? [...field.value, 'email'] : field.value.filter(v => v !== 'email'))} />} label="E-mail" />
                        <FormControlLabel control={<Checkbox checked={field.value.includes('whatsapp')} onChange={(e) => field.onChange(e.target.checked ? [...field.value, 'whatsapp'] : field.value.filter(v => v !== 'whatsapp'))} />} label="WhatsApp" />
                      </>
                    )} />
                  </FormGroup>
                </Grid>
              </Grid>
            </Collapse>
          </Paper>
        </Fade>

        <Collapse in={watchEnabled}>
          <Fade in timeout={500}>
            <Paper variant="outlined" sx={{ p: 3, mt: 4, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.2)' }}>
              <FieldLabel tooltip="Adicione os gestores e executivos que devem receber os relatórios.">Destinatários</FieldLabel>
              <Grid container spacing={2}>
                {fields.map((item, index) => (
                  <Grid item xs={12} key={item.id}>
                    <Paper variant="outlined" sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', borderColor: 'rgba(255,255,255,0.1)' }}>
                      <Controller name={`recipients.${index}.name`} control={control} rules={{ required: true }} render={({ field }) => <TextField {...field} label="Nome" size="small" sx={{ flex: 2, ...formControlStyles }} required />} />
                      <Controller name={`recipients.${index}.email`} control={control} render={({ field }) => <TextField {...field} label="E-mail" size="small" type="email" sx={{ flex: 3, ...formControlStyles }} />} />
                      <Controller name={`recipients.${index}.whatsappNumber`} control={control} render={({ field }) => <TextField {...field} label="WhatsApp" size="small" placeholder="55..." sx={{ flex: 2, ...formControlStyles }} />} />
                      <Controller name={`recipients.${index}.role`} control={control} render={({ field }) => (
                        <FormControl size="small" sx={{ flex: 2 }} required><InputLabel>Perfil</InputLabel>
                          <Select {...field} label="Perfil" sx={formControlStyles}>
                            <MenuItem value="manager">Gestor Comercial</MenuItem>
                            <MenuItem value="c-level">Executivo (C-level)</MenuItem>
                          </Select>
                        </FormControl>
                      )} />
                      <IconButton color="error" onClick={() => remove(index)}><DeleteIcon /></IconButton>
                    </Paper>
                  </Grid>
                ))}
                <Grid item xs={12}><Button startIcon={<AddIcon />} onClick={() => append({ name: '', email: '', whatsappNumber: '', role: 'manager' })}>Adicionar Destinatário</Button></Grid>
              </Grid>
            </Paper>
          </Fade>
        </Collapse>

        <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <GradientButton type="submit" loading={updateSettingsMutation.isLoading}>Salvar Configurações</GradientButton>
          <Button variant="outlined" onClick={handleManualTrigger} disabled={triggerManualReportMutation.isLoading || !watchEnabled} startIcon={triggerManualReportMutation.isLoading ? <CircularProgress size={20} /> : <SendIcon />}>
            Gerar e Enviar Agora
          </Button>
        </Box>
      </Box>
    </ShowcaseBlocker>
  );
}