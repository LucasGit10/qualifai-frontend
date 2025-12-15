import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box, Typography, Button, Paper, Grid, Avatar, CircularProgress,
  Divider, Alert, useTheme, IconButton, Tooltip, Grow, Slide
} from '@mui/material';
import { keyframes, alpha } from '@mui/system';
import { Add as AddIcon, WhatsApp as WhatsAppIcon, DeleteForever as DeleteIcon, WarningAmber as WarningIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../services/api';
import useFacebookSdk from '../services/useFacebookSdk';

// --- ANIMAÇÃO APRIMORADA ---
const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// --- Sub-componente: Instance Card Redesenhado ---
const InstanceCard = ({ instance, onDelete }) => {
  const theme = useTheme();
  const getStatusInfo = (status) => ({
    connected: { label: 'Conectado', color: 'success' },
    connecting: { label: 'Conectando', color: 'warning' },
    disconnected: { label: 'Desconectado', color: 'error' },
  }[status] || { label: status, color: 'default' });
  
  const statusInfo = getStatusInfo(instance.status);

  return (
    <Paper
      elevation={4}
      sx={{
        p: 2.5,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderRadius: 3,
        // CORREÇÃO: Transparência corrigida para combinar com outras páginas
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        border: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        // CORREÇÃO: Box shadow adicionado
        boxShadow: theme.palette.mode === 'dark' 
          ? '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
          : '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: theme.palette.mode === 'dark'
            ? `0 16px 40px ${alpha(theme.palette[statusInfo.color]?.main || theme.palette.grey[500], 0.6)}`
            : `0 16px 40px ${alpha(theme.palette[statusInfo.color]?.main || theme.palette.grey[500], 0.3)}`,
        },
      }}
    >
      <Tooltip title="Excluir Instância" placement="top">
        <IconButton
          onClick={() => onDelete(instance._id)}
          size="small"
          sx={{
            position: 'absolute', top: 8, right: 8,
            color: 'error.light',
            backgroundColor: alpha(theme.palette.error.main, 0.2),
            '&:hover': { backgroundColor: alpha(theme.palette.error.main, 0.4) },
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Box display="flex" alignItems="center" mb={2}>
        <Avatar
          sx={{
            mr: 2, width: 52, height: 52,
            bgcolor: alpha(theme.palette[statusInfo.color]?.main, 0.2),
            border: `2px solid ${theme.palette[statusInfo.color]?.main}`,
          }}
        >
          <WhatsAppIcon sx={{ color: `${statusInfo.color}.main`, fontSize: 28 }} />
        </Avatar>
        <Box>
          <Typography variant="h6" component="div" fontWeight="600" color={theme.palette.text.primary}>
            {instance.instanceName}
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            {instance.phoneNumber}
          </Typography>
        </Box>
      </Box>

      <Box sx={{
        py: 0.5, px: 1.5, mb: 2, alignSelf: 'flex-start',
        borderRadius: 50,
        backgroundColor: alpha(theme.palette[statusInfo.color]?.main, 0.15),
      }}>
        <Typography variant="caption" fontWeight="bold" sx={{ color: `${statusInfo.color}.light` }}>
          {statusInfo.label}
        </Typography>
      </Box>

      <Divider sx={{ my: 1, borderColor: theme.palette.divider }} />

      <Box sx={{ flexGrow: 1, mt: 2 }}>
        <Typography variant="body2" color={theme.palette.text.primary}>
          Enviadas: {instance.messagesSent || 0}
        </Typography>
        <Typography variant="body2" color={theme.palette.text.primary}>
          Recebidas: {instance.messagesReceived || 0}
        </Typography>
        <Typography variant="caption" color={theme.palette.text.secondary} display="block" mt={1.5} sx={{ wordBreak: 'break-all' }}>
          WABA ID: {instance.wabaId}
        </Typography>
      </Box>
    </Paper>
  );
};


export default function WhatsAppConnection() {
  const queryClient = useQueryClient();
  const theme = useTheme();
  const isSdkReady = useFacebookSdk();

  const { data: instances, isLoading: isLoadingInstances } = useQuery('whatsapp-instances', () => api.get('/whatsapp').then((res) => res.data));
  const completeOnboardingMutation = useMutation((data) => api.post('/whatsapp/complete-onboarding', data), {
    onSuccess: () => { toast.success('Canal WhatsApp conectado com sucesso!'); queryClient.invalidateQueries('whatsapp-instances'); },
    onError: (error) => { toast.error(error.response?.data?.error || 'Erro ao conectar canal.'); },
  });
  const deleteInstanceMutation = useMutation((instanceId) => api.delete(`/whatsapp/instances/${instanceId}`), {
    onSuccess: () => { toast.success('Instância excluída com sucesso!'); queryClient.invalidateQueries('whatsapp-instances'); },
    onError: (error) => { toast.error(error.response?.data?.message || 'Erro ao excluir instância.'); },
  });
  
  const handleConnectWithMeta = () => {
    if (!isSdkReady) {
      toast.warn('O SDK da Meta ainda está carregando, por favor aguarde.');
      return;
    }
    window.FB.login(
      (response) => {
        if (response.authResponse?.code || response.authResponse?.accessToken) {
          completeOnboardingMutation.mutate({ code: response.authResponse.code, accessToken: response.authResponse.accessToken });
        } else {
          toast.info('O processo de conexão foi cancelado.');
        }
      },
      {
        scope: 'whatsapp_business_management,whatsapp_business_messaging',
        extras: { feature: 'whatsapp_embedded_signup', setup: {} },
      }
    );
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Slide direction="down" in timeout={500}>
        {/* CORREÇÃO: Paper principal com transparência corrigida */}
        <Paper sx={{ 
          p: {xs: 2, sm: 4}, 
          borderRadius: 3, 
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)', 
          border: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
          // CORREÇÃO: Box shadow adicionado
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
            : '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={2}>
            <Typography variant="h4" fontWeight="bold" color={theme.palette.text.primary}>
              Conectar Canal do WhatsApp
            </Typography>
            <Button
              variant="contained"
              onClick={handleConnectWithMeta}
              disabled={!isSdkReady || completeOnboardingMutation.isLoading}
              startIcon={completeOnboardingMutation.isLoading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
              sx={{
                backgroundColor: '#1877F2', 
                color: '#fff', 
                fontWeight: 'bold', 
                borderRadius: 2, 
                px: 3, 
                py: 1.5,
                boxShadow: '0 4px 15px 0 rgba(24, 119, 242, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  backgroundColor: '#145dbf', 
                  transform: 'translateY(-2px)', 
                  boxShadow: '0 6px 20px 0 rgba(24, 119, 242, 0.5)' 
                },
                '&:disabled': {
                  backgroundColor: theme.palette.action.disabled,
                }
              }}
            >
              {completeOnboardingMutation.isLoading ? 'Conectando...' : 'Conectar com Facebook'}
            </Button>
          </Box>
          
          <Typography variant="subtitle1" sx={{mb: 3, color: theme.palette.text.secondary}}>
            Use o botão acima para conectar de forma segura uma nova conta do WhatsApp Business.
          </Typography>

          {/* CORREÇÃO: Alert com cores do tema */}
          <Paper 
            variant="outlined" 
            sx={{
              p: 2, 
              mt: 2, 
              mb: 4, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              borderRadius: 2, 
              borderColor: 'warning.main', 
              borderLeft: '5px solid',
              borderLeftColor: 'warning.main',
              backgroundColor: alpha(theme.palette.warning.main, 0.1),
            }}
          >
            <WarningIcon sx={{ 
              color: 'warning.main', 
              fontSize: '2.5rem', 
              animation: `${pulseAnimation} 2s infinite ease-in-out` 
            }} />
            <Box>
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                Nota Importante
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                O número de telefone a ser registrado **não deve** estar vinculado a nenhuma conta existente do WhatsApp ou WhatsApp Business.
              </Typography>
            </Box>
          </Paper>

          <Divider sx={{ my: 3, borderColor: theme.palette.divider }} />
          
          <Typography variant="h5" fontWeight="600" gutterBottom color={theme.palette.text.primary}>
            Canais Conectados
          </Typography>
          
          {isLoadingInstances ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
              <CircularProgress />
            </Box>
          ) : !Array.isArray(instances) || instances.length === 0 ? (
            <Alert 
              severity="info" 
              variant="outlined" 
              sx={{ 
                mt: 2, 
                borderColor: theme.palette.divider,
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.7)',
                '& .MuiAlert-message': {
                  color: theme.palette.text.primary
                }
              }}
            >
              Nenhum canal do WhatsApp conectado.
            </Alert>
          ) : (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {instances.map((instance, index) => (
                <Grid item xs={12} sm={6} md={4} key={instance._id}>
                  <Grow in timeout={300 + index * 150}>
                    <div>
                      <InstanceCard instance={instance} onDelete={deleteInstanceMutation.mutate}/>
                    </div>
                  </Grow>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      </Slide>
    </Box>
  );
}