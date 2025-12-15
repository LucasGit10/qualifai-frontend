import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Avatar,
  LinearProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
    LockReset as LockResetIcon,
    Shield,
    VerifiedUser,
    Visibility,
    VisibilityOff,
} from '@mui/icons-material';
import api from '../../services/api';

const PasswordFeedback = ({ hint, isStrong, score }) => {
    const strength = {
        0: { color: 'error' }, 1: { color: 'error' },
        2: { color: 'warning' }, 3: { color: 'warning' },
        4: { color: 'success' }, 5: { color: 'success' },
    };

    return (
        <Box sx={{ mt: 1.5, minHeight: '40px' }} component={motion.div}
            key={hint}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
        >
            <LinearProgress variant="determinate" value={score * 20} color={strength[score].color} sx={{ height: 6, borderRadius: 2, mb: 1 }} />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {isStrong ? <VerifiedUser fontSize="small" sx={{ color: 'success.main', mr: 1 }} /> : <Shield fontSize="small" sx={{ color: '#e2b9bf', mr: 1 }} />}
                <Typography variant="caption" sx={{ color: isStrong ? 'success.main' : '#e2b9bf' }}>{hint}</Typography>
            </Box>
        </Box>
    );
};

export default function ResetPasswordForm({ token, onSuccess }) {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [passwordHint, setPasswordHint] = useState('Sua senha é seu escudo. Crie uma bem forte!');
    const [isPasswordStrong, setIsPasswordStrong] = useState(false);
    const [passwordScore, setPasswordScore] = useState(0);
    const [showPassword, setShowPassword] = useState({ password: false, confirmPassword: false });

    const { register, handleSubmit, watch, formState: { errors } } = useForm({ mode: 'onTouched' });
    const passwordValue = watch('password');

    useEffect(() => {
        const password = passwordValue || '';
        const validations = {
            length: password.length >= 8, lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password), number: /\d/.test(password),
            specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        };
        const score = Object.values(validations).reduce((acc, isValid) => acc + (isValid ? 1 : 0), 0);
        setPasswordScore(score);
        const isStrong = score === 5;
        setIsPasswordStrong(isStrong);

        let hint = '';
        if (password.length === 0 && isPasswordFocused) hint = 'Sua senha é seu escudo. Crie uma bem forte!';
        else if (!validations.length) hint = 'Continue... precisa ter pelo menos 8 caracteres.';
        else if (!validations.uppercase) hint = 'Ótimo! Agora adicione uma letra maiúscula.';
        else if (!validations.lowercase) hint = 'Quase lá. Insira também uma letra minúscula.';
        else if (!validations.number) hint = 'Excelente! Que tal um número para reforçar?';
        else if (!validations.specialChar) hint = 'Perfeito. Finalize com um caractere especial (!@#$).';
        else hint = 'Senha forte! Proteção máxima ativada.';
        setPasswordHint(hint);
    }, [passwordValue, isPasswordFocused]);

    const handleClickShowPassword = (field) => setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
    const handleMouseDownPassword = (event) => event.preventDefault();

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');
        if (!isPasswordStrong) {
            setError("Sua senha deve atender a todos os critérios de segurança.");
            setLoading(false);
            return;
        }
        try {
            const response = await api.post('/auth/reset-password', { token, newPassword: data.password });
            if (response.status === 200) {
                onSuccess(); 
            } else {
                setError('Erro ao redefinir a senha. Tente novamente.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erro inesperado. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ width: 56, height: 56, mb: 2, borderRadius: 3, background: 'linear-gradient(135deg, #6A11CB 30%, #fc00daff 90%)' }}>
                    <LockResetIcon fontSize="medium" />
                </Avatar>
                <Typography component="h1" variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
                    Redefinir senha
                </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3, background: 'rgba(211, 47, 47, 0.2)', color: '#ffcdd2' }}>{error}</Alert>}

            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    margin="normal" required fullWidth label="Nova senha"
                    type={showPassword.password ? 'text' : 'password'}
                    autoComplete="new-password" error={!!errors.password}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton aria-label="toggle password visibility" onClick={() => handleClickShowPassword('password')} onMouseDown={handleMouseDownPassword} edge="end" sx={{ color: '#b39ddb' }}>
                                    {showPassword.password ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    sx={{ '& .MuiInputBase-root': { color: '#e2d6ff', borderRadius: '16px' }, '& .MuiInputLabel-root': { color: '#b39ddb' }, '& .Mui-focused .MuiInputLabel-root, & .MuiInputLabel-root.Mui-focused': { color: '#D76D77' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' }, '&:hover fieldset': { borderColor: '#D76D77' }, '&.Mui-focused fieldset': { borderColor: '#D76D77' }, }, }}
                    {...register('password', {
                        required: 'Senha é obrigatória',
                        minLength: { value: 8, message: 'A senha deve ter no mínimo 8 caracteres' },
                        validate: {
                            hasLowerCase: value => /[a-z]/.test(value) || 'Deve conter ao menos uma letra minúscula',
                            hasUpperCase: value => /[A-Z]/.test(value) || 'Deve conter ao menos uma letra maiúscula',
                            hasNumber: value => /\d/.test(value) || 'Deve conter ao menos um número',
                            hasSpecialChar: value => /[!@#$%^&*(),.?":{}|<>]/.test(value) || 'Deve conter ao menos um caractere especial (!@#$...)',
                        },
                    })}
                />

                {isPasswordFocused && <PasswordFeedback hint={passwordHint} isStrong={isPasswordStrong} score={passwordScore} />}

                <TextField
                    margin="normal" required fullWidth label="Confirme a nova senha"
                    type={showPassword.confirmPassword ? 'text' : 'password'}
                    autoComplete="new-password" error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton aria-label="toggle password visibility" onClick={() => handleClickShowPassword('confirmPassword')} onMouseDown={handleMouseDownPassword} edge="end" sx={{ color: '#b39ddb' }}>
                                    {showPassword.confirmPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    sx={{ '& .MuiInputBase-root': { color: '#e2d6ff', borderRadius: '16px' }, '& .MuiInputLabel-root': { color: '#b39ddb' }, '& .Mui-focused .MuiInputLabel-root, & .MuiInputLabel-root.Mui-focused': { color: '#D76D77' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' }, '&:hover fieldset': { borderColor: '#D76D77' }, '&.Mui-focused fieldset': { borderColor: '#D76D77' }, }, }}
                    {...register('confirmPassword', {
                        required: 'Confirmação é obrigatória',
                        validate: (value) => value === watch('password') || 'As senhas não conferem',
                    })}
                />

                <Button
                    type="submit" fullWidth variant="contained"
                    sx={{
                        mt: 3, mb: 2, py: 1.5, borderRadius: '16px',
                        fontWeight: 700,
                        background: 'linear-gradient(90deg, #6A11CB 0%, #fc00daff 100%)', boxShadow: '0 4px 20px rgba(215, 109, 119, 0.4)',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 25px rgba(215, 109, 119, 0.6)' },
                        '&:disabled': { background: 'rgba(58, 28, 113, 0.5)' },
                    }}
                    disabled={loading}
                >
                    {loading ? 'Redefinindo...' : 'Redefinir senha'}
                </Button>
            </form>
        </motion.div>
    );
}