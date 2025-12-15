import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Paper, TextField, Button, CircularProgress,
  Avatar, useTheme, alpha, Grid, Alert
} from '@mui/material';
import { Phone as PhoneIcon, Mic as MicIcon, Person as PersonIcon } from '@mui/icons-material';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import api from '../services/api';
import socketService from '../services/socket';
import { useAuthStore } from '../stores/authStore';

const TranscriptEntry = ({ entry }) => {
  const theme = useTheme();
  const isAi = entry.speaker === 'ai';
  return (
    <Box sx={{
      display: 'flex',
      justifyContent: isAi ? 'flex-start' : 'flex-end',
      mb: 2,
    }}>
      <Paper sx={{
        p: 1.5,
        maxWidth: '80%',
        bgcolor: isAi ? 'primary.main' : 'background.paper',
        color: isAi ? 'primary.contrastText' : 'text.primary',
        borderRadius: isAi ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
        border: '1px solid',
        borderColor: isAi ? 'primary.dark' : 'divider',
      }}>
        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
          <Avatar sx={{
            width: 24, height: 24,
            bgcolor: isAi ? alpha(theme.palette.common.white, 0.2) : 'secondary.main',
            color: 'white',
            fontSize: '0.8rem'
          }}>
            {isAi ? <MicIcon fontSize="inherit" /> : <PersonIcon fontSize="inherit" />}
          </Avatar>
          <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
            {isAi ? 'Agente IA' : 'Cliente'}
          </Typography>
        </Box>
        <Typography variant="body2">{entry.text}</Typography>
      </Paper>
    </Box>
  );
};

export default function VoiceAgent() {
  const theme = useTheme();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [initialMessage, setInitialMessage] = useState('Olá, tudo bem? Sou da QualifAI e notei seu interesse em nossos serviços. Teria um momento para conversarmos?');
  const [callStatus, setCallStatus] = useState('Ocioso');
  const [transcript, setTranscript] = useState([]);
  const transcriptEndRef = useRef(null);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;
    const socket = socketService.connect(user._id);

    const statusHandler = (status) => setCallStatus(status);
    const transcriptHandler = (entry) => setTranscript(prev => [...prev, entry]);

    socketService.on('call-status', statusHandler);
    socketService.on('transcript-update', transcriptHandler);

    return () => {
      socketService.off('call-status', statusHandler);
      socketService.off('transcript-update', transcriptHandler);
    }
  }, [user]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);


  const startCallMutation = useMutation(
    (callData) => api.post('/voice-agent/start-call', callData),
    {
      onMutate: () => {
        setTranscript([]);
        setCallStatus('Iniciando chamada...');
      },
      onSuccess: () => {
        toast.success('Chamada iniciada com sucesso!');
        setCallStatus('Discando...');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erro ao iniciar a chamada.');
        setCallStatus('Falha ao iniciar');
      },
    }
  );

  const handleStartCall = () => {
    if (!phoneNumber) {
      toast.warn('Por favor, insira um número de telefone.');
      return;
    }
    if (!initialMessage) {
        toast.warn('Por favor, insira uma mensagem inicial.');
        return;
    }
    startCallMutation.mutate({ phoneNumber, initialMessage });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Agente de Voz IA</Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        Esta funcionalidade permite que a IA realize chamadas telefônicas em tempo real para qualificar leads. A conversa será transcrita ao vivo abaixo.
      </Alert>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Iniciar Chamada</Typography>
            <TextField
              fullWidth
              label="Número do Telefone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+5511999998888"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Mensagem Inicial (Ice Breaker)"
              value={initialMessage}
              onChange={(e) => setInitialMessage(e.target.value)}
              margin="normal"
              multiline
              rows={4}
            />
            <Button
              variant="contained"
              fullWidth
              startIcon={startCallMutation.isLoading ? <CircularProgress size={20} color="inherit" /> : <PhoneIcon />}
              onClick={handleStartCall}
              disabled={startCallMutation.isLoading}
              sx={{ mt: 2, py: 1.5 }}
            >
              {startCallMutation.isLoading ? 'Iniciando...' : 'Ligar para Lead'}
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>Transcrição da Chamada</Typography>
            <Box sx={{
              p: 1,
              mb: 2,
              borderRadius: 1,
              textAlign: 'center',
              backgroundColor: alpha(theme.palette.info.main, 0.1),
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
            }}>
              <Typography variant="button" color="info.dark">
                Status: {callStatus}
              </Typography>
            </Box>
            <Box sx={{
              flex: 1,
              height: '400px',
              overflowY: 'auto',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              p: 2,
              backgroundColor: 'action.hover'
            }}>
              {transcript.length === 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Typography color="text.secondary">Aguardando início da chamada...</Typography>
                </Box>
              )}
              {transcript.map((entry, index) => (
                <TranscriptEntry key={index} entry={entry} />
              ))}
              <div ref={transcriptEndRef} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
