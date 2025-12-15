import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Alert,
  useTheme,
  alpha
} from '@mui/material';
import {
  Warning as WarningIcon,
  ContactMail as ContactMailIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const PlanNotification = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleContact = () => {
    navigate('/');
    setTimeout(() => {
      const agendamentoSection = document.getElementById('agendamento');
      if (agendamentoSection) {
        agendamentoSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, #0f0c29 0%, #24243e 50%, #402B58 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <Paper
            elevation={10}
            sx={{
              p: 4,
              borderRadius: 4,
              background: alpha(theme.palette.background.paper, 0.9),
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              textAlign: 'center'
            }}
          >
            <Box sx={{ mb: 3 }}>
              <WarningIcon 
                sx={{ 
                  fontSize: 64, 
                  color: theme.palette.warning.main,
                  mb: 2
                }} 
              />
              
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ 
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  mb: 2
                }}
              >
                Plano Inativo
              </Typography>
              
              <Typography 
                variant="h6" 
                sx={{ 
                  color: theme.palette.text.secondary,
                  mb: 3,
                  lineHeight: 1.6
                }}
              >
                Você não possui um plano ativo no momento
              </Typography>
            </Box>

            <Alert 
              severity="info" 
              sx={{ 
                mb: 3,
                textAlign: 'left',
                borderRadius: 2
              }}
            >
              <Typography variant="body2">
                Para acessar os recursos da plataforma QualifAI, você precisa de um plano ativo. 
                Entre em contato conosco para ativar seu plano ou conhecer nossas opções.
              </Typography>
            </Alert>

            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={handleBackToHome}
                sx={{ 
                  flex: 1,
                  borderRadius: 2,
                  py: 1.5
                }}
              >
                Voltar ao Início
              </Button>
              
              <Button
                variant="contained"
                startIcon={<ContactMailIcon />}
                onClick={handleContact}
                sx={{ 
                  flex: 1,
                  borderRadius: 2,
                  py: 1.5,
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #3a1c71 0%, #d76d77 100%)'
                    : theme.palette.primary.main,
                  '&:hover': {
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #3a1c71 0%, #d76d77 70%)'
                      : theme.palette.primary.dark,
                  }
                }}
              >
                Entre em Contato
              </Button>
            </Box>

            <Typography 
              variant="body2" 
              sx={{ 
                mt: 3,
                color: theme.palette.text.secondary,
                fontStyle: 'italic'
              }}
            >
              Precisa de ajuda? Entre em contato com nosso suporte.
            </Typography>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default PlanNotification;