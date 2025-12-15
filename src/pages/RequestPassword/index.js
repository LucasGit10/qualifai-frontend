import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Avatar,
} from '@mui/material';
import { EmailOutlined as EmailOutlinedIcon } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { useTranslation } from 'react-i18next';
import AnimatedBackground from 'components/layout/AnimatedBackground';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/request-password-reset', { email: data.email });

      if (response.status === 200) {
        setEmailSent(true);
      } else {
        setError(t('forgotPasswordPage.errors.sendFailed'));
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message); // Mantém o erro específico da API, se houver
      } else {
        setError(t('forgotPasswordPage.errors.unexpected'));
      }
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
          maxWidth: '480px',
          display: 'block',
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
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', p: { xs: 3, sm: 4, md: 6 } }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ bgcolor: 'transparent', color: 'white', background: 'linear-gradient(135deg, #3a1c71 0%, #d76d77 100%)', width: 56, height: 56, mb: 2 }}>
                <EmailOutlinedIcon fontSize="medium" />
              </Avatar>
              <Typography component="h2" variant="h5" sx={{ color: '#e2d6ff', fontWeight: 700, textAlign: 'center', background: 'linear-gradient(90deg, #e2d6ff, #d76d77)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {t('forgotPasswordPage.title')}
              </Typography>
            </Box>

              {emailSent ? (
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body1" sx={{ color: '#b39ddb', mb: 3, fontWeight: 600 }}>
                    {t('forgotPasswordPage.successMessage')}
                  </Typography>
                </Box>
              ) : (
                <>
                  {error && ( <Alert severity="error" sx={{ mb: 2, background: 'rgba(211, 47, 47, 0.2)', color: '#ffcdd2' }}>{error}</Alert> )}
                  <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                      margin="normal" required fullWidth label={t('forgotPasswordPage.emailLabel')}
                      type="email" autoComplete="email" autoFocus error={!!errors.email}
                      helperText={errors.email?.message}
                      sx={{ '& .MuiInputBase-root': { color: '#e2d6ff', borderRadius: '16px' }, '& .MuiInputLabel-root': { color: '#b39ddb' }, '& .Mui-focused .MuiInputLabel-root, & .MuiInputLabel-root.Mui-focused': { color: '#D76D77' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' }, '&:hover fieldset': { borderColor: '#D76D77' }, '&.Mui-focused fieldset': { borderColor: '#D76D77' }, }, }}
                      {...register('email', { required: t('forgotPasswordPage.validation.emailRequired'), pattern: { value: /^\S+@\S+$/i, message: t('forgotPasswordPage.validation.emailInvalid') } })}
                    />
                    <Button
                      type="submit" fullWidth variant="contained" disabled={loading}
                      sx={{ mt: 3, mb: 1, py: 1.5, borderRadius: '16px', fontWeight: 700, background: 'linear-gradient(90deg, #6A11CB 0%, #fc00daff 100%)', boxShadow: '0 4px 20px rgba(215, 109, 119, 0.4)', transition: 'all 0.3s ease-in-out', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 25px rgba(215, 109, 119, 0.6)' } }}
                    >
                      {loading ? t('forgotPasswordPage.loadingButton') : t('forgotPasswordPage.submitButton')}
                    </Button>
                  </Box>
                </>
              )}

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button variant="text" onClick={() => navigate('/login')} sx={{ color: '#b39ddb', textTransform: 'none', '&:hover': { color: 'white' } }}>
                  {t('forgotPasswordPage.backToLoginLink')}
                </Button>
              </Box>
          </motion.div>
        </Box>
      </Paper>
    </Box>
  );
}