import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Box, TextField, Button, Typography, Alert, Container, Avatar,
  InputAdornment, IconButton, GlobalStyles, CircularProgress, Chip,
} from '@mui/material';
import { 
    Visibility, VisibilityOff, Https as HttpsIcon, ArrowForward as ArrowForwardIcon,
    MailOutline as MailOutlineIcon, LockOutlined as LockOutlineIcon,
    BugReport as BugReportIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { USE_MOCKS } from 'config/env';

const autofillAnimationStyles = `
  @keyframes onAutoFillStart { from {} to {} }
  @keyframes onAutoFillCancel { from {} to {} }
`;

const AutofillGlobalStyles = () => (
  <GlobalStyles styles={autofillAnimationStyles} />
);

export default function LoginForm({ onSubmit, loading, error }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();
  
  const textFieldStyles = {
    '& .MuiInputBase-root': {
      borderRadius: '16px',
      color: '#e2d6ff',
    },
    '& input:-webkit-autofill': {
      animationName: 'onAutoFillStart',
      animationFillMode: 'both',
      transition: 'background-color 5000s ease-in-out 0s',
      WebkitTextFillColor: '#e2d6ff !important',
      boxShadow: 'none',
    },
    '& .MuiInputLabel-root': { color: '#b39ddb' },
    '& .Mui-focused .MuiInputLabel-root, & .MuiInputLabel-root.Mui-focused': { color: '#D76D77' },
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
      '&:hover fieldset': { borderColor: '#D76D77' },
      '&.Mui-focused fieldset': { borderColor: '#D76D77' },
    },
  };

  return (
    <>
      <AutofillGlobalStyles />
      <Box sx={{ width: { xs: '100%', md: '45%' }, display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
        <Container component="main" maxWidth="xs" sx={{ p: '0 !important' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }} style={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, cursor: 'pointer' }} onClick={() => navigate('/')}>
              <Box component="img" src="/Fundo transparente(1) 1.png" alt="Logo QualifAI" sx={{ width: '250px', height: 'auto', transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.05)' } }}/>
            </Box>

            {/* ── Banner modo mock ── */}
            {USE_MOCKS && (
              <Box sx={{
                mb: 3, p: 2, borderRadius: 2,
                background: 'rgba(99, 102, 241, 0.12)',
                border: '1px solid rgba(99, 102, 241, 0.35)',
                backdropFilter: 'blur(8px)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BugReportIcon sx={{ fontSize: 16, color: '#818cf8' }} />
                  <Typography variant="caption" sx={{ color: '#818cf8', fontWeight: 700, letterSpacing: 0.5 }}>
                    MODO DESENVOLVIMENTO (MOCK)
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={14} sx={{ color: '#6366f1' }} />
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Redirecionando automaticamente...
                  </Typography>
                </Box>
              </Box>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ width: 56, height: 56, mb: 2, borderRadius: 3, background: 'linear-gradient(135deg, #6A11CB 30%, #fc00daff 90%)' }}>
                <HttpsIcon sx={{ color: 'white' }}/>
              </Avatar>
              <Typography component="h1" variant="h5" sx={{ color: 'white', fontWeight: 600 }}>{t('loginPage.title')}</Typography>
            </Box>

            {error && (<Alert severity="error" sx={{ mb: 2, background: 'rgba(211, 47, 47, 0.2)', color: '#ffcdd2' }}>{error}</Alert>)}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <TextField 
                variant="outlined" margin="normal" required fullWidth size="small" label="Email" placeholder="Digite seu email" type="email" autoComplete="email"
                autoFocus onFocus={() => setEmailFocused(true)} onBlur={() => setEmailFocused(false)} error={!!errors.email} helperText={errors.email?.message} 
                InputProps={{ startAdornment: emailFocused ? (<InputAdornment position="start"><MailOutlineIcon sx={{ color: '#b39ddb', fontSize: '1.25rem' }} /></InputAdornment>) : null }} 
                {...register('email', { required: t('loginPage.validation.emailRequired'), pattern: { value: /^\S+@\S+$/i, message: t('loginPage.validation.emailInvalid') } })} 
                sx={textFieldStyles} 
              />
              <TextField 
                variant="outlined" margin="normal" required fullWidth size="small" label="Senha" placeholder="Digite sua senha" type={showPassword ? 'text' : 'password'} autoComplete="current-password"
                onFocus={() => setPasswordFocused(true)} onBlur={() => setPasswordFocused(false)} error={!!errors.password} helperText={errors.password?.message} 
                InputProps={{ startAdornment: passwordFocused ? (<InputAdornment position="start"><LockOutlineIcon sx={{ color: '#b39ddb', fontSize: '1.25rem' }} /></InputAdornment>) : null, endAdornment: (<InputAdornment position="end"><IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end" sx={{ color: '#b39ddb' }}>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>), }} 
                {...register('password', { required: t('loginPage.validation.passwordRequired') })} 
                sx={textFieldStyles}
              />
              <Button type="submit" fullWidth variant="contained" disabled={loading} endIcon={<ArrowForwardIcon />} sx={{ mt: 3, mb: 1, py: 1.5, borderRadius: '16px', fontWeight: 700, background: 'linear-gradient(90deg, #6A11CB 0%, #fc00daff 100%)', boxShadow: '0 4px 20px rgba(215, 109, 119, 0.4)', transition: 'all 0.3s ease-in-out', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 25px rgba(215, 109, 119, 0.6)' } }}>
                {loading ? t('loginPage.loadingButton') : t('loginPage.loginButton')}
              </Button>
            </Box>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button variant="text" onClick={() => navigate('/forgot-password')} sx={{ color: '#b39ddb', textTransform: 'none', '&:hover': { color: 'white' } }}>{t('loginPage.forgotPasswordLink')}</Button>
            </Box>
            <Box sx={{ mt: 5, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: 'grey.600', background: 'rgba(255, 255, 255, 0.05)', px: 2, py: 0.5, borderRadius: '50px' }}>
                © 2024 QualifAI. Todos os direitos reservados.
              </Typography>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </>
  );
}
