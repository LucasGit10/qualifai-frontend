import React, { useState, useRef, useEffect } from 'react'; // <-- useRef e useEffect são essenciais
import { useNavigate } from 'react-router-dom';
import {
  Fab, Paper, Box, TextField, IconButton, Typography, Avatar, Fade,
  styled, useTheme, CircularProgress, Chip, Button
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon, 
  Send as SendIcon,
  VolumeUp as VolumeUpIcon,
  Stop as StopIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import api from '../services/api'; 

// --- Cores Temáticas da LP ---
const lpDarkPurple = '#1A0A3A';
const lpPink = '#DC3884';
const lpViolet = '#7356FC';
const lpGlassBorder = '1px solid rgba(255, 255, 255, 0.3)';
const lpGlassShadow = '0 8px 32px 0 rgba(31, 38, 135, 0.37)';
// ---

const ChatWindow = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  zIndex: 1300,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  background: 'linear-gradient(135deg, rgba(213, 204, 228, 0.15), rgba(172, 123, 212, 0.25))',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  boxShadow: lpGlassShadow,
  border: lpGlassBorder,
  borderRadius: '25px', 

  [theme.breakpoints.up('sm')]: {
    width: 420,
    height: 500,
    bottom: theme.spacing(12),
    right: theme.spacing(4),
  },
  [theme.breakpoints.down('sm')]: {
    width: 'calc(100% - 32px)',
    height: '70vh',
    maxHeight: '500px',
    bottom: theme.spacing(10),
    right: theme.spacing(2),
    left: theme.spacing(2),
  },
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: 'transparent', 
  color: lpDarkPurple, 
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: lpGlassBorder, 
}));

const MessageContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  backgroundColor: 'transparent',
}));

const MessageBubble = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'sender',
})(({ theme, sender }) => ({
  padding: '10px 14px',
  wordWrap: 'break-word',
  alignSelf: sender === 'bot' ? 'flex-start' : 'flex-end',
  backgroundColor: sender === 'bot' ? '#F5F0FA' : lpPink,
  color: sender === 'bot' ? lpDarkPurple : theme.palette.common.white,
  borderRadius: sender === 'bot' 
    ? '20px 20px 20px 5px' 
    : '20px 20px 5px 20px',
  boxShadow: theme.shadows[1], 
}));

const InputArea = styled('form')(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  display: 'flex',
  alignItems: 'center',
  borderTop: lpGlassBorder, 
  backgroundColor: 'transparent', 
}));

const SuggestionsContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    padding: theme.spacing(0, 2, 2, 2),
}));


