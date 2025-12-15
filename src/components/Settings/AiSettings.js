import React, { useEffect, useState, useRef } from 'react';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import {
  Box, Typography, Paper, TextField, Button, Switch, FormControlLabel,
  Grid, MenuItem, Select, ToggleButtonGroup, ToggleButton,
  IconButton, Collapse, Fade, FormControl, Tooltip, useTheme, useMediaQuery,
  CircularProgress,
  // --- NOVAS IMPORTAÇÕES ---
  Dialog, DialogTitle, DialogContent, DialogActions, Chip, DialogContentText
} from '@mui/material';
import { motion } from 'framer-motion';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  Delete as DeleteIcon, Add as AddIcon, InfoOutlined as InfoIcon,
  PlayCircleOutline as PlayCircleOutlineIcon, AssistantPhoto as TourIcon,
  // --- NOVAS IMPORTAÇÕES DE ÍCONES ---
  CheckCircle as CheckCircleIcon, Error as ErrorIcon,
  LinkOff as LinkOffIcon // <-- ADICIONEI ESTE ÍCONE
} from '@mui/icons-material';

// --- ARQUIVOS DE SERVIÇO, ESTADO E CONTEXTO ---
import api from '../../services/api';
import { useAuthStore } from '../../stores/authStore';
import { useShowcaseContext } from '../../contexts/ShowcaseContext';
import ShowcaseBlocker from '../Showcase/ShowcaseBlocker';
import { GradientButton } from '../ui/GradientButton';
import { useTour } from '../../contexts/TourContext';

// --- ESTRUTURA DE DADOS ---
const methodologiesInfo = {
  Default: { name: "Sem metodologia", logo: "/images-removebg-preview.png", gradient: "linear-gradient(135deg, #6c757d 0%, #cdd1d4ff 100%)", explanation: "Uma abordagem flexível e conversacional. A IA foca em criar um bom relacionamento e entender as necessidades gerais do lead." },
  QUALIFAI: { name: "Qualifai", logo: "/Qaii.png", gradient: "linear-gradient(135deg, #7150caff 0%, #bb45dfff 100%)", explanation: "O método Qualifai  é uma abordagem híbrida, flexível e hiperpersonalizada, projetada para qualificar leads com precisão e construir relacionamentos duradouros." },
  SPICED: { name: "SPICED", logo: "/apimentado.png", gradient: "linear-gradient(135deg, #f53844 0%, #ff8c42 100%)", explanation: "Foca em entender a Situação, a Dor (Pain), o Impacto, o Evento Crítico e o processo de Decisão. Ideal para vendas baseadas em valor." },
  SPIN: { name: "SPIN Selling", logo: "/spin.png", gradient: "linear-gradient(135deg, #7356fc 0%, #56cdfc 100%)", explanation: "Guia o lead através de perguntas sobre Situação, Problema, Implicação e Necessidade de Solução, fazendo-o concluir o valor da oferta." },
  BANT: { name: "BANT", logo: "/bandiit.png", gradient: "linear-gradient(135deg, #dc3884 0%, #f77737 100%)", explanation: "Framework de qualificação rápida que valida Orçamento (Budget), Autoridade de decisão, a real Necessidade e o Prazo (Timeline)." },
  MEDDIC: { name: "MEDDIC", logo: '/MEDDIC CORRIGIDO.png', gradient: "linear-gradient(135deg, #2ce5a9 0%, #38dcc1 100%)", explanation: "Perfeita para vendas complexas. Investiga Métricas, Decisor Econômico, Critérios de decisão, Processo, Dor e busca um Campeão interno." },
};

const DEFAULT_AI_PROMPT = `Você é um SDR (Representante de Desenvolvimento de Vendas) virtual da QualifAI, especialista em iniciar conversas produtivas. Sua personalidade é profissional, prestativa e objetiva...`;

const FieldLabel = ({ children, required = false, tooltip = null }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
    <Typography variant="subtitle2" component="label" sx={{ fontWeight: 500, color: 'text.secondary' }}>
      {children}{required && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>}
    </Typography>
    {tooltip && <Tooltip title={tooltip}><InfoIcon sx={{ fontSize: 16, ml: 0.5, color: 'text.secondary', cursor: 'pointer' }} /></Tooltip>}
  </Box>
);

