import React, { useState } from 'react';
import { Typography, Box, Container, Button, Link, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { MarkEmailRead, Close } from '@mui/icons-material';
import { fadeInUp } from '../components/AnimatedComponents';
import { useLocation } from 'react-router-dom';
import api from '../services/api'; // sua instância axios

const EmailConfirmationPage = () => {
  const location = useLocation();
  const emailFromState = location.state?.email || '';

  const [modalOpen, setModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState(emailFromState);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleOpenModal = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setEmailInput(emailFromState);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleResendEmail = async () => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const response = await api.post('/auth/resend-confirmation', { email: emailInput.trim() });
      setSuccessMsg(response.data.message || 'Email de confirmação reenviado com sucesso!');
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Erro ao reenviar o email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: 8,
        background: 'linear-gradient(to bottom, #0f0c29, #1a153a)',
      }}
    >
      <Container maxWidth="md">
        <Box
          component={motion.div}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          sx={{
            textAlign: 'center',
            backgroundColor: 'rgba(39, 34, 72, 0.8)',
            borderRadius: 4,
            p: 6,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(226, 214, 255, 0.2)',
          }}
        >
          <MarkEmailRead sx={{ fontSize: 80, color: '#d76d77', mb: 3 }} />

          <Typography variant="h3" sx={{ fontWeight: 700, mb: 3, color: '#e2d6ff' }}>
            Confirme seu e-mail
          </Typography>

          <Typography variant="body1" sx={{ fontSize: '1.1rem', mb: 4, color: '#e2d6ff', lineHeight: 1.6 }}>
            Enviamos um link de confirmação para <strong>{emailFromState || 'seu e-mail'}</strong>.
            Por favor, verifique sua caixa de entrada e clique no link para ativar sua conta.
          </Typography>

          <Typography variant="body2" sx={{ mb: 4, color: 'rgba(226, 214, 255, 0.7)', fontStyle: 'italic' }}>
            Não recebeu o e-mail? Verifique sua pasta de spam ou{' '}
            <Link
              href="#"
              onClick={handleOpenModal}
              sx={{
                ml: 1,
                color: '#d76d77',
                cursor: 'pointer',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              reenvie a confirmação
            </Link>.
          </Typography>

          <Button
            variant="contained"
            size="large"
            sx={{
              fontWeight: 700,
              borderRadius: 50,
              py: 1.5,
              px: 6,
              fontSize: '1rem',
              background: 'linear-gradient(135deg, #3a1c71 0%, #d76d77 100%)',
              color: '#fff',
              '&:hover': { background: 'linear-gradient(135deg, #3a1c71 0%, #d76d77 70%)' },
            }}
            onClick={() => window.open('https://mail.google.com', '_blank')}
          >
            Ir para minha caixa de entrada
          </Button>
        </Box>
      </Container>

      {/* Modal para reenvio de email */}
      <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ m: 0, p: 2, backgroundColor: '#271f59', color: '#d76d77' }}>
          Reenviar confirmação de email
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: '#d76d77',
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ backgroundColor: '#312a72' }}>
          <Typography sx={{ mb: 2, color: '#e2d6ff' }}>
            Digite o e-mail para o qual deseja reenviar o link de confirmação:
          </Typography>
          <TextField
            autoFocus
            fullWidth
            variant="filled"
            label="Seu e-mail"
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            sx={{
              backgroundColor: 'rgba(0,0,0,0.25)',
              borderRadius: 1,
              input: { color: '#e2d6ff' },
              '& .MuiInputLabel-root': { color: '#d76d77' },
            }}
          />
          {errorMsg && (
            <Alert severity="error" sx={{ mt: 2, bgcolor: 'rgba(255, 0, 0, 0.1)', color: '#ff6f6f' }}>
              {errorMsg}
            </Alert>
          )}
          {successMsg && (
            <Alert severity="success" sx={{ mt: 2, bgcolor: 'rgba(0, 255, 0, 0.1)', color: '#6fff6f' }}>
              {successMsg}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#271f59', p: 2 }}>
          <Button
            onClick={handleResendEmail}
            variant="contained"
            disabled={loading || !emailInput.trim()}
            sx={{
              background: 'linear-gradient(135deg, #3a1c71 0%, #d76d77 100%)',
              fontWeight: 700,
              '&:hover': { background: 'linear-gradient(135deg, #3a1c71 0%, #d76d77 70%)' },
            }}
          >
            {loading ? 'Enviando...' : 'Reenviar email'}
          </Button>
          <Button onClick={handleCloseModal} sx={{ color: '#d76d77' }}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmailConfirmationPage;
