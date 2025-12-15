
import React from 'react';
import { Box, Typography, TextField, Switch, FormControlLabel, Alert, Grid, Collapse, Tooltip, IconButton,useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';
import { useShowcaseContext } from '../../../contexts/ShowcaseContext';
import ShowcaseBlocker from '../../Showcase/ShowcaseBlocker';
import { ContentCopy as ContentCopyIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

export default function SmtpSettings({ control, register, watch }) {
  const { isGuestMode } = useShowcaseContext();
  const watchSmtp = watch("smtpEnabled");
  const watchSmtpProvider = watch("smtpProvider");
  const theme = useTheme();
  const webhookUrl = `${window.location.origin}/api/webhooks/email-reply`;

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.info(`URL copiada para a área de transferência!`);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" gutterBottom>Configuração de Email</Typography>
      <ShowcaseBlocker inline>
        <Controller
          name="smtpEnabled"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Switch {...field} checked={!!field.value} color="switch"/>}
              label="Habilitar envio de email personalizado"
            />
          )}
        />
      </ShowcaseBlocker>
      <Collapse in={watchSmtp}>
        <Box mt={2}>
          <Alert severity="info" sx={{ mt: 2 ,background: theme.palette.custom.glass.dark}}>
            <Typography variant="body2" gutterBottom><strong>Para receber respostas e criar leads automaticamente:</strong></Typography>
            <Typography variant="body2" component="div">
              Configure seu provedor de email (ex: Mailgun, SendGrid) para encaminhar emails recebidos para a seguinte URL de webhook:
              <Box component="code" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1, p: 1, backgroundColor: theme.palette.grey[701], borderRadius: 1, fontFamily: 'monospace', wordBreak: 'break-all' }}>
                {webhookUrl}
                <Tooltip title="Copiar URL">
                  <IconButton size="small" onClick={() => handleCopyToClipboard(webhookUrl)}><ContentCopyIcon fontSize="inherit" /></IconButton>
                </Tooltip>
              </Box>
            </Typography>
          </Alert>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={4}>
              <TextField {...register('smtpProvider')} fullWidth select label="Provedor" SelectProps={{ native: true }} helperText="Selecione seu provedor de email" disabled={isGuestMode}>
                <option value="gmail">Gmail</option>
                <option value="outlook">Outlook</option>
                <option value="yahoo">Yahoo</option>
                <option value="other">Outro (Personalizado)</option>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField fullWidth label="Email (Usuário)" {...register('smtpUser')} helperText="Seu endereço de email completo" disabled={isGuestMode} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Senha" type="password" {...register('smtpPass')} helperText="Para Gmail/Outlook, use uma 'Senha de App' para maior segurança." disabled={isGuestMode} />
            </Grid>
          </Grid>
          <Collapse in={watchSmtpProvider === 'other'}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Host SMTP" {...register('smtpHost')} disabled={isGuestMode} /></Grid>
              <Grid item xs={12} sm={3}><TextField fullWidth label="Porta" type="number" {...register('smtpPort')} disabled={isGuestMode} /></Grid>
              <Grid item xs={12} sm={3} sx={{ display: 'flex', alignItems: 'center' }}>
                <ShowcaseBlocker inline><FormControlLabel control={<Switch {...register('smtpSecure')} color="switch"/>} label="Seguro (SSL)" /></ShowcaseBlocker>
              </Grid>
            </Grid>
          </Collapse>
        </Box>
      </Collapse>
    </Box>
  );
}
