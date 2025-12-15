import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Button,
  Typography,
  Alert,
  Divider
} from '@mui/material';
import AnimatedBackground from 'components/layout/AnimatedBackground';
import LoginCarousel from 'components/login/LoginCarousel';
import ResetPasswordForm from '../../components/resetPassword/ResetPasswordForm';

export default function ResetPassword() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Token de redefinição inválido ou ausente. Por favor, solicite um novo link.');
    }
  }, [token]);

  const handleSuccess = () => {
    setSuccess(true);
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

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', p: { xs: 3, sm: 4, md: 6 } }}>
            {error && !success && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  background: 'rgba(211, 47, 47, 0.2)',
                  color: '#ffcdd2',
                }}
              >
                {error}
              </Alert>
            )}

            {success ? (
              <>
                <Typography variant="body1" sx={{ color: '#b39ddb', textAlign: 'center', mb: 3, fontWeight: 600 }}>
                  Sua senha foi redefinida com sucesso!
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate('/login')}
                  sx={{ color: '#b39ddb', textTransform: 'none', '&:hover': { color: 'white', background: 'transparent' }, background: 'transparent', boxShadow: 'none', border: 'none' }}
                >
                  Voltar para Login
                </Button>
              </>
            ) : (
              token ? (
                <ResetPasswordForm token={token} onSuccess={handleSuccess} />
              ) : null
            )}
        </Box>
      </Paper>
    </Box>
  );
}