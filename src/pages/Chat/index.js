import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, Grid, Typography, Avatar, IconButton, TextField, 
  InputAdornment, Badge, Chip, Divider, Button, Paper 
} from '@mui/material';

// Ícones
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PhoneIcon from '@mui/icons-material/Phone';
import VideocamIcon from '@mui/icons-material/Videocam';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import DescriptionIcon from '@mui/icons-material/Description';
import BusinessIcon from '@mui/icons-material/Business';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const contacts = [
  { id: 1, name: 'TechLogistics S.A.', msg: 'Podemos agendar a demo?', time: '10:42', unread: 2, avatarColor: '#db2777', status: 'online' },
  { id: 2, name: 'Global Finserv', msg: 'Proposta aprovada pelo board.', time: 'Ontem', unread: 0, avatarColor: '#2563eb', status: 'offline' },
  { id: 3, name: 'AgroTech Solutions', msg: 'Obrigado pelo envio.', time: 'Segunda', unread: 0, avatarColor: '#10b981', status: 'online' },
  { id: 4, name: 'StartUp One', msg: 'Qual o valor da integração?', time: 'Segunda', unread: 0, avatarColor: '#f59e0b', status: 'busy' },
];

const initialMessages = [
  { id: 1, sender: 'them', text: 'Olá! Analisamos o portfólio de vocês.', time: '10:30' },
  { id: 2, sender: 'them', text: 'Gostaríamos de entender melhor como a API funciona para grandes volumes.', time: '10:31' },
  { id: 3, sender: 'me', text: 'Olá! Perfeito. Nossa API suporta até 50k req/s no plano Enterprise.', time: '10:35' },
  { id: 4, sender: 'me', text: 'Vou te enviar a documentação técnica.', time: '10:35', type: 'file', fileName: 'API_Docs_v2.pdf' },
  { id: 5, sender: 'them', text: 'Excelente. Podemos agendar a demo para mostrar ao CTO?', time: '10:42' },
];

