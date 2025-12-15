import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Paper, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from 'stores/authStore';

import AnimatedBackground from 'components/layout/AnimatedBackground';
import LoginCarousel from 'components/login/LoginCarousel';
import LoginForm from 'components/login/LoginForm';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || "/app/dashboard";

  const handleLoginSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      const result = await login(data.email, data.password);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.error || t('loginPage.errors.unexpected'));
      }
    } catch (err) {
      setError(t('loginPage.errors.unexpected'));
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
        justifyContent: 'center',
        p: 2,
      }}
    >
      <AnimatedBackground />

      <Paper
        elevation={12}
        sx={{
          width: '100%',
          maxWidth: '1100px',
          minHeight: '600px',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          borderRadius: 6,
          position: 'relative',
          zIndex: 2,
          background: 'rgba(15, 11, 42, 0.65)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(25px) saturate(180%)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), 0 0 15px rgba(106, 17, 171, 0.3)',
          overflow: 'hidden',
        }}
      >
        <LoginCarousel />

        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', height: '85%', alignSelf: 'center' }} />
        </Box>
        
        <LoginForm 
          onSubmit={handleLoginSubmit}
          loading={loading}
          error={error}
        />
      </Paper>
    </Box>
  );
}