const ChatBot = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  // --- 1. REFERÊNCIA PARA A JANELA DO CHAT ---
  const chatWindowRef = useRef(null); 
  
  const [audioSource, setAudioSource] = useState(null);
  const [playingMessageId, setPlayingMessageId] = useState(null);
  const [suggestions, setSuggestions] = useState(["Como funciona?", "Quais os planos?", "Posso testar?"]);

  useEffect(() => {
    if (open && messages.length === 0) {
        const initialMessage = { 
          id: Date.now(), 
          sender: 'bot', 
          content: "Olá! Sou a iara, SDR inteligente da QualifAI. Como posso ajudar a otimizar e escalar o seu negocio hoje?",
          showButton: false 
        };
        setMessages([initialMessage]);
    }
  }, [open, messages.length]); 

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // --- 2. LÓGICA PARA FECHAR AO CLICAR FORA ---
  useEffect(() => {
    // Função que verifica o clique
    function handleClickOutside(event) {
      if (chatWindowRef.current && !chatWindowRef.current.contains(event.target)) {
        // Se o clique foi fora do 'chatWindowRef', fecha o chat
        setOpen(false);
      }
    }
    
    // Adiciona o listener SÓ SE o chat estiver aberto
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Função de limpeza: remove o listener quando o chat fecha ou o componente "morre"
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]); // Esta lógica roda toda vez que 'open' muda

  const handleToggleChat = () => setOpen(!open);
  
  const handleSendMessage = async (e, messageContent) => {
    if(e) e.preventDefault();
    const content = messageContent || inputValue;
    if (content.trim() === '' || isTyping) return;

    const userMessage = { id: Date.now(), sender: 'user', content, showButton: false };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setSuggestions([]);
    setIsTyping(true);

    try {
      const conversationHistory = newMessages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'ai', 
        content: msg.content
      }));

      const response = await api.post('/landing-ai/', {
        conversation: conversationHistory,
      });

      if (response.data && response.data.reply) {
        const botMessage = { 
          id: Date.now() + 1, 
          sender: 'bot', 
          content: response.data.reply,
          showButton: response.data.showButton || false 
        };
        setMessages(prev => [...prev, botMessage]);
      }

    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = { 
        id: Date.now() + 1, 
        sender: 'bot', 
        content: 'Desculpe, não consegui processar sua mensagem. Tente novamente.',
        showButton: false
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };
  
  const handlePlayAudio = async (text, messageId) => {
      if (playingMessageId === messageId) {
          if (audioSource) {
              audioSource.pause();
          }
          setPlayingMessageId(null);
          return;
      }
      if (audioSource) {
          audioSource.pause();
      }
      setPlayingMessageId(messageId);

      try {
          const response = await api.post('/landing-ai/speak', 
            { text },
            { responseType: 'blob' } 
          );
          const audioBlob = response.data;
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          setAudioSource(audio);
          
          audio.play();
          audio.onended = () => setPlayingMessageId(null);
          
      } catch (error) {
          console.error("Error fetching TTS audio:", error);
          setPlayingMessageId(null);
      }
  };


  const BotAvatar = (
    <Avatar
      src="/avatarAI.png"
      alt="IA Qualif"
      sx={{ width: 32, height: 32 }}
    />
  );

  return (
    <>
      <Fab
        onClick={handleToggleChat}
        sx={{ 
          position: 'fixed', 
          bottom: 16, 
          right: 16, 
          zIndex: 1200, 
          width: 64, 
          height: 64, 
          p: 0, 
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(5px)',
          border: `2px solid ${lpPink}`, 
          '&:hover': { 
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            boxShadow: 'none' 
          } 
        }}
      >
        <Avatar src="/avatarAI.png" alt="Abrir chat" sx={{ width: 48, height: 48 }} />
      </Fab>

      <Fade in={open} unmountOnExit>
        {/* --- 3. ATRIBUINDO A REFERÊNCIA AQUI --- */}
        <ChatWindow ref={chatWindowRef}> 
          <ChatHeader>
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar src="/avatarAI.png" alt="Iara" sx={{ width: 54, height: 54 }} />
              <Box display="flex" flexDirection="column" sx={{ lineHeight: 1, mt: -0.3 }}>
                <Typography variant="h6" sx={{ mb: -0.5, fontWeight: 700 }}>iara</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8, color: lpDarkPurple }}>SDR Inteligente da QualifAI</Typography>
              </Box>
            </Box>
            <IconButton size="small" onClick={handleToggleChat} sx={{ color: lpDarkPurple }}><ExpandMoreIcon /></IconButton>
          </ChatHeader>

          <MessageContainer>
            {messages.map((msg) => (
              <Box key={msg.id} sx={{ display: 'flex', justifyContent: msg.sender === 'bot' ? 'flex-start' : 'flex-end', alignItems: 'flex-end', gap: 1 }}>
                
                {msg.sender === 'bot' && BotAvatar}
                
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'stretch',
                  maxWidth: '75%' 
                }}>
                  <MessageBubble sender={msg.sender} sx={{ alignSelf: msg.sender === 'bot' ? 'flex-start' : 'flex-end' }}>
                    <Typography variant="body2">{msg.content}</Typography>
                  </MessageBubble>

                  {msg.showButton && (
                    <Button 
                      variant="contained" 
                      onClick={() => navigate('/register-calendar')} 
                      endIcon={<ArrowForwardIcon />} 
                      sx={{ 
                        mt: 1,
                        width: '100%', 
                        backgroundColor: lpPink,
                        color: 'white',
                        borderRadius: '12px', 
                        textTransform: 'none',
                        fontWeight: 600,
                        padding: theme.spacing(1, 2),
                        boxShadow: `0 4px 14px 0 rgba(220, 56, 132, 0.35)`,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          backgroundColor: lpViolet,
                          transform: 'translateY(-2px)', 
                          boxShadow: `0 6px 20px 0 rgba(115, 86, 252, 0.3)`
                        }
                      }}
                    >
                      Agendar uma conversa
                    </Button>
                  )}
                </Box>
                
                {msg.sender === 'bot' && (
                  <IconButton 
                    size="small" 
                    onClick={() => handlePlayAudio(msg.content, msg.id)} 
                    disabled={playingMessageId && playingMessageId !== msg.id}
                    sx={{ color: lpDarkPurple, opacity: 0.7 }}
                  >
                    {playingMessageId === msg.id ? <StopIcon fontSize="small" /> : <VolumeUpIcon fontSize="small" />}
                  </IconButton>
                )}
              </Box>
            ))}
            {isTyping && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 1 }}>
                {BotAvatar}
                <MessageBubble sender="bot" component="div">
                  <CircularProgress size={20} sx={{ color: lpDarkPurple }} />
                </MessageBubble>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </MessageContainer>
          
          {suggestions.length > 0 && !isTyping && messages.length <= 1 && (
            <SuggestionsContainer>
                {suggestions.map((text, index) => (
                    <Chip 
                      key={index} 
                      label={text} 
                      variant="outlined" 
                      onClick={() => handleSendMessage(null, text)}
                      sx={{
                        borderColor: lpViolet,
                        color: lpDarkPurple,
                        fontWeight: 500,
                        backgroundColor: 'rgba(255, 255, 255, 0.4)',
                        backdropFilter: 'blur(4px)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        }
                      }}
                    />
                ))}
            </SuggestionsContainer>
          )}

          <InputArea onSubmit={handleSendMessage}>
            <TextField 
              fullWidth 
              variant="standard" 
              placeholder="Digite sua mensagem..." 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)} 
              autoComplete="off" 
              disabled={isTyping}
              sx={{
                '& .MuiInput-underline:before': { borderBottom: 'none' },
                '& .MuiInput-underline:after': { borderBottom: 'none' },
                '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                '& .MuiInputBase-input': {
                  color: lpDarkPurple,
                  '&::placeholder': {
                    color: lpDarkPurple, 
                    opacity: 0.6,
                  },
                },
              }}
            />
            <IconButton 
              type="submit" 
              disabled={!inputValue.trim() || isTyping}
              sx={{ 
                color: lpPink, 
                '&.Mui-disabled': {
                  color: theme.palette.action.disabled,
                }
              }}
            >
              <SendIcon />
            </IconButton>
          </InputArea>
        </ChatWindow>
      </Fade>
    </>
  );
};

export default ChatBot;