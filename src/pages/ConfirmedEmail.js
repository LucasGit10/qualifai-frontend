import React, { useState, useEffect } from 'react';
import { Typography, Box, Container, CircularProgress, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api'; // ajuste o caminho conforme sua estrutura

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2, duration: 0.6, ease: "easeOut" } }
};

const iconDropIn = {
  hidden: { y: -100, opacity: 0, scale: 0.5 },
  visible: { y: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 250, damping: 20, delay: 0.2 } }
};

const EmailConfirmedPage = () => {
  const [countdown, setCountdown] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Token não fornecido.");
      setLoading(false);
      return;
    }

    api.get(`/auth/verify-email?token=${token}`)
      .then(res => {
        if (res.data.success) {
          setSuccess(true);
        } else {
          throw new Error(res.data.message || "Erro ao confirmar e-mail.");
        }
      })
      .catch(err => {
        setError(err.response?.data?.message || err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  useEffect(() => {
    if (success && countdown > 0) {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (success && countdown === 0) {
      window.location.href = '/login';
    }
  }, [success, countdown]);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8, background: '#1a153a' }}>
      <Container maxWidth="sm">
        <Box
          component={motion.div}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
            p: { xs: 3, sm: 5 }, borderRadius: 4, background: '#0f0c29', color: '#e2d6ff',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)', border: '1px solid rgba(226, 214, 255, 0.2)'
          }}
        >
          {loading && (
            <>
              <CircularProgress size={40} sx={{ color: '#d76d77', mb: 3 }} />
              <Typography>Confirmando seu e-mail...</Typography>
            </>
          )}

          {!loading && error && (
            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          )}

          {!loading && success && (
            <>
              <Box component={motion.div} variants={iconDropIn}>
                <CheckCircleOutlineIcon sx={{ fontSize: { xs: 70, sm: 80 }, color: '#d76d77', mb: 3 }} />
              </Box>
              <Typography component={motion.h3} variants={fadeInUp} sx={{ fontWeight: 700, mb: 2, color: '#f5dce0', fontSize: { xs: '2.5rem', sm: '3rem' } }}>
                E-mail Confirmado!
              </Typography>
              <Typography component={motion.p} variants={fadeInUp} sx={{ fontSize: '1.1rem', mb: 4, color: '#f5dce0', lineHeight: 1.7, maxWidth: '450px' }}>
                Sua conta foi ativada com sucesso. Agora você pode aproveitar todos os recursos da nossa plataforma.
              </Typography>
              <Box component={motion.div} variants={fadeInUp} sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <CircularProgress size={24} sx={{ color: '#d76d77', mb: 2 }} />
                <Typography sx={{ color: '#f5dce0' }}>
                  Redirecionando para o login em {countdown} segundos...
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default EmailConfirmedPage;
