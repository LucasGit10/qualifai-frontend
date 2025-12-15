import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { alpha, useTheme } from '@mui/material/styles';
import {
  Box, Typography, Button, Paper, TextField, IconButton, CircularProgress,
  Grid, Card, CardContent, Divider, Tooltip, Skeleton, Alert, InputAdornment, Chip,
  LinearProgress, 
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs, 
  Tab,
  FormControl, // <-- Importado
  InputLabel,  // <-- Importado
  Select,      // <-- Importado
  MenuItem     // <-- Importado
} from '@mui/material';
import {
  Chat as ChatIcon, Send as SendIcon, Refresh as RefreshIcon, FileUpload as FileUploadIcon,
  Psychology as PsychologyIcon, AutoGraph as AutoGraphIcon, InfoOutlined as InfoOutlinedIcon,
  Close as CloseIcon,
  History as HistoryIcon, 
  ExpandMore as ExpandMoreIcon,
  SmartToy as SmartToyIcon,
  Person as PersonIcon,
  Delete as DeleteIcon,
  DeleteForever as DeleteForeverIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip as ChartTooltip, Legend, Filler
} from 'chart.js';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import api from '../services/api';
import { GradientButton } from '../components/ui/GradientButton';

// Registrar Chart.js
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, Legend, Filler
);

// Constantes da Barra de Progresso
const TOTAL_METHODOLOGIES = 5; 
const SIMS_PER_METHODOLOGY = 5; 
const TOTAL_SIMULATIONS = TOTAL_METHODOLOGIES * SIMS_PER_METHODOLOGY;
const ESTIMATED_SIM_TIME_MS = 12 * 1000; 
const TOTAL_ESTIMATED_TIME_MS = TOTAL_SIMULATIONS * ESTIMATED_SIM_TIME_MS; 
const PROGRESS_UPDATE_INTERVAL_MS = 500; 

// --- ✨ NOVO: Lista de Metodologias ---
const methodologyOptions = ['QUALIFAI', 'SPIN', 'BANT', 'MEDDIC', 'SPICED', 'Default'];

