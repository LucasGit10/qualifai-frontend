// ARQUIVO: components/InstagramConnection.js (NOVO)

import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box, Typography, Button, Paper, Grid, Avatar, CircularProgress,
  Divider, Alert, useTheme, IconButton, Tooltip, Grow, Slide
} from '@mui/material';
import { keyframes, alpha } from '@mui/system';
// ÍCONES ATUALIZADOS PARA INSTAGRAM
import { Add as AddIcon, Instagram as InstagramIcon, LinkOff as DisconnectIcon, WarningAmber as WarningIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../services/api';
import useFacebookSdk from '../services/useFacebookSdk'; // Reutilizamos o mesmo hook!

// --- ANIMAÇÃO (Pode ser movida para um arquivo de estilos comum) ---
const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// --- Sub-componente: ConnectionCard (Adaptado do InstanceCard) ---
const ConnectionCard = ({ connection, onDelete }) => {
  const theme = useTheme();
  
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
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        border: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        boxShadow: theme.palette.mode === 'dark' 
          ? '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
          : '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 16px 40px ${alpha(theme.palette.success.main, 0.4)}`,
        },
      }}
    >
      <Tooltip title="Desconectar Conta" placement="top">
        <IconButton
          onClick={() => onDelete()}
          size="small"
          sx={{
            position: 'absolute', top: 8, right: 8,
            color: 'error.light',
            backgroundColor: alpha(theme.palette.error.main, 0.2),
            '&:hover': { backgroundColor: alpha(theme.palette.error.main, 0.4) },
          }}
        >
          <DisconnectIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Box display="flex" alignItems="center" mb={2}>
        <Avatar
          sx={{
            mr: 2, width: 52, height: 52,
            background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
            border: `2px solid ${theme.palette.success.main}`,
          }}
        >
          <InstagramIcon sx={{ color: '#fff', fontSize: 28 }} />
        </Avatar>
        <Box>
          <Typography variant="h6" component="div" fontWeight="600" color={theme.palette.text.primary}>
            {connection.pageName || 'Página do Instagram'}
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, wordBreak: 'break-all' }}>
            ID: {connection.pageId}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ py: 0.5, px: 1.5, mb: 2, alignSelf: 'flex-start', borderRadius: 50, backgroundColor: alpha(theme.palette.success.main, 0.15) }}>
        <Typography variant="caption" fontWeight="bold" sx={{ color: `success.light` }}>
          Conectado
        </Typography>
      </Box>
    </Paper>
  );
};


export default function InstagramConnection() {
  const queryClient = useQueryClient();
  const theme = useTheme();
  const isSdkReady = useFacebookSdk();

  // --- LÓGICA DE DADOS ADAPTADA PARA O INSTAGRAM ---
  const { data: connectionStatus, isLoading: isLoadingStatus } = useQuery(
    'instagram-status', 
    () => api.get('/instagram/status').then((res) => res.data),
    { onError: () => ({ enabled: false }) }
  );

  const connectMutation = useMutation(
    (data) => api.post('/instagram/connect/sdk', data), // Endpoint do backend para o SDK
    {
      onSuccess: () => {
        toast.success('Canal Instagram conectado com sucesso!');
        queryClient.invalidateQueries('instagram-status');
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || 'Erro ao conectar canal do Instagram.');
      },
    }
  );

  const disconnectMutation = useMutation(
    () => api.delete('/instagram/disconnect'), // Endpoint para desconectar
    {
      onSuccess: () => {
        toast.info('Conta do Instagram desconectada.');
        queryClient.invalidateQueries('instagram-status');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erro ao desconectar.');
      },
    }
  );
  
  const handleConnectWithInstagram = () => {
    if (!isSdkReady) {
      toast.warn('O SDK da Meta ainda está carregando, por favor aguarde.');
      return;
    }
    // --- MUDANÇA CRUCIAL: SCOPES E AUSÊNCIA DO OBJETO 'extras' ---
    window.FB.login(
      (response) => {
        if (response.authResponse?.accessToken) {
          connectMutation.mutate({ accessToken: response.authResponse.accessToken });
        } else {
          toast.info('O processo de conexão foi cancelado.');
        }
      },
      {
        scope: 'pages_show_list,instagram_basic,instagram_manage_messages,pages_messaging',
      }
    );
  };

  const isConnected = connectionStatus?.enabled;

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Slide direction="down" in timeout={500}>
        <Paper sx={{ 
          p: {xs: 2, sm: 4}, 
          borderRadius: 3, 
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)', 
          border: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
            : '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={2}>
            <Typography variant="h4" fontWeight="bold" color={theme.palette.text.primary}>
              Conectar Canal do Instagram
            </Typography>
            {!isConnected && (
              <Button
                variant="contained"
                onClick={handleConnectWithInstagram}
                disabled={!isSdkReady || connectMutation.isLoading}
                startIcon={connectMutation.isLoading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
                sx={{
                  background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                  color: '#fff', 
                  fontWeight: 'bold', 
                  borderRadius: 2, 
                  px: 3, 
                  py: 1.5,
                  boxShadow: '0 4px 15px 0 rgba(220, 39, 67, 0.4)',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    transform: 'translateY(-2px)', 
                    boxShadow: '0 6px 20px 0 rgba(220, 39, 67, 0.5)' 
                  },
                  '&:disabled': {
                    background: theme.palette.action.disabled,
                  }
                }}
              >
                {connectMutation.isLoading ? 'Conectando...' : 'Conectar com Instagram'}
              </Button>
            )}
          </Box>
          
          <Typography variant="subtitle1" sx={{mb: 3, color: theme.palette.text.secondary}}>
            {isConnected 
              ? 'Sua conta está conectada e pronta para qualificar leads via DMs e comentários.'
              : 'Use o botão acima para conectar de forma segura sua conta do Instagram Business.'
            }
          </Typography>

          <Paper 
            variant="outlined" 
            sx={{
              p: 2, mt: 2, mb: 4, display: 'flex', alignItems: 'center', gap: 2,
              borderRadius: 2, borderColor: 'warning.main', borderLeft: '5px solid',
              borderLeftColor: 'warning.main', backgroundColor: alpha(theme.palette.warning.main, 0.1),
            }}
          >
            <WarningIcon sx={{ color: 'warning.main', fontSize: '2.5rem', animation: `${pulseAnimation} 2s infinite ease-in-out` }} />
            <Box>
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                Pré-requisitos
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                Para conectar, você precisa de uma **Conta Profissional (Business)** no Instagram que esteja vinculada a uma **Página do Facebook**.
              </Typography>
            </Box>
          </Paper>

          <Divider sx={{ my: 3, borderColor: theme.palette.divider }} />
          
          <Typography variant="h5" fontWeight="600" gutterBottom color={theme.palette.text.primary}>
            Canal Conectado
          </Typography>
          
          {isLoadingStatus ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
              <CircularProgress />
            </Box>
          ) : !isConnected ? (
            <Alert 
              severity="info" 
              variant="outlined" 
              sx={{ /* ...estilos do Alert... */ }}
            >
              Nenhum canal do Instagram conectado.
            </Alert>
          ) : (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6} md={4}>
                <Grow in timeout={300}>
                  <div>
                    <ConnectionCard connection={connectionStatus} onDelete={disconnectMutation.mutate}/>
                  </div>
                </Grow>
              </Grid>
            </Grid>
          )}
        </Paper>
      </Slide>
    </Box>
  );
}