const CriteriaFieldArray = ({ control, name, label, status }) => {
  const { fields, append, remove } = useFieldArray({ control, name });
  const { isGuestMode } = useShowcaseContext();
  const formControlStyles = { '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' } } };

  const statusStyles = {
    hot: { borderColor: '#ff6b6b', boxShadow: '0 0 15px -5px #ff6b6b' },
    warm: { borderColor: '#feca57', boxShadow: '0 0 15px -5px #feca57' },
    cold: { borderColor: '#48dbfb', boxShadow: '0 0 15px -5px #48dbfb' },
  };
  const currentStyle = statusStyles[status] || { borderColor: 'rgba(255,255,255,0.1)' };

  return (
    <Box sx={{ p: 2, height: '100%', borderRadius: 2, backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid', transition: 'border-color 0.3s, box-shadow 0.3s', ...currentStyle }}>
      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>{label}</Typography>
      {fields.map((item, index) => (
        <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Controller name={`${name}[${index}]`} control={control} defaultValue={item.value} render={({ field }) => (<TextField {...field} variant="outlined" size="small" fullWidth placeholder="Adicionar critério" disabled={isGuestMode} sx={formControlStyles} />)} />
          <ShowcaseBlocker inline><IconButton onClick={() => remove(index)} color="error" size="small" sx={{ ml: 1 }}><DeleteIcon /></IconButton></ShowcaseBlocker>
        </Box>
      ))}
      <ShowcaseBlocker inline><Button startIcon={<AddIcon />} onClick={() => append('')} size="small">Adicionar critério</Button></ShowcaseBlocker>
    </Box>
  );
};

// --- COMPONENTE MethodologyCard (com ajuste de altura da última vez) ---
const MethodologyCard = ({ methodologyKey, info, isSelected, onSelect }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleMobileFlip = (e) => {
    e.stopPropagation();
    if (isMobile) setIsFlipped(!isFlipped);
  };

  const glassmorphismStyle = {
    position: 'absolute', width: '100%', height: '100%',
    backfaceVisibility: 'hidden', display: 'flex', borderRadius: 3,
    border: '1px solid rgba(255, 255, 255, 0.3)', background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(15px)', color: 'white', overflow: 'hidden',
  };

  return (
    // Altura ajustada na interação anterior
    <Box onClick={onSelect} onMouseEnter={!isMobile ? () => setIsFlipped(true) : undefined} onMouseLeave={!isMobile ? () => setIsFlipped(false) : undefined} sx={{ perspective: '1000px', cursor: 'pointer', position: 'relative', height: { xs: 180, md: 200 } }}>
      <motion.div animate={{ rotateY: isFlipped ? 180 : 0 }} transition={{ duration: 0.6, ease: 'easeInOut' }} style={{ position: 'relative', transformStyle: 'preserve-3d', width: '100%', height: '100%' }}>
        
        {/* Frente do Card */}
        <Box sx={{ ...glassmorphismStyle, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly', p: 2, opacity: isSelected ? 1 : 0.7, transform: isSelected ? 'translateY(-10px) scale(1.05)' : 'scale(1)', boxShadow: isSelected ? `0 0 20px -5px ${theme.palette.primary.light}, 0 10px 30px -10px rgba(0,0,0,0.5)` : '0 4px 15px rgba(0,0,0,0.2)', borderColor: isSelected ? theme.palette.primary.main : 'rgba(255, 255, 255, 0.3)', transition: 'transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease, border-color 0.3s ease', '&:hover': { opacity: 1, transform: isSelected ? 'translateY(-10px) scale(1.05)' : 'translateY(-5px) scale(1.02)' }, '&::before': { content: '""', position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, background: info.gradient, opacity: 0.75, borderRadius: 'inherit', zIndex: -1 } }}>
          <Box component="img" src={info.logo} sx={{ height: { xs: 50, md: 60 }, objectFit: 'contain', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.4))' }} />
          <Typography fontWeight="bold" sx={{ textAlign: 'center', width: '100%', fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' }, overflowWrap: 'break-word', wordBreak: 'break-word' }}>
            {info.name}
          </Typography>
          {isMobile && (<IconButton onClick={handleMobileFlip} sx={{ position: 'absolute', top: 8, right: 8, color: 'white', opacity: 0.8 }}><InfoIcon /></IconButton>)}
        </Box>

        {/* Verso do Card (com ajuste de fonte da última vez) */}
        <Box onClick={isMobile ? handleMobileFlip : undefined} sx={{ ...glassmorphismStyle, transform: 'rotateY(180deg)', alignItems: 'center', justifyContent: 'center', p: 3, boxShadow: `0 8px 25px -5px rgba(0,0,0,0.3)`, '&::before': { content: '""', position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, background: info.gradient, opacity: 0.85, borderRadius: 'inherit', zIndex: -1 } }}>
          <Typography
            variant="body2"
            textAlign="center"
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
              lineHeight: { xs: 1.4, md: 1.5 }, 
              overflowY: 'auto', // Permite scroll se o texto for muito grande
              maxHeight: '100%', // Garante que o texto não vaze do card
              // Oculta a barra de scroll
              scrollbarWidth: 'none', // Firefox
              '&::-webkit-scrollbar': {
                display: 'none' // Chrome, Safari, etc.
              }
            }}
          >
            {info.explanation}
          </Typography>
        </Box>
      </motion.div>
    </Box>
  );
};
// --- FIM DO COMPONENTE MethodologyCard ---


// --- NOVO COMPONENTE: MODAL DE CONFIGURAÇÃO TWILIO ---
const TwilioConfigModal = ({ open, onClose, config }) => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();
  const { isGuestMode, openModal } = useShowcaseContext();

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      twilioAccountSid: '',
      twilioAuthToken: '',
      twilioPhoneNumber: ''
    }
  });

  // Preenche o formulário quando o modal abre (mas esconde o token salvo)
  useEffect(() => {
    if (open) {
      reset({
        twilioAccountSid: config?.twilioAccountSid || '',
        twilioAuthToken: '', // Sempre vazio por segurança
        twilioPhoneNumber: config?.twilioPhoneNumber || ''
      });
    }
  }, [config, open, reset]);

  // Nova mutação SÓ para a Twilio
  const updateTwilioMutation = useMutation(
    (data) => api.put('/auth/profile', data),
    {
      onSuccess: (response) => {
        toast.success('Configurações da Twilio salvas com sucesso!');
        updateUser(response.data.user);
        queryClient.invalidateQueries('user-profile');
        onClose(); // Fecha o modal
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erro ao salvar configurações da Twilio');
      }
    }
  );

  const onTwilioSubmit = (data) => {
    if (isGuestMode) { openModal(); return; }

    const payload = {
      settings: {
        // Preserva as configurações de IA existentes
        aiConfig: { ...useAuthStore.getState().user.settings?.aiConfig },
        // Adiciona/Atualiza as configurações da Twilio
        twilioConfig: {
          twilioAccountSid: data.twilioAccountSid,
          twilioPhoneNumber: data.twilioPhoneNumber,
        }
      }
    };

    // Só envia o Auth Token se o usuário digitou um novo
    if (data.twilioAuthToken) {
      payload.settings.twilioConfig.twilioAuthToken = data.twilioAuthToken;
    }

    updateTwilioMutation.mutate(payload);
  };

  // Estilo "Glass" para o Modal
  const glassStyle = {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(30, 30, 40, 0.8)' : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    border: `1px solid ${theme.palette.divider}`,
    color: 'text.primary',
    borderRadius: 3
  };

  const modalFormControlStyles = {
    '& .MuiInputLabel-root': { color: 'text.secondary' },
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: theme.palette.divider },
      '&:hover fieldset': { borderColor: 'primary.light' },
    },
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: glassStyle }}>
      <Box component="form" onSubmit={handleSubmit(onTwilioSubmit)}>
        <DialogTitle fontWeight="bold">Configurar Integração Twilio</DialogTitle>
        <DialogContent>
          <DialogContentText color="text.secondary" sx={{ mb: 3 }}>
            Insira suas credenciais da Twilio para habilitar o envio de mensagens de voz e SMS. Elas são armazenadas com segurança.
          </DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="twilioAccountSid"
                control={control}
                rules={{ required: 'O Account SID é obrigatório.' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Twilio Account SID"
                    fullWidth
                    sx={modalFormControlStyles}
                    error={!!errors.twilioAccountSid}
                    helperText={errors.twilioAccountSid?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="twilioAuthToken"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="password"
                    label="Twilio Auth Token"
                    fullWidth
                    placeholder="••••••••••••••••••••"
                    helperText="Seu token existente está salvo. Insira um novo apenas se quiser atualizá-lo."
                    sx={modalFormControlStyles}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="twilioPhoneNumber"
                control={control}
                rules={{ required: 'Este campo é obrigatório.' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Número da Twilio (ou Messaging Service SID)"
                    fullWidth
                    sx={modalFormControlStyles}
                    error={!!errors.twilioPhoneNumber}
                    helperText={errors.twilioPhoneNumber?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: '16px 24px' }}>
          <Button onClick={onClose} color="inherit" sx={{ color: 'text.secondary' }}>Cancelar</Button>
          <Button type="submit" variant="contained" color="primary" disabled={updateTwilioMutation.isLoading}>
            {updateTwilioMutation.isLoading ? <CircularProgress size={24} color="inherit" /> : "Salvar Conexão"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
// --- FIM DO NOVO COMPONENTE ---


export default function AiSettings() {
  const { user, updateUser } = useAuthStore();
  const queryClient = useQueryClient();
  const { isGuestMode, openModal } = useShowcaseContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isSampleLoading, setIsSampleLoading] = useState(false);

  // --- NOVO ESTADO PARA OS MODAIS ---
  const [isTwilioModalOpen, setIsTwilioModalOpen] = useState(false);
  const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false); // <-- NOVO ESTADO

  const { startTour } = useTour();

  const aiSettingsSteps = [
    {
      element: '#tour-agent-profile',
      popover: {
        title: 'Perfil do Agente',
        description: 'Aqui você define a identidade da sua IA, como o nome, estilo de comunicação e informações sobre sua empresa.'
      }
    },
    {
      element: '#tour-methodologies',
      popover: {
        title: 'Metodologias de Venda',
        description: 'Escolha a estratégia principal que a IA usará para qualificar os leads. Passe o mouse sobre um card para ver a explicação e clique para selecioná-lo.',
        side: "top",
        align: 'start'
      }
    },
    // Adicionei um step para a Twilio
    {
      element: '#tour-twilio-integration',
      popover: {
        title: 'Integração de Telefonia',
        description: 'Conecte sua conta da Twilio aqui. Isso permitirá que a IA realize ações de voz e SMS.',
        side: "top",
        align: 'start'
      }
    },
    {
      element: '#tour-voice-interaction',
      popover: {
        title: 'Interação por Voz',
        description: 'Ative esta opção para permitir que a IA envie e receba mensagens de áudio no WhatsApp, escolhendo a voz que mais te agrada.',
        side: "top",
        align: 'start'
      }
    },
    {
      element: '#tour-qualification-criteria',
      popover: {
        title: 'Critérios de Qualificação',
        description: 'Ensine a IA a classificar os leads como Quente, Morno ou Frio com base nas palavras-chave que você definir aqui.',
        side: "top",
        align: 'start'
      }
    },
    {
      element: '#tour-save-button',
      popover: {
        title: 'Salvar Tudo',
        description: 'Quando terminar de configurar, clique aqui para salvar todas as suas preferências. Bom trabalho!',
        side: "top",
        align: 'start'
      }
    }
  ];

  const { control: aiControl, handleSubmit: handleSubmitAi, reset: resetAiForm, formState: { errors: aiErrors }, watch: watchAi, setValue } = useForm({
    defaultValues: {
      agentName: '',
      assignConversation: true,
      communicationStyle: 'Normal',
      companyName: '',
      companyIndustry: '',
      language: 'Brazilian Portuguese',
      prompt: '',
      salesMethodology: 'Default',
      enableAutonomousSwitching: false,
      hotCriteria: [],
      warmCriteria: [],
      coldCriteria: [],
      enableVoiceInteraction: false,
      voiceModel: 'nova',
      followupEnabled: false,
      followupWaitPeriod: 24,
      followupWaitUnit: 'hours',
      followupMaxAttempts: 2,
      followupTemplate: '',
    },
  });

  const watchAiFollowup = watchAi("followupEnabled");
  const watchEnableVoice = watchAi("enableVoiceInteraction");
  const selectedVoice = watchAi("voiceModel");

  const { data: approvedFollowUpTemplates, isLoading: followUpTemplatesLoading } = useQuery('approvedFollowUpTemplates', () => api.get('/template-message', { params: { status: 'approved', templateType: 'follow_up' } }).then(res => res.data), { enabled: true });

  useEffect(() => {
    if (user) {
      const parseCriteria = (criteria) => {
        if (Array.isArray(criteria) && criteria.length > 0) return criteria;
        if (typeof criteria === 'string' && criteria.trim()) {
          return criteria.split('\n').map(c => c.replace(/^- /, '').trim()).filter(Boolean);
        }
        return [];
      };

      resetAiForm({
        agentName: user.settings?.aiConfig?.agentName || 'Assistente Virtual',
        assignConversation: user.settings?.aiConfig?.assignConversation ?? true,
        communicationStyle: user.settings?.aiConfig?.communicationStyle || 'Normal',
        companyName: user.company?.name || '',
        companyIndustry: user.settings?.aiConfig?.companyIndustry || '',
        language: user.settings?.aiConfig?.language || 'Brazilian Portuguese',
        prompt: user.settings?.aiConfig?.prompt || DEFAULT_AI_PROMPT,
        salesMethodology: user.settings?.aiConfig?.salesMethodology || 'Default',
        enableAutonomousSwitching: user.settings?.aiConfig?.enableAutonomousSwitching ?? false,
        hotCriteria: parseCriteria(user.settings?.aiConfig?.hotCriteria),
        warmCriteria: parseCriteria(user.settings?.aiConfig?.warmCriteria),
        coldCriteria: parseCriteria(user.settings?.aiConfig?.coldCriteria),
        enableVoiceInteraction: user.settings?.aiConfig?.enableVoiceInteraction || false,
        voiceModel: user.settings?.aiConfig?.voiceModel || 'nova',
        followupEnabled: user.settings?.aiConfig?.followup?.enabled ?? false,
        followupWaitPeriod: user.settings?.aiConfig?.followup?.waitPeriod || 24,
        followupWaitUnit: user.settings?.aiConfig?.followup?.waitUnit || 'hours',
        followupMaxAttempts: user.settings?.aiConfig?.followup?.maxAttempts || 2,
        followupTemplate: user.settings?.aiConfig?.followup?.followupTemplate?._id || user.settings?.aiConfig?.followup?.followupTemplate || '',
      });
    }
  }, [user, resetAiForm]);

  const updateSettingsMutation = useMutation(
    (data) => api.put('/auth/profile', data),
    {
      onSuccess: (response) => {
        toast.success('Configurações de IA salvas com sucesso!');
        updateUser(response.data.user);
        queryClient.invalidateQueries('user-profile');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erro ao salvar configurações');
      }
    }
  );

  // --- NOVA MUTAÇÃO PARA DESCONECTAR A TWILIO ---
  const disconnectTwilioMutation = useMutation(
    () => api.put('/auth/profile', {
      settings: {
        aiConfig: { ...user.settings?.aiConfig }, // Preserva a config de IA
        twilioConfig: { // Limpa a config da Twilio
          twilioAccountSid: '',
          twilioAuthToken: '',
          twilioPhoneNumber: ''
        }
      }
    }),
    {
      onSuccess: (response) => {
        toast.success('Twilio desconectado com sucesso!');
        updateUser(response.data.user);
        queryClient.invalidateQueries('user-profile');
        setIsDisconnectModalOpen(false); // Fecha o modal de confirmação
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erro ao desconectar a Twilio');
      }
    }
  );
  // --- FIM DA NOVA MUTAÇÃO ---

  const onSubmitAiSettings = (data) => {
    if (isGuestMode) {
      openModal();
      return;
    }
    const payload = {
      settings: {
        // As configs da Twilio são salvas pelo modal,
        // então precisamos garantir que elas não sejam apagadas
        twilioConfig: { ...user.settings?.twilioConfig },
        aiConfig: {
          agentName: data.agentName,
          assignConversation: data.assignConversation,
          communicationStyle: data.communicationStyle,
          companyName: data.companyName,
          companyIndustry: data.companyIndustry,
          language: data.language,
          prompt: data.prompt,
          salesMethodology: data.salesMethodology,
          enableAutonomousSwitching: data.enableAutonomousSwitching,
          hotCriteria: data.hotCriteria.filter(Boolean),
          warmCriteria: data.warmCriteria.filter(Boolean),
          coldCriteria: data.coldCriteria.filter(Boolean),
          enableVoiceInteraction: data.enableVoiceInteraction,
          voiceModel: data.voiceModel,
          followup: {
            enabled: data.followupEnabled,
            waitPeriod: data.followupWaitPeriod,
            waitUnit: data.followupWaitUnit,
            maxAttempts: data.followupMaxAttempts,
            followupTemplate: data.followupTemplate,
          }
        }
      }
    };
    updateSettingsMutation.mutate(payload);
  };

  const handlePlaySample = async () => {
    if (!selectedVoice || isSampleLoading) return;
    setIsSampleLoading(true);
    try {
      const response = await api.post('/ai/text-to-speech-sample',
        { voice: selectedVoice },
        { responseType: 'blob' }
      );

      const audioUrl = URL.createObjectURL(response.data);
      const audio = new Audio(audioUrl);
      audio.play();
      audio.onended = () => URL.revokeObjectURL(audioUrl);
    } catch (error) {
      toast.error("Não foi possível gerar a amostra de voz.");
    } finally {
      setIsSampleLoading(false);
    }
  };

  const formControlStyles = {
    '& .MuiInputLabel-root': { color: 'text.secondary' },
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
      '&:hover fieldset': { borderColor: 'primary.light' },
    },
    '& .MuiSelect-icon': { color: 'text.secondary' }
  };

  const paperStyles = {
    p: { xs: 2, md: 3 },
    mt: 4,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.2)'
  };

  // --- LÓGICA PARA O STATUS DA TWILIO ---
  const twilioConfig = user?.settings?.twilioConfig;
  const isTwilioConnected = twilioConfig?.twilioAccountSid && twilioConfig?.twilioAuthToken && twilioConfig?.twilioPhoneNumber;
  
  // --- ESTILO DE VIDRO PARA O MODAL DE DESCONEXÃO ---
  const modalGlassStyle = {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(30, 30, 40, 0.8)' : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    border: `1px solid ${theme.palette.divider}`,
    color: 'text.primary',
    borderRadius: 3
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmitAi(onSubmitAiSettings)}
      sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, sm: 3 }, position: 'relative', overflow: 'hidden' }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight="bold" gutterBottom>Inteligência Artificial</Typography>
          <Typography variant="body2" color="text.secondary">
            Personalize o comportamento, a linguagem e os critérios de qualificação do seu agente de IA.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<TourIcon />}
          onClick={() => startTour(aiSettingsSteps)}
          sx={{ display: { xs: 'none', md: 'flex' } }}
        >
          Fazer Tour
        </Button>
      </Box>

      <Fade in timeout={300}>
        <Paper id="tour-agent-profile" variant="outlined" sx={{ ...paperStyles, mt: 3 }}>
          <Typography variant="h6" gutterBottom>Perfil do Agente</Typography>
          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={12} md={6}><FieldLabel required>Nome do Agente</FieldLabel><Controller name="agentName" control={aiControl} rules={{ required: 'O nome do agente é obrigatório.' }} render={({ field }) => (<TextField {...field} fullWidth error={!!aiErrors.agentName} helperText={aiErrors.agentName?.message} sx={formControlStyles} disabled={isGuestMode} />)} /></Grid>
            <Grid item xs={12} md={6}><FieldLabel>Permitir que a IA se apresente?</FieldLabel><Controller name="assignConversation" control={aiControl} render={({ field }) => (<FormControlLabel control={<Switch {...field} checked={field.value} disabled={isGuestMode} />} label="Assinar Conversa" />)} /></Grid>
            <Grid item xs={12}><FieldLabel>Estilo de Comunicação</FieldLabel><Controller name="communicationStyle" control={aiControl} render={({ field }) => (<ToggleButtonGroup value={field.value} exclusive onChange={(e, val) => val && field.onChange(val)} disabled={isGuestMode} fullWidth={isMobile} orientation={isMobile ? 'vertical' : 'horizontal'}><ToggleButton value="Normal">Normal</ToggleButton><ToggleButton value="Formal">Formal</ToggleButton><ToggleButton value="Casual">Casual</ToggleButton></ToggleButtonGroup>)} /></Grid>
            <Grid item xs={12} md={6}><FieldLabel required>Nome da Empresa</FieldLabel><Controller name="companyName" control={aiControl} rules={{ required: 'O nome da empresa é obrigatório.' }} render={({ field }) => (<TextField {...field} fullWidth error={!!aiErrors.companyName} helperText={aiErrors.companyName?.message} sx={formControlStyles} disabled={isGuestMode} />)} /></Grid>
            <Grid item xs={12} md={6}><FieldLabel required>Setor/Indústria</FieldLabel><Controller name="companyIndustry" control={aiControl} rules={{ required: 'O setor é obrigatório.' }} render={({ field }) => (<TextField {...field} fullWidth error={!!aiErrors.companyIndustry} helperText={aiErrors.companyIndustry?.message} sx={formControlStyles} disabled={isGuestMode} />)} /></Grid>
            <Grid item xs={12} md={6}><FieldLabel>Idioma</FieldLabel><Controller name="language" control={aiControl} render={({ field }) => (<FormControl fullWidth sx={formControlStyles}><Select {...field} variant="outlined" disabled={isGuestMode}><MenuItem value="Brazilian Portuguese">Português do Brasil</MenuItem><MenuItem value="English">Inglês</MenuItem><MenuItem value="Español">Espanhol</MenuItem></Select></FormControl>)} /></Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box id="tour-methodologies">
                <FieldLabel tooltip="Selecione a estratégia principal que a IA usará para qualificar os leads.">Metodologia de Qualificação</FieldLabel>
              </Box>
              <Controller
                name="salesMethodology"
                control={aiControl}
                render={({ field }) => (
                  <Grid container spacing={2.5} sx={{ mt: 1 }}>
                    {Object.entries(methodologiesInfo).map(([key, info]) => (
                      // --- INÍCIO DA CORREÇÃO ---
                      // Mudei sm={6} para sm={12} e lg={3} para lg={4}
                      // Agora os cards ocupam a tela inteira em 'xs' e 'sm'
                      <Grid item key={key} xs={12} sm={12} md={6} lg={4}>
                      {/* --- FIM DA CORREÇÃO --- */}
                        <MethodologyCard
                          methodologyKey={key}
                          info={info}
                          isSelected={field.value === key}
                          onSelect={() => {
                            if (isGuestMode) { openModal(); return; }
                            setValue('salesMethodology', key, { shouldValidate: true })
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 4 }}><FieldLabel required>Descreva o perfil deste agente (Prompt)</FieldLabel><Controller name="prompt" control={aiControl} rules={{ required: 'A descrição é obrigatória.' }} render={({ field }) => (<TextField {...field} fullWidth multiline rows={8} error={!!aiErrors.prompt} helperText={aiErrors.prompt?.message} sx={formControlStyles} disabled={isGuestMode} />)} /></Grid>
          </Grid>
        </Paper>
      </Fade>

      {/* --- SEÇÃO TWILIO ATUALIZADA --- */}
      <Fade in timeout={500}>
        <Paper id="tour-twilio-integration" variant="outlined" sx={paperStyles}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Box>
              <Typography variant="h6" gutterBottom>Integração de Telefonia (Twilio)</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Conecte sua conta Twilio para habilitar o envio de mensagens de voz e SMS.
              </Typography>
            </Box>
            <ShowcaseBlocker>
              {isTwilioConnected ? (
                <Chip icon={<CheckCircleIcon />} label="Conectado" color="success" variant="outlined" />
              ) : (
                <Chip icon={<ErrorIcon />} label="Não configurado" color="error" variant="outlined" />
              )}
            </ShowcaseBlocker>
          </Box>
          <ShowcaseBlocker>
            {/* --- BOTÕES ATUALIZADOS --- */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setIsTwilioModalOpen(true)}
              >
                {isTwilioConnected ? "Gerenciar Conexão" : "Configurar Twilio"}
              </Button>
              {/* --- NOVO BOTÃO DE DESCONECTAR --- */}
              {isTwilioConnected && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<LinkOffIcon />}
                  onClick={() => setIsDisconnectModalOpen(true)} // <-- ABRE O NOVO MODAL
                >
                  Desconectar
                </Button>
              )}
            </Box>
            {/* --- FIM DA ATUALIZAÇÃO --- */}
          </ShowcaseBlocker>
        </Paper>
      </Fade>
      {/* --- FIM DA SEÇÃO TWILIO --- */}


      <ShowcaseBlocker featureKey="VOICE_AI">
        <Fade in timeout={700}>
          <Paper id="tour-voice-interaction" variant="outlined" sx={paperStyles}>
            <Typography variant="h6" gutterBottom>Interação por Voz (WhatsApp)</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Permita que a IA envie e entenda mensagens de áudio.</Typography>
            <Controller name="enableVoiceInteraction" control={aiControl} render={({ field }) => (
              <FormControlLabel control={<Switch {...field} checked={field.value} disabled={isGuestMode} />} label="Habilitar interação por áudio" />
            )} />
            <Collapse in={watchEnableVoice}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                <Controller name="voiceModel" control={aiControl} render={({ field }) => (
                  <TextField {...field} select fullWidth label="Voz da IA" variant="outlined" sx={formControlStyles} disabled={isGuestMode}>
                    <MenuItem value="alloy">Alloy (Masculina)</MenuItem>
                    <MenuItem value="echo">Echo (Masculina)</MenuItem>
                    <MenuItem value="fable">Fable (Masculina)</MenuItem>
                    <MenuItem value="onyx">Onyx (Masculina)</MenuItem>
                    <MenuItem value="nova">Nova (Feminina)</MenuItem>
                    <MenuItem value="shimmer">Shimmer (Feminina)</MenuItem>
                  </TextField>
                )} />
                <Tooltip title="Ouvir amostra da voz">
                  <span>
                    <IconButton onClick={handlePlaySample} disabled={isSampleLoading || !selectedVoice} color="primary">
                      {isSampleLoading ? <CircularProgress size={24} /> : <PlayCircleOutlineIcon />}
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
            </Collapse>
          </Paper>
        </Fade>
      </ShowcaseBlocker>

      <Fade in timeout={900}>
        <Paper id="tour-qualification-criteria" variant="outlined" sx={paperStyles}>
          <Typography variant="h6" gutterBottom>Critérios de Qualificação</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Defina os critérios que a IA usará para classificar os leads.</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}><CriteriaFieldArray control={aiControl} name="hotCriteria" label="Lead QUENTE" status="hot" /></Grid>
            <Grid item xs={12} sm={6} md={4}><CriteriaFieldArray control={aiControl} name="warmCriteria" label="Lead MORNO" status="warm" /></Grid>
            <Grid item xs={12} sm={12} md={4}><CriteriaFieldArray control={aiControl} name="coldCriteria" label="Lead FRIO" status="cold" /></Grid>
          </Grid>
        </Paper>
      </Fade>

      <ShowcaseBlocker featureKey="FOLLOWUP_AI">
        <Fade in timeout={1100}>
          <Paper variant="outlined" sx={paperStyles}>
            <Typography variant="h6" gutterBottom>Follow-up Automático</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Envie mensagens de acompanhamento automaticamente se um lead não responder.</Typography>
            <Controller name="followupEnabled" control={aiControl} render={({ field }) => (<FormControlLabel control={<Switch {...field} checked={field.value} disabled={isGuestMode} />} label="Habilitar follow-up" />)} />
            <Collapse in={watchAiFollowup}>
              <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mt: 1 }}>
                <Grid item xs={12}><FieldLabel>Template de Follow-up</FieldLabel><Controller name="followupTemplate" control={aiControl} render={({ field }) => (<FormControl fullWidth sx={formControlStyles}><Select {...field} variant="outlined" displayEmpty disabled={followUpTemplatesLoading || isGuestMode}><MenuItem value=""><em>Nenhum</em></MenuItem>{approvedFollowUpTemplates?.map((template) => (<MenuItem key={template._id} value={template._id}>{template.name}</MenuItem>))}</Select></FormControl>)} /></Grid>
                <Grid item xs={12} sm={4}><FieldLabel>Período de espera</FieldLabel><Controller name="followupWaitPeriod" control={aiControl} render={({ field }) => (<TextField {...field} type="number" fullWidth variant="outlined" sx={formControlStyles} InputProps={{ inputProps: { min: 1 } }} disabled={isGuestMode} />)} /></Grid>
                <Grid item xs={12} sm={4}><FieldLabel>Unidade</FieldLabel><Controller name="followupWaitUnit" control={aiControl} render={({ field }) => (<FormControl fullWidth sx={formControlStyles}><Select {...field} variant="outlined" disabled={isGuestMode}><MenuItem value="hours">Horas</MenuItem><MenuItem value="days">Dias</MenuItem></Select></FormControl>)} /></Grid>

                {/* --- AQUI ESTÁ A LINHA CORRIGIDA --- */}
                <Grid item xs={12} sm={4}><FieldLabel>Máximo de tentativas</FieldLabel><Controller name="followupMaxAttempts" control={aiControl} render={({ field }) => (<TextField {...field} type="number" fullWidth variant="outlined" sx={formControlStyles} InputProps={{ inputProps: { min: 1 } }} disabled={isGuestMode} />)} /></Grid>
                {/* --- FIM DA CORREÇÃO --- */}

              </Grid>
            </Collapse>
          </Paper>
        </Fade>
      </ShowcaseBlocker>

      <Box id="tour-save-button" sx={{ mt: 4, mb: 2 }}>
        <GradientButton type="submit" loading={updateSettingsMutation.isLoading}>
          Salvar Configurações da IA
        </GradientButton>
      </Box>

      {/* --- RENDERIZA O MODAL DA TWILIO --- */}
      <TwilioConfigModal
        open={isTwilioModalOpen}
        onClose={() => setIsTwilioModalOpen(false)}
        config={twilioConfig}
      />

      {/* --- NOVO MODAL DE DESCONEXÃO --- */}
      <Dialog
        open={isDisconnectModalOpen}
        onClose={() => setIsDisconnectModalOpen(false)}
        PaperProps={{ sx: modalGlassStyle }} // Reutiliza o estilo de vidro
      >
        <DialogTitle fontWeight="bold">Confirmar Desconexão</DialogTitle>
        <DialogContent>
          <DialogContentText color="text.secondary">
            Você tem certeza que deseja desconectar sua conta da Twilio? Isso removerá suas credenciais e desabilitará as funções de voz e SMS.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: '16px 24px' }}>
          <Button onClick={() => setIsDisconnectModalOpen(false)} color="inherit" sx={{ color: 'text.secondary' }}>
            Cancelar
          </Button>
          <Button
            onClick={() => disconnectTwilioMutation.mutate()}
            color="error"
            variant="contained"
            disabled={disconnectTwilioMutation.isLoading}
          >
            {disconnectTwilioMutation.isLoading ? <CircularProgress size={24} color="inherit" /> : "Desconectar"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* --- FIM DO NOVO MODAL --- */}

    </Box>
  );
}