// Componente de Mensagem (para os logs)
const MessageBubble = ({ msg }) => {
  const theme = useTheme();
  const isAI = msg.role === 'ai';
  
  return (
    <Box sx={{ display: 'flex', justifyContent: isAI ? 'flex-start' : 'flex-end', mb: 1 }}>
      <Paper
        elevation={1}
        sx={{
          p: '10px 14px',
          borderRadius: isAI ? '20px 20px 20px 5px' : '20px 20px 5px 20px',
          bgcolor: isAI ? alpha(theme.palette.background.default, 0.7) : theme.palette.primary.main,
          color: isAI ? theme.palette.text.primary : theme.palette.primary.contrastText,
          maxWidth: '85%', wordWrap: 'break-word', display: 'flex', alignItems: 'center', gap: 1
        }}
      >
        {isAI ? <SmartToyIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
        <Typography variant="body2">{msg.content}</Typography>
      </Paper>
    </Box>
  );
};


export default function AITrainingPage() {
  const { t } = useTranslation();
  const theme = useTheme();
  const queryClient = useQueryClient();

  // Estados do Chat
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [currentAIState, setCurrentAIState] = useState('DISCOVERY');
  const [currentLeadStatus, setCurrentLeadStatus] = useState('contatado');

  // Estados do Progresso
  const [progress, setProgress] = useState(0); 
  const [progressText, setProgressText] = useState('');
  const progressIntervalRef = useRef(null);

  // Estado da Aba
  const [currentView, setCurrentView] = useState('simulator');

  // --- ✨ NOVO: Estado da Metodologia Manual ---
  const [manualMethodology, setManualMethodology] = useState('QUALIFAI');
  // --- Fim ---

  // Refs
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const isInitialMount = useRef(true);

  // Função helper de tradução
  const getTranslation = (key, fallback) => {
    return t(key, { defaultValue: fallback });
  };

  // Estilo Glassmorphism
  const transparentPaperStyle = useMemo(() => ({
    backgroundColor: alpha(theme.palette.background.paper, 0.7),
    backdropFilter: 'blur(10px)',
    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[3],
  }), [theme]);

  // Query de Status do Treinamento
  const { data: trainingStatus } = useQuery(
    'syntheticTrainingStatus',
    () => api.get('/ai-training/synthetic-training/status').then(res => res.data),
    { refetchInterval: 5000 }
  );

  // Mutations (Chat, Upload)
  const simulateResponseMutation = useMutation(
    (payload) => api.post('/ai-training/simulate-response', payload), {
    onMutate: () => setIsLoadingResponse(true),
    onSuccess: (data) => {
      setMessages(prev => [...prev, {
        role: 'ai',
        content: data.data.reply,
        state: data.data.conversationState,
        status: data.data.leadStatus
      }]);
      setCurrentAIState(data.data.conversationState);
      setCurrentLeadStatus(data.data.leadStatus);
    },
    onError: (error) => { setMessages(prev => [...prev, { role: 'system', content: `Erro: ${error.response?.data?.message || error.message}` }]); },
    onSettled: () => setIsLoadingResponse(false)
  });

  const uploadDocumentMutation = useMutation(
    (file) => {
      const formData = new FormData();
      formData.append('document', file);
      return api.post('/ai-training/upload-document', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    }, {
    onMutate: () => { setIsUploading(true); setUploadError(null); },
    onSuccess: (data) => {
      setMessages(prev => [...prev, { role: 'system', content: `Documento "${data.data.fileName}" analisado. ${data.data.insightsAdded} novos insights adicionados.` }]);
      queryClient.invalidateQueries('aiLearningMetrics');
    },
    onError: (error) => {
      setUploadError(error.response?.data?.message || error.message);
      setMessages(prev => [...prev, { role: 'system', content: `Falha ao processar: ${error.response?.data?.message || error.message}` }]);
    },
    onSettled: () => { setIsUploading(false); if (fileInputRef.current) fileInputRef.current.value = ""; }
  });

  // Mutation de Treinamento
  const startTrainingMutation = useMutation(
    () => api.post('/ai-training/run-synthetic-training'), {
    onMutate: () => { setMessages(prev => [...prev, { role: 'system', content: getTranslation('aiTrainingPage.syntheticTraining.starting', 'Iniciando ciclo de treinamento sintético...') }]); },
    onSuccess: (data) => {
      const result = data.data;
      setMessages(prev => [...prev, { role: 'system', content: `${getTranslation('aiTrainingPage.syntheticTraining.complete', 'Treinamento Concluído!')} (${result.simulations} simulações, ${result.insights} insights)` }]);
      queryClient.invalidateQueries('aiLearningMetrics');
      queryClient.invalidateQueries('syntheticConversations'); 
    },
    onError: (error) => { setMessages(prev => [...prev, { role: 'system', content: `${getTranslation('aiTrainingPage.syntheticTraining.error', 'Erro no Treinamento')}: ${error.response?.data?.message || error.message}` }]); }
  });

  // Lógica de Estado de Treinamento
  const isMutationLoading = startTrainingMutation.isLoading; 
  const isServerRunning = trainingStatus?.isTrainingRunning;   
  const isTrainingRunning = isMutationLoading || isServerRunning; 

  // Mutations para Deletar Logs
  const deleteLogMutation = useMutation(
    (logId) => api.delete(`/ai-training/synthetic-conversations/${logId}`),
    {
      onSuccess: () => { queryClient.invalidateQueries('syntheticConversations'); },
      onError: (error) => {
        console.error("Erro ao deletar log:", error);
        setMessages(prev => [...prev, { role: 'system', content: `Falha ao deletar log: ${error.response?.data?.message || error.message}` }]);
      }
    }
  );

  const deleteAllLogsMutation = useMutation(
    () => api.delete('/ai-training/synthetic-conversations/all'),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('syntheticConversations');
        setMessages(prev => [...prev, { role: 'system', content: data.data.message || 'Todos os logs foram limpos.' }]);
      },
      onError: (error) => {
        console.error("Erro ao limpar logs:", error);
        setMessages(prev => [...prev, { role: 'system', content: `Falha ao limpar logs: ${error.response?.data?.message || error.message}` }]);
      }
    }
  );

  // Queries (Gráfico e Logs)
  const { data: learningMetricsData, isLoading: isLoadingMetrics } = useQuery(
    'aiLearningMetrics',
    () => api.get('/ai-training/metrics').then(res => res.data),
    { staleTime: 5 * 60 * 1000, refetchInterval: 2 * 60 * 1000 }
  );

  const { 
    data: syntheticConversations, 
    isLoading: isLoadingLogs, 
    error: logsError 
  } = useQuery(
    'syntheticConversations',
    () => api.get('/ai-training/synthetic-conversations').then(res => res.data)
  );
  
  // Efeitos (Barra de Progresso e Scroll)
  useEffect(() => {
    if (isMutationLoading) {
      const startTime = Date.now();
      setProgress(0);
      setProgressText(getTranslation('aiTrainingPage.syntheticTraining.progress', 'Calculando... 0%'));
      
      progressIntervalRef.current = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const currentProgress = Math.min(100, (elapsedTime / TOTAL_ESTIMATED_TIME_MS) * 100);
        const currentSim = Math.floor((currentProgress / 100) * TOTAL_SIMULATIONS);
        setProgress(currentProgress);
        setProgressText(`${getTranslation('aiTrainingPage.syntheticTraining.simulating', 'Simulando')} ${currentSim}/${TOTAL_SIMULATIONS}... ${Math.round(currentProgress)}%`);
        
        if (currentProgress >= 100) {
          setProgressText(getTranslation('aiTrainingPage.syntheticTraining.finalizing', 'Finalizando... 100%'));
          clearInterval(progressIntervalRef.current);
        }
      }, PROGRESS_UPDATE_INTERVAL_MS);

    } 
    else if (isServerRunning) {
      setProgress(null); // 'null' ativa o modo indeterminado
      setProgressText(getTranslation('aiTrainingPage.syntheticTraining.running', 'Treinando (aguarde)...'));
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    } 
    else {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setProgress(0);
      setProgressText('');
    }
    return () => { if (progressIntervalRef.current) clearInterval(progressIntervalRef.current); };
  }, [isMutationLoading, isServerRunning, getTranslation]);

  useEffect(() => {
    if (isInitialMount.current) { isInitialMount.current = false; return; }
    if (messages.length > 0) { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
  }, [messages]);

  // Handlers (Chat, Reset, Upload)
  const handleSendMessage = useCallback(() => {
    const messageContent = inputValue.trim();
    if (!messageContent || isLoadingResponse || isTrainingRunning) return;

    const newUserMessage = { role: 'human', content: messageContent };
    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');

    const conversationHistory = [...messages, newUserMessage].map(msg => ({
      role: msg.role === 'human' ? 'user' : 'assistant',
      content: msg.content
    }));

    // --- ✨ ENVIA A METODOLOGIA MANUAL ✨ ---
    simulateResponseMutation.mutate({
      conversationHistory,
      currentState: currentAIState,
      currentLeadStatus: currentLeadStatus,
      selectedMethodology: manualMethodology // <-- Envia a escolha
    });

  }, [inputValue, isLoadingResponse, messages, simulateResponseMutation, currentAIState, currentLeadStatus, isTrainingRunning, manualMethodology]); // <-- Adiciona dependência

  const handleResetConversation = useCallback(() => {
    if (isTrainingRunning) return;
    setMessages([]);
    setInputValue('');
    setCurrentAIState('DISCOVERY');
    setCurrentLeadStatus('contatado');
    setUploadError(null);
    setManualMethodology('QUALIFAI'); // <-- Reseta a metodologia
  }, [isTrainingRunning]);

  const handleUploadClick = () => { if (!isUploading && !isTrainingRunning) { fileInputRef.current?.click(); } };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) { setUploadError('Tipo de arquivo não suportado. Use: .txt, .pdf, .docx'); return; }
      if (file.size > 10 * 1024 * 1024) { setUploadError('Arquivo muito grande. Tamanho máximo: 10MB'); return; }
      uploadDocumentMutation.mutate(file);
    }
  };

  // Handler da Aba
  const handleViewChange = (event, newValue) => {
    setCurrentView(newValue);
  };
  
  // --- ✨ NOVO: Handler da Metodologia ---
  const handleMethodologyChange = (event) => {
    setManualMethodology(event.target.value);
  };
  // --- Fim ---

  // Handlers para Deletar Logs
  const handleDeleteLog = (e, logId) => {
    e.stopPropagation(); 
    if (window.confirm(getTranslation('syntheticViewer.confirmDeleteOne', 'Tem certeza que quer deletar este log?'))) {
      deleteLogMutation.mutate(logId);
    }
  };

  const handleClearAllLogs = (e) => {
    e.stopPropagation();
    if (window.confirm(getTranslation('syntheticViewer.confirmDeleteAll', 'TEM CERTEZA que quer deletar TODOS os logs de treinamento? Esta ação é irreversível.'))) {
      deleteAllLogsMutation.mutate();
    }
  };

  // Configurações do Gráfico
  const chartData = useMemo(() => ({
    labels: learningMetricsData?.labels || [],
    datasets: [{
      label: t('aiTrainingPage.chart.successRateLabel', 'Taxa de Sucesso (%)'),
      data: learningMetricsData?.successRate || [],
      borderColor: theme.palette.primary.main,
      backgroundColor: alpha(theme.palette.primary.main, 0.2),
      tension: 0.3, fill: true, yAxisID: 'y',
    }],
  }), [learningMetricsData, theme.palette.primary.main, t]);

  const chartOptions = useMemo(() => ({
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: theme.palette.text.primary } },
      title: { display: true, text: t('aiTrainingPage.chart.title', 'Curva de Aprendizado da IA'), color: theme.palette.text.primary, font: { size: 16 } },
      tooltip: { mode: 'index', intersect: false, callbacks: { label: function(context) { return `${context.dataset.label}: ${context.parsed.y}%`; } } },
    },
    scales: {
      x: { ticks: { color: theme.palette.text.secondary }, grid: { color: alpha(theme.palette.divider, 0.5) } },
      y: { type: 'linear', display: true, position: 'left', min: 0, max: 100, ticks: { color: theme.palette.text.secondary, callback: (value) => `${value}%` }, grid: { color: alpha(theme.palette.divider, 0.5) }, title: { display: true, text: t('aiTrainingPage.chart.yAxisSuccess', 'Taxa de Sucesso (%)'), color: theme.palette.text.secondary } },
    },
    interaction: { mode: 'nearest', axis: 'x', intersect: false }
  }), [theme, t]);

  // Helper de Cor
  const getStatusColor = (status) => {
    if (status === 'qualificado' || status === 'CONVERTED') return 'success';
    if (status === 'morno') return 'warning';
    if (status === 'frio' || status === 'DISMISSED') return 'error';
    return 'default';
  };
  
  // --- RENDER ---
  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, minHeight: '100vh' }}>
      {/* Cabeçalho */}
      <Paper sx={{ ...transparentPaperStyle, p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PsychologyIcon sx={{ fontSize: '2rem', color: 'primary.main' }} />
          <Typography variant="h4" fontWeight="bold">
            {getTranslation('aiTrainingPage.title', 'Simulador de Treinamento da IA')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={getTranslation('aiTrainingPage.resetTooltip', 'Reiniciar conversa do simulador')}>
            <span>
              <IconButton 
                onClick={handleResetConversation} 
                color="warning" 
                disabled={isTrainingRunning || currentView !== 'simulator'}
              >
                <RefreshIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Paper>

      {/* Grid Superior (Chat e Controles) */}
      <Grid container spacing={3}>
        
        {/* Coluna da Esquerda (com Abas) */}
        <Grid item xs={12} md={7} lg={8}>
          <Paper sx={{ ...transparentPaperStyle, height: '70vh', display: 'flex', flexDirection: 'column' }}>
            {/* 1. As Abas */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={currentView} 
                onChange={handleViewChange} 
                aria-label="training view tabs"
                variant="fullWidth"
                sx={{
                  '& .MuiTab-root': {
                    backgroundColor: alpha(theme.palette.background.paper, 0.1),
                    borderTopLeftRadius: theme.shape.borderRadius,
                    borderTopRightRadius: theme.shape.borderRadius,
                  },
                  '& .Mui-selected': {
                    backgroundColor: alpha(theme.palette.background.default, 0.5),
                  }
                }}
              >
                <Tab 
                  value="simulator" 
                  label={getTranslation('aiTrainingPage.tabs.simulator', 'Simulador')} 
                  icon={<ChatIcon />} 
                  iconPosition="start" 
                />
                <Tab 
                  value="logs" 
                  label={getTranslation('aiTrainingPage.tabs.logs', 'Logs de Treinamento')} 
                  icon={<HistoryIcon />} 
                  iconPosition="start" 
                />
              </Tabs>
            </Box>

            {/* 2. O Conteúdo das Abas */}
            <Box sx={{ flexGrow: 1, overflow: 'auto' }}> 
              
              {/* Painel 1: Simulador */}
              {currentView === 'simulator' && (
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  
                  {/* --- ✨ HEADER DO CHAT MODIFICADO ✨ --- */}
                  <Box sx={{ 
                    p: 1.5, 
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`, 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 2, 
                    alignItems: 'center' 
                  }}>
                    <Typography variant="overline" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      Estado: <Chip label={currentAIState} size="small" color="primary" variant="outlined" />
                    </Typography>
                    <Typography variant="overline" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      Status: <Chip label={currentLeadStatus} size="small" color={getStatusColor(currentLeadStatus)} variant="outlined" />
                    </Typography>
                    
                    {/* --- ✨ DROPDOWN DE METODOLOGIA ✨ --- */}
                    <FormControl variant="outlined" size="small" sx={{ minWidth: 150, ml: 'auto' }}>
                      <InputLabel id="methodology-select-label">Metodologia</InputLabel>
                      <Select
                        labelId="methodology-select-label"
                        id="methodology-select"
                        value={manualMethodology}
                        label="Metodologia"
                        onChange={handleMethodologyChange}
                        disabled={isTrainingRunning || isLoadingResponse || messages.length > 0} // Desabilita se a conversa já começou
                        sx={{
                          backgroundColor: alpha(theme.palette.background.paper, 0.5),
                          '.MuiOutlinedInput-notchedOutline': {
                            borderColor: alpha(theme.palette.divider, 0.5),
                          },
                        }}
                      >
                        {methodologyOptions.map((method) => (
                          <MenuItem key={method} value={method}>{method}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  {/* --- FIM DA MODIFICAÇÃO --- */}

                  {/* Container das Mensagens */}
                  <Box sx={{ 
                    flexGrow: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 2,
                    '&::-webkit-scrollbar': { width: '8px' },
                    '&::-webkit-scrollbar-track': { background: alpha(theme.palette.background.default, 0.5), borderRadius: '4px' },
                    '&::-webkit-scrollbar-thumb': { background: alpha(theme.palette.primary.main, 0.3), borderRadius: '4px' },
                  }}>
                    <AnimatePresence>
                      {messages.length === 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column', gap: 2, textAlign: 'center' }}>
                          <ChatIcon sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.5 }} />
                          <Typography variant="h6" color="text.secondary">{getTranslation('aiTrainingPage.emptyChatTitle', 'Simule uma conversa de vendas')}</Typography>
                          <Typography variant="body2" color="text.secondary">{getTranslation('aiTrainingPage.emptyChatSubtitle', 'Selecione uma metodologia acima e comece a digitar.')}</Typography>
                        </motion.div>
                      )}
                      {messages.map((msg, index) => (
                        <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} layout style={{ alignSelf: msg.role === 'human' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                          <Paper
                            elevation={1}
                            sx={{
                              p: '10px 14px',
                              borderRadius: msg.role === 'human' ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                              bgcolor: msg.role === 'human' ? theme.palette.primary.main : msg.role === 'system' ? theme.palette.info.light : alpha(theme.palette.background.paper, 0.9),
                              color: msg.role === 'human' ? theme.palette.primary.contrastText : theme.palette.text.primary,
                              wordWrap: 'break-word',
                            }}
                          >
                            <Typography variant="body2">{msg.content}</Typography>
                            {msg.role === 'ai' && (msg.state || msg.status) && (
                              <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.7, textAlign: 'right', fontStyle: 'italic' }}>
                                {msg.state && `Estado: ${msg.state}`} {msg.status && ` | Status: ${msg.status}`}
                              </Typography>
                            )}
                          </Paper>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {isLoadingResponse && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={20} />
                        <Typography variant="caption" color="text.secondary">{getTranslation('aiTrainingPage.thinking', 'IA pensando...')}</Typography>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </Box>

                  {/* Área de Input */}
                  <Box
                    component="form"
                    onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                    sx={{ p: 1.5, borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}`, display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <TextField
                      fullWidth variant="outlined"
                      placeholder={getTranslation('aiTrainingPage.inputPlaceholder', 'Digite sua mensagem como "lead"...')}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      disabled={isLoadingResponse || isTrainingRunning} 
                      multiline maxRows={3} size="small"
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }}}
                    />
                    <GradientButton 
                      type="submit" 
                      disabled={!inputValue.trim() || isLoadingResponse || isTrainingRunning} 
                      sx={{ p: 1, minWidth: 'auto' }}
                    >
                      <SendIcon />
                    </GradientButton>
                  </Box>
                </Box>
              )}

              {/* Painel 2: Logs */}
              {currentView === 'logs' && (
                <Box sx={{ p: 2 }}>
                  {/* Cabeçalho dos Logs com Botão Limpar */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                      {t('syntheticViewer.title', 'Logs de Treinamento Sintético')}
                    </Typography>
                    <Tooltip title={t('syntheticViewer.clearAllTooltip', 'Limpar todos os logs')}>
                      <span>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          disabled={deleteAllLogsMutation.isLoading || !syntheticConversations || syntheticConversations.length === 0}
                          startIcon={deleteAllLogsMutation.isLoading ? <CircularProgress size={16} color="inherit" /> : <DeleteForeverIcon />}
                          onClick={handleClearAllLogs}
                        >
                          {t('syntheticViewer.clearAll', 'Limpar Tudo')}
                        </Button>
                      </span>
                    </Tooltip>
                  </Box>

                  {/* Lista de Logs */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {isLoadingLogs && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress />
                      </Box>
                    )}
                    {logsError && (
                      <Alert severity="error">
                        {t('syntheticViewer.error', 'Erro ao carregar conversas: ')} {logsError.message}
                      </Alert>
                    )}
                    {!isLoadingLogs && !logsError && syntheticConversations?.length === 0 && (
                      <Alert severity="info">
                        {t('syntheticViewer.noData', 'Nenhuma conversa sintética foi gerada ainda. Inicie um ciclo de treinamento para ver os logs aqui.')}
                      </Alert>
                    )}
                    {syntheticConversations && syntheticConversations.length > 0 && (
                      syntheticConversations.map((convo) => (
                        <Accordion key={convo._id} sx={{ 
                          backgroundColor: alpha(theme.palette.background.default, 0.5),
                          backgroundImage: 'none' 
                        }}>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Grid container spacing={1} alignItems="center">
                              <Grid item xs={12} sm={3}>
                                <Typography fontWeight="bold">{convo.leadPersonaName}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {format(new Date(convo.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                </Typography>
                              </Grid>
                              <Grid item xs={6} sm={3}>
                                <Chip label={convo.methodologyUsed} size="small" variant="outlined" color="primary" />
                              </Grid>
                              <Grid item xs={6} sm={3}>
                                <Chip label={convo.finalLeadStatus} size="small" variant="outlined" color={getStatusColor(convo.finalLeadStatus)} />
                              </Grid>
                              <Grid item xs={12} sm={3} sx={{ textAlign: { sm: 'right' } }}>
                                <Tooltip title={t('syntheticViewer.deleteOne', 'Deletar este log')}>
                                  <span>
                                    <IconButton
                                      color="warning"
                                      size="small"
                                      disabled={deleteLogMutation.isLoading}
                                      onClick={(e) => handleDeleteLog(e, convo._id)}
                                      sx={{ mr: 1 }}
                                    >
                                      {deleteLogMutation.isLoading && deleteLogMutation.variables === convo._id
                                        ? <CircularProgress size={20} color="inherit" />
                                        : <DeleteIcon fontSize="small" />
                                      }
                                    </IconButton>
                                  </span>
                                </Tooltip>
                              </Grid>
                            </Grid>
                          </AccordionSummary>
                          <AccordionDetails sx={{
                            borderTop: `1px solid ${theme.palette.divider}`,
                            maxHeight: '300px',
                            overflowY: 'auto',
                            p: 2,
                            bgcolor: alpha(theme.palette.background.paper, 0.3)
                          }}>
                            {convo.messages.map((msg, index) => (
                              <MessageBubble key={index} msg={msg} />
                            ))}
                          </AccordionDetails>
                        </Accordion>
                      ))
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Coluna da Direita (Controles) */}
        <Grid item xs={12} md={5} lg={4} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Card de Treinamento Sintético */}
          <Paper sx={{ ...transparentPaperStyle, p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PsychologyIcon /> {getTranslation('aiTrainingPage.syntheticTraining.title', 'Treinamento Sintético')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {getTranslation('aiTrainingPage.syntheticTraining.description', 'Dispare um agente para simular dezenas de conversas e alimentar a memória RAG da IA.')}
            </Typography>
            <GradientButton
              variant="contained"
              startIcon={isTrainingRunning ? <CircularProgress size={20} color="inherit" /> : <AutoGraphIcon />}
              onClick={() => startTrainingMutation.mutate()}
              disabled={isTrainingRunning || isLoadingResponse || isUploading}
              fullWidth
            >
              {isTrainingRunning 
                ? getTranslation('aiTrainingPage.syntheticTraining.running', 'Treinando...') 
                : getTranslation('aiTrainingPage.syntheticTraining.button', 'Iniciar Ciclo de Treino')
              }
            </GradientButton>
            
            {isTrainingRunning && (
              <Box sx={{ width: '100%', mt: 2 }}>
                <LinearProgress 
                  variant={progress === null ? "indeterminate" : "determinate"}
                  value={progress === null ? undefined : progress} 
                />
                <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                  {progressText}
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Card de Upload */}
          <Paper sx={{ ...transparentPaperStyle, p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FileUploadIcon /> {getTranslation('aiTrainingPage.uploadCard.title', 'Treinar IA com Documentos')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {getTranslation('aiTrainingPage.uploadCard.description', 'Faça upload de transcrições ou documentos para melhorar a memória da IA')}
            </Typography>
            <Button
              variant="outlined" component="label"
              startIcon={isUploading ? <CircularProgress size={20} /> : <FileUploadIcon />}
              onClick={handleUploadClick}
              disabled={isUploading || isTrainingRunning} 
              fullWidth sx={{ mb: 1 }}
            >
              {isUploading ? 'Enviando...' : 'Escolher Arquivo'}
              <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} accept=".txt,.pdf,.docx" />
            </Button>
            {uploadError && ( <Alert severity="error" onClose={() => setUploadError(null)}>{uploadError}</Alert> )}
            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
              {getTranslation('aiTrainingPage.uploadCard.supportedFiles', 'Suporta: .txt, .pdf, .docx')}
            </Typography>
          </Paper>

          {/* Card do Gráfico */}
          <Paper sx={{ ...transparentPaperStyle, p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AutoGraphIcon /> {getTranslation('aiTrainingPage.chartCard.title', 'Desempenho da IA')}
              <Tooltip title={getTranslation('aiTrainingPage.chartCard.tooltip', 'Métricas de aprendizado e taxa de sucesso ao longo do tempo')}>
                <InfoOutlinedIcon fontSize="small" color="action" />
              </Tooltip>
            </Typography>
            <Box sx={{ position: 'relative', height: '250px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {isLoadingMetrics ? ( <Skeleton variant="rectangular" width="100%" height="100%" /> ) 
              : learningMetricsData?.labels?.length > 0 ? (
                <>
                  <Line options={chartOptions} data={chartData} />
                  <Box sx={{ mt: 1, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {getTranslation('aiTrainingPage.totalInsights', 'Total de Insights')}: {learningMetricsData?.totalInsights || 0}
                    </Typography>
                  </Box>
                </>
              ) : ( 
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column', gap: 1 }}>
                  <Typography color="text.secondary" textAlign="center">{getTranslation('aiTrainingPage.noMetricsData', 'Aguardando dados de treinamento...')}</Typography>
                  <Typography variant="caption" color="text.secondary" textAlign="center">{getTranslation('aiTrainingPage.noMetricsHint', 'Faça upload de documentos ou simule conversas para gerar métricas')}</Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}