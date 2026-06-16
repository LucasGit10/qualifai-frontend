import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Grid,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Link,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  LinearProgress
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Person, Business, Email, Lock, Visibility, VisibilityOff, Badge, ArrowBack, Shield, VerifiedUser } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PolicyModal from '../components/TermsModal';
import TermsOfUseModal from '../components/UsesModal';
import { useAuthStore } from '../stores/authStore';

// ... (O início do componente, hooks e outras funções permanecem os mesmos)
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeInUp = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const PasswordFeedback = ({ hint, isStrong, score }) => {
    const strength = {
        0: { color: 'error' },
        1: { color: 'error' },
        2: { color: 'warning' },
        3: { color: 'warning' },
        4: { color: 'success' },
        5: { color: 'success' },
    };

    return (
        <Box sx={{ mt: 1.5, minHeight: '40px' }}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={hint}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                >
                    <LinearProgress
                        variant="determinate"
                        value={score * 20}
                        color={strength[score].color}
                        sx={{ height: 6, borderRadius: 2, mb: 1 }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                         {isStrong ? (
                            <VerifiedUser fontSize="small" sx={{ color: 'success.main', mr: 1 }} />
                        ) : (
                            <Shield fontSize="small" sx={{ color: '#e2b9bf', mr: 1 }} />
                        )}
                        <Typography variant="caption" sx={{ color: isStrong ? 'success.main' : '#e2b9bf' }}>
                            {hint}
                        </Typography>
                    </Box>
                </motion.div>
            </AnimatePresence>
        </Box>
    );
};

const RegisterPage = () => {
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [isUseModalOpen, setIsUseModalOpen] = useState(false);
  const [policyAgreed, setPolicyAgreed] = useState(false);
  const [useAgreed, setUseAgreed] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState({ password: false, confirmPassword: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({ name: '', companyName: '', document: '', email: '', password: '', confirmPassword: '' });
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [passwordHint, setPasswordHint] = useState('Sua senha é seu escudo. Crie uma bem forte!');
  const [isPasswordStrong, setIsPasswordStrong] = useState(false);
  const [passwordScore, setPasswordScore] = useState(0);

  const navigate = useNavigate();
  const { register: authRegister } = useAuthStore();

  useEffect(() => {
    const password = formData.password;
    const validations = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    const score = Object.values(validations).reduce((acc, isValid) => acc + (isValid ? 1 : 0), 0);
    setPasswordScore(score);
    const isStrong = score === 5;
    setIsPasswordStrong(isStrong);
    let hint = '';
    if (password.length === 0) {
      hint = 'Sua senha é seu escudo. Crie uma bem forte!';
    } else if (!validations.length) {
      hint = 'Continue... precisa ter pelo menos 8 caracteres.';
    } else if (!validations.uppercase) {
      hint = 'Ótimo! Agora adicione uma letra maiúscula.';
    } else if (!validations.lowercase) {
      hint = 'Quase lá. Insira também uma letra minúscula.';
    } else if (!validations.number) {
      hint = 'Excelente! Que tal um número para reforçar?';
    } else if (!validations.specialChar) {
      hint = 'Perfeito. Finalize com um caractere especial (!@#$).';
    } else {
      hint = 'Senha forte! Proteção máxima ativada.';
    }
    setPasswordHint(hint);
  }, [formData.password]);
  
  // ... O restante das funções (handleChange, etc.) continua o mesmo
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDocumentChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    let maskedValue = rawValue;
    if (rawValue.length <= 11) {
        maskedValue = rawValue.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').slice(0, 14);
    } else {
        maskedValue = rawValue.replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d{1,2})/, '$1-$2').slice(0, 18);
    }
    setFormData(prev => ({ ...prev, document: maskedValue }));
  };

  const handleClosePolicyModal = () => setIsPolicyModalOpen(false);
  const handleAgreeToPolicy = () => { setPolicyAgreed(true); handleClosePolicyModal(); };
  const handleCloseUseModal = () => setIsUseModalOpen(false);
  const handleAgreeToUse = () => { setUseAgreed(true); handleCloseUseModal(); };
  const handlePolicyToggle = (e) => { e.preventDefault(); if (policyAgreed) setPolicyAgreed(false); else setIsPolicyModalOpen(true); };
  const handleUseToggle = (e) => { e.preventDefault(); if (useAgreed) setUseAgreed(false); else setIsUseModalOpen(true); };
  
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isPasswordStrong) {
      setError("Sua senha deve atender a todos os critérios de segurança.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    if (!policyAgreed || !useAgreed) {
      setError("Você deve aceitar a Política de Privacidade e os Termos de Uso.");
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    const documentNumber = formData.document.replace(/\D/g, '');
    const payload = {
      name: formData.name, email: formData.email, password: formData.password,
      company: { name: formData.companyName },
      taxId: { type: documentNumber.length === 11 ? 'CPF' : 'CNPJ', number: documentNumber }
    };
    const result = await authRegister(payload);
    if (result.success) {
      setSuccess('Conta criada com sucesso! Redirecionando...');
      navigate('/app/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleClickShowPassword = (field) => { setPasswordVisibility(prev => ({ ...prev, [field]: !prev[field] })); };
  const handleMouseDownPassword = (event) => { event.preventDefault(); };

  const formFields = [
    { label: 'Seu Nome', icon: <Person/>, name: 'name' },
    { label: 'Nome da Empresa', icon: <Business/>, name: 'companyName' },
    { label: 'CPF ou CNPJ', icon: <Badge />, name: 'document', onChange: handleDocumentChange },
    { label: 'Seu Melhor Email', type: 'email', icon: <Email/>, name: 'email' },
    { label: 'Senha', type: 'password', icon: <Lock/>, grid: 6, name: 'password' },
    { label: 'Confirmar Senha', type: 'password', icon: <Lock/>, grid: 6, name: 'confirmPassword' }
  ];


  return (
    <Box sx={{ minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 2, md: 3 }, overflow: 'hidden', background: `linear-gradient(160deg, #0f0c29 0%, #302b63 100%)` }}>
      <Container maxWidth="xl">
        <Paper elevation={24} sx={{ background: 'rgba(30, 25, 60, 0.6)', backdropFilter: 'blur(20px)', border: '1px solid rgba(226, 214, 255, 0.15)', borderRadius: 8, color: 'white', overflow: 'hidden' }}>
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <Grid container>
              <Grid item xs={12} md={6} sx={{ p: { xs: 3, sm: 5, md: 7 }, position: 'relative', '&::after': { content: '""', display: { xs: 'none', md: 'block' }, position: 'absolute', top: '15%', right: 0, bottom: '15%', width: '1px', background: 'linear-gradient(to bottom, rgba(226, 214, 255, 0), rgba(226, 214, 255, 0.4) 50%, rgba(226, 214, 255, 0) 100%)' }}}>
                {/* ... (código do formulário) */}
                <motion.div variants={fadeInUp}>
                  <Button startIcon={<ArrowBack />} onClick={() => navigate('/')} sx={{ mb: 3, color: '#E2B9BF', textTransform: 'none', fontWeight: 'bold', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' } }}>
                    Voltar
                  </Button>
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <Typography variant="h3" component="h1" fontWeight={700} sx={{ color: '#FADAE2', '&::after': { content: '""', display: 'block', width: '80px', height: '4px', background: 'linear-gradient(135deg, #3a1c71 0%, #d76d77 100%)', marginTop: '16px', borderRadius: '2px' }}}>
                    Crie sua Conta
                  </Typography>
                </motion.div>
                <Box component="form" onSubmit={handleRegister} sx={{ mt: 4 }}>
                  <Grid container spacing={2.5}>
                     {formFields.map((field, index) => {
                      const isPasswordField = field.name === 'password' || field.name === 'confirmPassword';
                      return (
                        <Grid item xs={12} sm={field.grid || 12} key={index}>
                          <motion.div variants={fadeInUp}>
                            <TextField
                              fullWidth
                              required
                              name={field.name}
                              label={field.label}
                              value={formData[field.name]}
                              onChange={handleChange}
                              onFocus={() => field.name === 'password' && setIsPasswordFocused(true)}
                              onBlur={() => field.name === 'password' && setIsPasswordFocused(false)}
                              type={isPasswordField ? (passwordVisibility[field.name] ? 'text' : 'password') : field.type}
                              autoComplete={isPasswordField ? "new-password" : "off"}
                              variant="outlined"
                              InputProps={{
                                startAdornment: (<InputAdornment position="start">{React.cloneElement(field.icon, { sx: { color: 'rgba(255, 220, 230, 0.7)' } })}</InputAdornment>),
                                endAdornment: isPasswordField ? (
                                  <InputAdornment position="end"><IconButton onClick={() => handleClickShowPassword(field.name)} onMouseDown={handleMouseDownPassword} edge="end" sx={{ color: 'rgba(255, 220, 230, 0.7)' }}>{passwordVisibility[field.name] ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>
                                ) : null
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  backgroundColor: 'rgba(0, 0, 0, 0.25)', borderRadius: 3,
                                  '& fieldset': { borderColor: 'rgba(226, 214, 255, 0.2)' },
                                  '&:hover fieldset': { borderColor: 'rgba(255, 220, 230, 0.5)' },
                                  '&.Mui-focused fieldset': { borderColor: '#FFB5A7' },
                                },
                                '& .MuiInputLabel-root': { color: '#E2B9BF', '&.Mui-focused': { color: '#FFB5A7' }},
                                '& .MuiInputBase-input': {
                                  background: 'linear-gradient(90deg, #FCEFF3, #E0C3FC)',
                                  '-webkit-background-clip': 'text', backgroundClip: 'text', color: 'transparent',
                                  caretColor: '#E0C3FC',
                                },
                                '& .MuiInputBase-input:-webkit-autofill, & .MuiInputBase-input:-webkit-autofill:hover, & .MuiInputBase-input:-webkit-autofill:focus, & .MuiInputBase-input:-webkit-autofill:active': {
                                  '-webkit-box-shadow': '0 0 0 100px rgba(0, 0, 0, 0.25) inset',
                                  '-webkit-text-fill-color': 'transparent',
                                  background: 'linear-gradient(90deg, #FCEFF3, #E0C3FC) !important',
                                  '-webkit-background-clip': 'text !important', backgroundClip: 'text !important',
                                  caretColor: '#E0C3FC',
                                }
                              }}
                            />
                          </motion.div>
                          {field.name === 'password' && isPasswordFocused && (
                              <PasswordFeedback hint={passwordHint} isStrong={isPasswordStrong} score={passwordScore} />
                          )}
                        </Grid>
                      )
                    })}
                  </Grid>

                  <AnimatePresence>
                    {error && ( <motion.div><Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>{error}</Alert></motion.div> )}
                    {success && ( <motion.div><Alert severity="success" sx={{ mt: 2, borderRadius: 2 }}>{success}</Alert></motion.div> )}
                  </AnimatePresence>
                  
                  <motion.div variants={fadeInUp}>
                    <FormControlLabel onClick={handlePolicyToggle} control={<Checkbox checked={policyAgreed} sx={{color: 'rgba(255, 220, 230, 0.7)', '&.Mui-checked': {color: '#FFB5A7'}}} />}
                      label={<Typography variant="body2" sx={{color: '#E2B9BF'}}>Eu li e concordo com a <Box component="span" sx={{color: '#ff927cff', fontWeight: 'bold', textDecoration: 'underline'}}>Política de Privacidade</Box></Typography>}
                      sx={{mt: 2, cursor: 'pointer'}} />
                  </motion.div>
                  <motion.div variants={fadeInUp}>
                    <FormControlLabel onClick={handleUseToggle} control={<Checkbox checked={useAgreed} sx={{color: 'rgba(255, 220, 230, 0.7)', '&.Mui-checked': {color: '#FFB5A7'}}} />}
                      label={<Typography variant="body2" sx={{color: '#E2B9BF'}}>Eu li e concordo com os <Box component="span" sx={{color: '#ff927cff', fontWeight: 'bold', textDecoration: 'underline'}}>Termos de Uso</Box></Typography>}
                      sx={{mt: 1, mb: 3, cursor: 'pointer'}} />
                  </motion.div>
                  
                  <motion.div variants={fadeInUp}>
                    <Button type="submit" fullWidth variant="contained" size="large" disabled={!policyAgreed || !useAgreed || loading || !!success} sx={{ borderRadius: 50, px: 6, py: 1.5, fontSize: '1rem', fontWeight: 700, background: 'linear-gradient(135deg, #361c4bff 0%, #284158ff 100%)', boxShadow: '0 10px 20px rgba(139, 106, 143, 0.3)', color: '#fff', '&:hover': {transform: 'translateY(-3px)', boxShadow: '0 15px 30px rgba(147, 134, 172, 0.4)', background: 'linear-gradient(135deg, #361c4bff 0%, #284158ff 70%)'}, '&.Mui-disabled': {background: 'rgba(54, 28, 75, 0.5)', boxShadow: 'none', color: 'rgba(255, 255, 255, 0.4)'} }}>
                      {loading ? <CircularProgress size={24} color="inherit" /> : 'Criar Conta'}
                    </Button>
                  </motion.div>
                  <motion.div variants={fadeInUp}>
                    <Typography variant="body2" align="center" sx={{mt: 4, color: '#E2B9BF'}}>Já possui uma conta? <Link component="button" variant="body2" onClick={() => navigate('/login')} sx={{fontWeight: 'bold', color: '#ff927cff', cursor: 'pointer', textDecoration: 'underline', background: 'none', border: 'none', p: 0, fontFamily: 'inherit', fontSize: 'inherit', '&:hover': {color: '#fff'}}}>Entrar</Link></Typography>
                  </motion.div>
                </Box>
              </Grid>

              <Grid item xs={12} md={6} sx={{p: {xs: 3, md: 4}, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <motion.div variants={fadeInUp} style={{ width: '100%', maxWidth: 500 }}>
                  <Paper sx={{ minHeight: 520, p: { xs: 3, md: 5 }, borderRadius: 5, background: 'linear-gradient(135deg, rgba(58, 28, 113, 0.88) 0%, rgba(215, 109, 119, 0.82) 100%)', color: '#fff', boxShadow: '0 8px 40px rgba(0, 0, 0, 0.35)', border: '1px solid rgba(226, 214, 255, 0.25)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                      Comece sem escolher plano
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.88)', lineHeight: 1.8 }}>
                      Por enquanto o cadastro fica liberado sem etapa de assinatura. Depois que sua conta for criada, nossa equipe ativa os recursos combinados diretamente com a empresa.
                    </Typography>
                    <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                        O que acontece agora?
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.82)', lineHeight: 1.7 }}>
                        Crie a conta e acesse a plataforma. A parte de planos ficou desativada neste fluxo para manter o onboarding mais simples.
                      </Typography>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        </Paper>
      </Container>
      <PolicyModal open={isPolicyModalOpen} onClose={handleClosePolicyModal} onConfirm={handleAgreeToPolicy} />
      <TermsOfUseModal open={isUseModalOpen} onClose={handleCloseUseModal} onConfirm={handleAgreeToUse} />
    </Box>
  );
};

export default RegisterPage;