const ChatMessage = ({ msg }) => {
  const isMe = msg.sender === 'me';
  
  return (
    <Box sx={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', mb: 2 }}>
      <Box sx={{ maxWidth: '70%' }}>
        <Paper sx={{ 
          p: 2, 
          borderRadius: isMe ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
          bgcolor: isMe ? '#4f46e5' : 'rgba(255,255,255,0.05)',
          color: 'white',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          border: isMe ? 'none' : '1px solid rgba(255,255,255,0.05)'
        }}>
          {msg.type === 'file' ? (
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ p: 1, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                <DescriptionIcon />
              </Box>
              <Box>
                <Typography variant="body2" fontWeight="bold">{msg.fileName}</Typography>
                <Typography variant="caption" color="rgba(255,255,255,0.6)">PDF • 2.4 MB</Typography>
              </Box>
            </Box>
          ) : (
            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>{msg.text}</Typography>
          )}
        </Paper>
        <Typography variant="caption" sx={{ 
          display: 'block', mt: 0.5, 
          textAlign: isMe ? 'right' : 'left', 
          color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' 
        }}>
          {msg.time}
        </Typography>
      </Box>
    </Box>
  );
};

export default function B2BChatPage() {
  const [activeChat, setActiveChat] = useState(contacts[0]);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: messages.length + 1,
      sender: 'me',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMsg]);
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ 
      height: '100vh', 
      bgcolor: '#0f172a',
      color: 'white',
      display: 'flex',
      overflow: 'hidden'
    }}>

      <Box sx={{ 
        width: 320, 
        borderRight: '1px solid rgba(255,255,255,0.08)',
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        bgcolor: 'rgba(15, 23, 42, 0.5)'
      }}>
        <Box p={3} pb={2}>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Avatar sx={{ bgcolor: '#4f46e5', width: 40, height: 40 }}>Eu</Avatar>
            <Typography variant="h6" fontWeight="bold">Mensagens</Typography>
          </Box>
          
          <TextField
            fullWidth
            placeholder="Buscar conversas..."
            size="small"
            sx={{ 
              '& .MuiOutlinedInput-root': { 
                bgcolor: 'rgba(255,255,255,0.03)', 
                borderRadius: '12px',
                color: 'white',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
              }
            }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'rgba(255,255,255,0.4)' }} /></InputAdornment>,
            }}
          />
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto', px: 2 }}>
          <Typography variant="caption" color="rgba(255,255,255,0.4)" sx={{ px: 1, mb: 1, display: 'block' }}>RECENTES</Typography>
          {contacts.map((contact) => (
            <Box 
              key={contact.id}
              onClick={() => setActiveChat(contact)}
              sx={{ 
                display: 'flex', alignItems: 'center', gap: 2, p: 1.5, mb: 0.5, borderRadius: '12px',
                cursor: 'pointer',
                bgcolor: activeChat.id === contact.id ? 'rgba(79, 70, 229, 0.15)' : 'transparent',
                border: activeChat.id === contact.id ? '1px solid rgba(79, 70, 229, 0.3)' : '1px solid transparent',
                transition: 'all 0.2s',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
              }}
            >
              <Badge 
                overlap="circular" 
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                sx={{ 
                  '& .MuiBadge-badge': { 
                    bgcolor: contact.status === 'online' ? '#10b981' : '#64748b',
                    boxShadow: '0 0 0 2px #0f172a'
                  } 
                }}
              >
                <Avatar sx={{ bgcolor: contact.avatarColor }}>{contact.name[0]}</Avatar>
              </Badge>
              <Box flex={1} overflow="hidden">
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="subtitle2" fontWeight="600" noWrap>{contact.name}</Typography>
                  <Typography variant="caption" color="rgba(255,255,255,0.4)">{contact.time}</Typography>
                </Box>
                <Typography variant="body2" color="rgba(255,255,255,0.5)" noWrap fontSize="0.8rem">
                  {contact.msg}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>

        <Box sx={{ 
          p: 2, borderBottom: '1px solid rgba(255,255,255,0.08)', 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          bgcolor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(12px)'
        }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: activeChat.avatarColor }}>{activeChat.name[0]}</Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">{activeChat.name}</Typography>
              <Typography variant="caption" color="#10b981" display="flex" alignItems="center" gap={0.5}>
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10b981' }} />
                Online Agora
              </Typography>
            </Box>
          </Box>
          <Box>
            <IconButton sx={{ color: 'rgba(255,255,255,0.6)' }}><PhoneIcon /></IconButton>
            <IconButton sx={{ color: 'rgba(255,255,255,0.6)' }}><VideocamIcon /></IconButton>
            <IconButton sx={{ color: 'rgba(255,255,255,0.6)' }}><MoreVertIcon /></IconButton>
          </Box>
        </Box>

        <Box sx={{ 
          flex: 1, p: 4, overflowY: 'auto', 
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(79, 70, 229, 0.05) 0%, transparent 50%)'
        }}>
          {messages.map((msg) => (
            <ChatMessage key={msg.id} msg={msg} />
          ))}
          <div ref={messagesEndRef} />
        </Box>

        <Box sx={{ p: 3, pt: 1 }}>
          <Paper sx={{ 
            p: '2px 4px', display: 'flex', alignItems: 'center', 
            borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <IconButton sx={{ p: '10px', color: 'rgba(255,255,255,0.4)' }}>
              <AttachFileIcon />
            </IconButton>
            <TextField
              sx={{ ml: 1, flex: 1, '& fieldset': { border: 'none' }, input: { color: 'white' } }}
              placeholder="Digite sua mensagem..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              multiline
              maxRows={3}
            />
            <IconButton sx={{ p: '10px', color: 'rgba(255,255,255,0.4)' }}>
              <InsertEmoticonIcon />
            </IconButton>
            <Divider sx={{ height: 28, m: 0.5, bgcolor: 'rgba(255,255,255,0.2)' }} orientation="vertical" />
            <IconButton 
              color="primary" 
              sx={{ p: '10px', color: '#818cf8' }} 
              onClick={handleSend}
            >
              <SendIcon />
            </IconButton>
          </Paper>
        </Box>
      </Box>

      <Box sx={{ 
        width: 300, 
        borderLeft: '1px solid rgba(255,255,255,0.08)',
        display: { xs: 'none', lg: 'flex' },
        flexDirection: 'column',
        bgcolor: 'rgba(15, 23, 42, 0.3)',
        p: 3
      }}>
        <Typography variant="overline" color="rgba(255,255,255,0.4)" fontWeight="bold" letterSpacing={1}>
          DETALHES DO NEGÓCIO
        </Typography>

        <Paper sx={{ 
          p: 2, mt: 2, borderRadius: '16px', 
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.2), rgba(124, 58, 237, 0.1))',
          border: '1px solid rgba(124, 58, 237, 0.3)'
        }}>
          <Typography variant="caption" color="rgba(255,255,255,0.6)">Valor Estimado</Typography>
          <Typography variant="h5" fontWeight="bold" color="white">R$ 45.000,00</Typography>
          <Chip 
            label="Em Negociação" 
            size="small" 
            sx={{ mt: 1, bgcolor: '#f59e0b', color: 'black', fontWeight: 'bold', fontSize: '0.7rem' }} 
          />
        </Paper>

        <Box mt={4}>
          <Typography variant="subtitle2" fontWeight="bold" mb={2}>Progresso</Typography>
          <Box position="relative" pl={2}>
            <Box sx={{ 
              position: 'absolute', left: 7, top: 5, bottom: 5, width: 2, 
              bgcolor: 'rgba(255,255,255,0.1)' 
            }} />
            
            {[
              { label: 'Contato Inicial', active: true },
              { label: 'Demo Agendada', active: true },
              { label: 'Proposta Enviada', active: false },
              { label: 'Contrato Assinado', active: false },
            ].map((step, index) => (
              <Box key={index} display="flex" alignItems="center" mb={2} position="relative">
                <Box sx={{ 
                  width: 16, height: 16, borderRadius: '50%', 
                  bgcolor: step.active ? '#10b981' : '#1e293b',
                  border: `2px solid ${step.active ? '#10b981' : 'rgba(255,255,255,0.2)'}`,
                  mr: 2, zIndex: 1
                }} />
                <Typography 
                  variant="body2" 
                  color={step.active ? 'white' : 'rgba(175, 148, 148, 0.4)'}
                  sx={{ textDecoration: step.active ? 'none' : 'none' }}
                >
                  {step.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box mt="auto">
          <Button 
            fullWidth variant="outlined" startIcon={<MonetizationOnIcon />}
            sx={{ 
              mb: 1, color: 'white', borderColor: 'rgba(255,255,255,0.2)', 
              '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)' } 
            }}
          >
            Criar Proposta
          </Button>
          <Button 
            fullWidth variant="contained" startIcon={<CheckCircleIcon />}
            sx={{ bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' } }}
          >
            Finalizar Negócio
          </Button>
        </Box>

      </Box>
    </Box>
  );
}