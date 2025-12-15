import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box,
  Divider,
  Typography,
  Paper,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  useTheme,
  TextField,
  Grid,
  Chip,
  InputLabel,
  Pagination,
  InputAdornment,
  Button,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  IconButton,
  FormHelperText,
  alpha
} from '@mui/material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'react-toastify';
import {
  Shield as ShieldIcon,
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
  CreditCard as CreditCardIcon,
  Close as CloseIcon,
  ContentCopy as ContentCopyIcon,
  Visibility,
  VisibilityOff,
  Business as BusinessIcon,
  CalendarToday as CalendarTodayIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  WorkspacePremium as WorkspacePremiumIcon,
} from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import { useAuthStore } from '../../stores/authStore';
import api from '../../services/api';
// import { useTranslation } from 'react-i18next'; // <-- REMOVIDO

// --- STRINGS ESTÁTICAS DE TRADUÇÃO (MOCK) ---
// Note: Aqui estão apenas as chaves mais comuns usadas no componente.
const MOCK_T = {
    // ADMIN PAGE
    title: "Painel do Administrador",
    searchPlaceholder: "Buscar por nome, email...",
    
    // FILTROS
    filters: {
        plan: "Plano",
        allPlans: "Todos",
        guest: "Guest",
        basic: "Básico",
        pro: "Pro", // Plano Medium (Antigo)
        premium: "Premium", // Plano Pro (Antigo)
        role: "Função",
        allRoles: "Todas",
        admin: "Admin",
        manager: "Gerente",
        sales: "Vendas",
        status: "Status",
        allStatuses: "Todos",
        active: "Ativo",
        inactive: "Inativo"
    },
    
    // BOTÕES
    buttons: {
      createUser: "Criar Novo Usuário",
      generateCheckout: "Gerar Link de Checkout"
    },

    // USER CARD
    userCard: {
        active: "Ativo",
        inactive: "Inativo",
        memberSince: "Membro desde {{date}}",
        company: "Empresa",
        noCompany: "N/A",
        edit: "Editar",
        viewDetails: "Ver Detalhes"
    },

    // USER DETAILS
    userDetails: {
        title: "Detalhes do Usuário",
        userId: "ID do Usuário",
        status: "Status",
        plan: "Plano",
        role: "Função"
    },

    // CREATE USER FORM
    createUserForm: {
        titleNew: "Criar Novo Usuário",
        titleEdit: (name) => `Editando ${name}`,
        nameLabel: "Nome Completo",
        emailLabel: "Email",
        passwordLabel: "Senha",
        companyLabel: "Empresa (Opcional)",
        roleLabel: "Função",
        planLabel: "Plano Inicial",
        buttonCreate: "Criar Usuário",
        buttonCreating: "Criando...",
        buttonSave: "Salvar Alterações",
        buttonSaving: "Salvando...",
        passwordStrength: (score, hint) => `Força da senha: ${score}/5 - ${hint}`,
        validations: {
            nameRequired: "Nome é obrigatório",
            emailRequired: "Email é obrigatório",
            emailInvalid: "Email inválido",
            passwordRequired: "Senha deve atender a todos os critérios de segurança",
            initialHint: "Digite uma senha forte para o usuário",
            length: "Mínimo 8 caracteres",
            uppercase: "Adicione uma letra maiúscula",
            lowercase: "Adicione uma letra minúscula",
            number: "Adicione um número",
            specialChar: "Adicione um caractere especial (!@#$...)",
            strong: "Senha forte!"
        }
    },

    // CHECKOUT GENERATOR
    checkoutGenerator: {
        title: "Gerar Link de Checkout do Stripe",
        selectUser: "Selecionar Usuário",
        selectPlan: "Selecionar Plano",
        generateButton: "Gerar Link de Checkout",
        dialogTitle: "Link de Checkout Gerado",
        dialogAlert: "Link de checkout criado com sucesso! Envie este link para o usuário completar a assinatura.",
        dialogLinkFieldLabel: "Link de Checkout",
        copyButton: "Copiar Link",
        closeButton: "Fechar",
        plans: {
            basic_monthly: "Básico Mensal",
            pro_monthly: "Pro Mensal",
            premium_monthly: "Premium Mensal",
            basic_yearly: "Básico Anual",
            pro_yearly: "Pro Anual",
            premium_yearly: "Premium Anual"
        }
    },

    // TOASTS
    toasts: {
        userCreated: "Usuário criado com sucesso!",
        userCreateError: "Erro ao criar usuário",
        userUpdated: "Usuário atualizado com sucesso!",
        userUpdateError: "Erro ao atualizar usuário.",
        checkoutLinkGenerated: (message) => message,
        checkoutLinkError: "Erro ao gerar link de checkout",
        selectUserAndPlan: "Selecione um usuário e um plano",
        linkCopied: "Link copiado para a área de transferência!",
        copyLinkError: "Erro ao copiar link",
        idCopied: "ID copiado!"
    }
};

const fetchUsers = async () => {
  const { data } = await api.get('/admin/users');
  return data;
};

// ⚠️ MOCK: Não recebe 't', usa MOCK_T diretamente.
const validatePassword = (password) => {
  const t = (key) => key.split('.').reduce((obj, k) => obj[k] || MOCK_T, MOCK_T);
  const validations = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const score = Object.values(validations).reduce((acc, isValid) => acc + (isValid ? 1 : 0), 0);
  const isStrong = score === 5;
  const validationsKeys = MOCK_T.createUserForm.validations;

  let hint = '';
  if (!password) {
    hint = validationsKeys.initialHint;
  } else if (!validations.length) {
    hint = validationsKeys.length;
  } else if (!validations.uppercase) {
    hint = validationsKeys.uppercase;
  } else if (!validations.lowercase) {
    hint = validationsKeys.lowercase;
  } else if (!validations.number) {
    hint = validationsKeys.number;
  } else if (!validations.specialChar) {
    hint = validationsKeys.specialChar;
  } else {
    hint = validationsKeys.strong;
  }

  return { isStrong, hint, score };
};

// Componente para criar usuário
const CreateUserForm = ({ onSuccess, sx, initialData = null }) => {
  // ⚠️ MOCK: Remoção da chamada useTranslation
  const t = MOCK_T;
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
    role: 'sales',
    plan: 'guest'
  });
  // ⚠️ MOCK: Uso de strings estáticas
  const [passwordValidation, setPasswordValidation] = useState({ isStrong: false, hint: t.createUserForm.validations.initialHint, score: 0 });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const queryClient = useQueryClient();

  const isEditing = !!initialData;

  React.useEffect(() => {
    if (isEditing) {
      setFormData({ ...initialData, password: '' }); 
      // ⚠️ MOCK: Uso de strings estáticas
      setPasswordValidation(prev => ({ ...prev, hint: t.createUserForm.validations.initialHint }));
    }
  }, [initialData, isEditing]);

  const glassmorphismStyle = {
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.08)'
      : 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px)',
    border: theme.palette.mode === 'dark'
      ? `1px solid rgba(255, 255, 255, 0.2)`
      : `1px solid rgba(255, 255, 255, 0.3)`,
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '14px',
      backgroundColor: alpha(theme.palette.background.paper, 0.6),
      backdropFilter: 'blur(10px)',
      '& fieldset': {
        borderColor: alpha(theme.palette.divider, 0.3),
        borderWidth: '2px',
      },
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main,
        borderWidth: '2px',
      },
    },
    '& .MuiInputLabel-root': {
      color: theme.palette.text.secondary,
      fontWeight: 600,
    }
  };

  const createUserMutation = useMutation(
    (userData) => api.post('/admin/users', userData),
    {
      onSuccess: () => {
        // ⚠️ MOCK: Uso de strings estáticas
        toast.success(t.toasts.userCreated);
        setFormData({
          name: '',
          email: '',
          password: '',
          company: '',
          role: 'sales',
          plan: 'guest'
        });
        // ⚠️ MOCK: Uso de strings estáticas
        setPasswordValidation({ isStrong: false, hint: t.createUserForm.validations.initialHint, score: 0 });
        setErrors({});
        if (onSuccess) onSuccess();
      },
      onError: (error) => {
        // ⚠️ MOCK: Uso de strings estáticas
        toast.error(error.response?.data?.message || t.toasts.userCreateError);
        if (error.response?.data?.errors) {
          const newErrors = {};
          error.response.data.errors.forEach(err => {
            newErrors[err.path] = err.msg;
          });
          setErrors(newErrors);
        }
      },
    }
  );

  const updateUserMutation = useMutation(
    (userData) => api.put(`/admin/users/${initialData._id}`, userData),
    {
      onSuccess: () => {
        // ⚠️ MOCK: Uso de strings estáticas
        toast.success(t.toasts.userUpdated);
        queryClient.invalidateQueries('users');
        if (onSuccess) onSuccess();
      },
      onError: (error) => {
        // ⚠️ MOCK: Uso de strings estáticas
        toast.error(error.response?.data?.message || t.toasts.userUpdateError);
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validação local
    const newErrors = {};

    if (!formData.name.trim()) {
      // ⚠️ MOCK: Uso de strings estáticas
      newErrors.name = t.createUserForm.validations.nameRequired;
    }

    if (!formData.email.trim()) {
      // ⚠️ MOCK: Uso de strings estáticas
      newErrors.email = t.createUserForm.validations.emailRequired;
    } else if (!/^\S+@\S+$/i.test(formData.email)) {
      // ⚠️ MOCK: Uso de strings estáticas
      newErrors.email = t.createUserForm.validations.emailInvalid;
    }

    if (!isEditing && !passwordValidation.isStrong) {
      // ⚠️ MOCK: Uso de strings estáticas
      newErrors.password = t.createUserForm.validations.passwordRequired;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    if (isEditing) {
      updateUserMutation.mutate(formData);
    } else {
      createUserMutation.mutate(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validar senha em tempo real
    if (name === 'password') {
      // ⚠️ MOCK: Não passa 't'
      setPasswordValidation(validatePassword(value));
    }

    // Limpar erro do campo quando usuário digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Card sx={{ ...glassmorphismStyle, borderRadius: '20px', ...sx }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 800, color: 'text.primary' }}>
          {/* ⚠️ MOCK: Uso de strings estáticas */}
          {isEditing ? t.createUserForm.titleEdit(initialData.name) : t.createUserForm.titleNew}
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              {/* ⚠️ MOCK: Uso de strings estáticas */}
              <TextField fullWidth name="name" label={t.createUserForm.nameLabel} value={formData.name} onChange={handleChange} required error={!!errors.name} helperText={errors.name} sx={inputStyle} />
            </Grid>
            <Grid item xs={12} md={6}>
              {/* ⚠️ MOCK: Uso de strings estáticas */}
              <TextField fullWidth name="email" label={t.createUserForm.emailLabel} type="email" value={formData.email} onChange={handleChange} required error={!!errors.email} helperText={errors.email} sx={inputStyle} />
            </Grid>
            {!isEditing && (
              <Grid item xs={12} md={6}>
                {/* ⚠️ MOCK: Uso de strings estáticas */}
                <TextField fullWidth name="password" label={t.createUserForm.passwordLabel} type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} required error={!!errors.password} helperText={errors.password || passwordValidation.hint} sx={inputStyle} 
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowPassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {formData.password && (
                  <FormHelperText sx={{ 
                    color: passwordValidation.isStrong ? 'success.main' : 'text.secondary', 
                    fontWeight: passwordValidation.isStrong ? 'bold' : 'normal',
                    mt: 1
                  }}>
                    {/* ⚠️ MOCK: Uso de strings estáticas */}
                    {t.createUserForm.passwordStrength(passwordValidation.score, passwordValidation.hint)}
                  </FormHelperText>
                )}
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              {/* ⚠️ MOCK: Uso de strings estáticas */}
              <TextField fullWidth name="company" label={t.createUserForm.companyLabel} value={formData.company} onChange={handleChange} sx={inputStyle} />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={inputStyle}>
                {/* ⚠️ MOCK: Uso de strings estáticas */}
                <InputLabel>{t.createUserForm.roleLabel}</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  label={t.createUserForm.roleLabel}
                  sx={{ borderRadius: '14px' }}
                >
                  {/* ⚠️ MOCK: Uso de strings estáticas */}
                  <MenuItem value="sales">{t.filters.sales}</MenuItem>
                  <MenuItem value="manager">{t.filters.manager}</MenuItem>
                  <MenuItem value="admin">{t.filters.admin}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={inputStyle}>
                {/* ⚠️ MOCK: Uso de strings estáticas */}
                <InputLabel>{t.createUserForm.planLabel}</InputLabel>
                <Select
                  name="plan"
                  value={formData.plan}
                  onChange={handleChange}
                  label={t.createUserForm.planLabel}
                  sx={{ borderRadius: '14px' }}
                >
                  {/* ⚠️ MOCK: Uso de strings estáticas */}
                  <MenuItem value="guest">{t.filters.guest}</MenuItem>
                  <MenuItem value="basic">{t.filters.basic}</MenuItem>
                  <MenuItem value="medium">{t.filters.pro}</MenuItem>
                  <MenuItem value="pro">{t.filters.premium}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
      <CardActions sx={{ p: 3, pt: 0 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={createUserMutation.isLoading || updateUserMutation.isLoading || (!isEditing && !passwordValidation.isStrong)}
          startIcon={createUserMutation.isLoading || updateUserMutation.isLoading ? <CircularProgress size={16} /> : (isEditing ? <EditIcon /> : <PersonAddIcon />)}
          sx={{ 
            borderRadius: '14px',
            px: 4,
            py: 1.5,
            fontWeight: 700,
            background: theme.palette.custom?.gradients?.button || `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
            '&:hover': {
              background: theme.palette.custom?.gradients?.button || `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
              transform: 'translateY(-2px)',
              boxShadow: `0 12px 25px ${alpha(theme.palette.primary.main, 0.4)}`,
            }
          }}
        >
          {/* ⚠️ MOCK: Uso de strings estáticas */}
          {createUserMutation.isLoading || updateUserMutation.isLoading
            ? (isEditing ? t.createUserForm.buttonSaving : t.createUserForm.buttonCreating)
            : (isEditing ? t.createUserForm.buttonSave : t.createUserForm.buttonCreate)}
        </Button>
      </CardActions>
    </Card>
  );
};

const CheckoutLinkGenerator = ({ users, sx }) => {
  // ⚠️ MOCK: Remoção da chamada useTranslation
  const t = MOCK_T;
  const theme = useTheme();
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [showLinkDialog, setShowLinkDialog] = useState(false);

  const glassmorphismStyle = {
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.08)'
      : 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px)',
    border: theme.palette.mode === 'dark'
      ? `1px solid rgba(255, 255, 255, 0.2)`
      : `1px solid rgba(255, 255, 255, 0.3)`,
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '14px',
      backgroundColor: alpha(theme.palette.background.paper, 0.6),
      backdropFilter: 'blur(10px)',
      '& fieldset': {
        borderColor: alpha(theme.palette.divider, 0.3),
        borderWidth: '2px',
      },
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main,
        borderWidth: '2px',
      },
    },
    '& .MuiInputLabel-root': {
      color: theme.palette.text.secondary,
      fontWeight: 600,
    }
  };

  const generateLinkMutation = useMutation(
    ({ userId, planId }) => api.post('/admin/checkout-link', { userId, planId }),
    {
      onSuccess: (data) => {
        setGeneratedLink(data.data.checkoutUrl);
        setShowLinkDialog(true);
        // ⚠️ MOCK: Uso de strings estáticas
        toast.success(t.toasts.checkoutLinkGenerated(data.data.message));
      },
      onError: (error) => {
        // ⚠️ MOCK: Uso de strings estáticas
        toast.error(error.response?.data?.message || t.toasts.checkoutLinkError);
      },
    }
  );

  const handleGenerateLink = () => {
    if (!selectedUserId || !selectedPlan) {
      // ⚠️ MOCK: Uso de strings estáticas
      toast.error(t.toasts.selectUserAndPlan);
      return;
    }
    generateLinkMutation.mutate({ userId: selectedUserId, planId: selectedPlan });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      // ⚠️ MOCK: Uso de strings estáticas
      toast.success(t.toasts.linkCopied);
    } catch (err) {
      // ⚠️ MOCK: Uso de strings estáticas
      toast.error(t.toasts.copyLinkError);
    }
  };

  const plans = [
    // ⚠️ MOCK: Uso de strings estáticas
    { id: 'basic-monthly', name: t.checkoutGenerator.plans.basic_monthly },
    { id: 'pro-monthly', name: t.checkoutGenerator.plans.pro_monthly },
    { id: 'premium-monthly', name: t.checkoutGenerator.plans.premium_monthly },
    { id: 'basic-yearly', name: t.checkoutGenerator.plans.basic_yearly },
    { id: 'pro-yearly', name: t.checkoutGenerator.plans.pro_yearly },
    { id: 'premium-yearly', name: t.checkoutGenerator.plans.premium_yearly }
  ];

  return (
    <Card sx={{ ...glassmorphismStyle, borderRadius: '20px', ...sx }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 800, color: 'text.primary' }}>
          {/* ⚠️ MOCK: Uso de strings estáticas */}
          {t.checkoutGenerator.title}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth sx={inputStyle}>
              {/* ⚠️ MOCK: Uso de strings estáticas */}
              <InputLabel>{t.checkoutGenerator.selectUser}</InputLabel>
              <Select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                label={t.checkoutGenerator.selectUser}
                sx={{ borderRadius: '14px' }}
              >
                {users?.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth sx={inputStyle}>
              {/* ⚠️ MOCK: Uso de strings estáticas */}
              <InputLabel>{t.checkoutGenerator.selectPlan}</InputLabel>
              <Select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                label={t.checkoutGenerator.selectPlan}
                sx={{ borderRadius: '14px' }}
              >
                {plans.map((plan) => (
                  <MenuItem key={plan.id} value={plan.id}>
                    {plan.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions sx={{ p: 3, pt: 0 }}>
        <Button
          variant="contained"
          onClick={handleGenerateLink}
          disabled={generateLinkMutation.isLoading || !selectedUserId || !selectedPlan}
          startIcon={generateLinkMutation.isLoading ? <CircularProgress size={16} /> : <CreditCardIcon />}
          sx={{ 
            borderRadius: '14px',
            px: 4,
            py: 1.5,
            fontWeight: 700,
            background: theme.palette.custom?.gradients?.button || `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
            '&:hover': {
              background: theme.palette.custom?.gradients?.button || `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
              transform: 'translateY(-2px)',
              boxShadow: `0 12px 25px ${alpha(theme.palette.primary.main, 0.4)}`,
            }
          }}
        >
          {/* ⚠️ MOCK: Uso de strings estáticas */}
          {t.checkoutGenerator.generateButton}
        </Button>
      </CardActions>

      {/* Dialog para mostrar o link gerado */}
      <Dialog 
        open={showLinkDialog} 
        onClose={() => setShowLinkDialog(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            ...glassmorphismStyle,
            borderRadius: '20px',
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
        }}>
          {/* ⚠️ MOCK: Uso de strings estáticas */}
          {t.checkoutGenerator.dialogTitle}
          <IconButton
            onClick={() => setShowLinkDialog(false)}
            sx={{ 
              color: theme.palette.text.secondary,
              backgroundColor: alpha(theme.palette.text.primary, 0.05),
              borderRadius: '12px',
              '&:hover': {
                color: theme.palette.text.primary,
                backgroundColor: alpha(theme.palette.text.primary, 0.1),
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Alert severity="success" sx={{ mb: 2, borderRadius: '12px' }}>
            {/* ⚠️ MOCK: Uso de strings estáticas */}
            {t.checkoutGenerator.dialogAlert}
          </Alert>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={generatedLink}
            sx={inputStyle}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton 
                    onClick={copyToClipboard} 
                    edge="end"
                    sx={{
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.2),
                      }
                    }}
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            // ⚠️ MOCK: Uso de strings estáticas
            label={t.checkoutGenerator.dialogLinkFieldLabel}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={copyToClipboard} 
            startIcon={<ContentCopyIcon />}
            sx={{ 
              borderRadius: '12px',
              px: 3,
              fontWeight: 600,
            }}
          >
            {/* ⚠️ MOCK: Uso de strings estáticas */}
            {t.checkoutGenerator.copyButton}
          </Button>
          <Button 
            onClick={() => setShowLinkDialog(false)}
            sx={{ 
              borderRadius: '12px',
              px: 3,
              fontWeight: 600,
            }}
          >
            {/* ⚠️ MOCK: Uso de strings estáticas */}
            {t.checkoutGenerator.closeButton}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default function Admin() {
  // ⚠️ MOCK: Remoção da chamada useTranslation
  const t = MOCK_T;
  const queryClient = useQueryClient();
  const theme = useTheme();
  const { user: currentUser } = useAuthStore();
  const [filters, setFilters] = useState({
    text: '',
    plan: 'all',
    role: 'all',
    status: 'all',
  });
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [checkoutLinkOpen, setCheckoutLinkOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [page, setPage] = useState(1);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [selectedUserForDetails, setSelectedUserForDetails] = useState(null);

  const glassmorphismStyle = {
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.08)'
      : 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px)',
    border: theme.palette.mode === 'dark'
      ? `1px solid rgba(255, 255, 255, 0.2)`
      : `1px solid rgba(255, 255, 255, 0.3)`,
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '14px',
      backgroundColor: alpha(theme.palette.background.paper, 0.6),
      backdropFilter: 'blur(10px)',
      '& fieldset': {
        borderColor: alpha(theme.palette.divider, 0.3),
        borderWidth: '2px',
      },
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main,
        borderWidth: '2px',
      },
    },
    '& .MuiInputLabel-root': {
      color: theme.palette.text.secondary,
      fontWeight: 600,
    }
  };

  const { data: users, isLoading } = useQuery('users', fetchUsers, {
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  const updateUserMutation = useMutation(
    ({ userId, updates }) => api.put(`/admin/users/${userId}`, updates),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        // ⚠️ MOCK: Uso de strings estáticas
        toast.success(t.toasts.userUpdated);
      },
      onError: (error) => {
        // ⚠️ MOCK: Uso de strings estáticas
        toast.error(error.response?.data?.message || t.toasts.userUpdateError);
      },
    }
  );

  const handleUpdate = (userId, updates) => {
    updateUserMutation.mutate({ userId, updates });
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleUserCreated = () => {
    queryClient.invalidateQueries('users');
    setCreateUserOpen(false); 
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  const handleCloseEdit = () => setEditingUser(null);

  const handleViewDetails = (user) => {
    setSelectedUserForDetails(user);
    setDetailsDrawerOpen(true);
  };

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter(user => {
      const searchText = filters.text.toLowerCase();
      const textMatch = filters.text ?
        (user.name.toLowerCase().includes(searchText) ||
          user.email.toLowerCase().includes(searchText) ||
          user.company?.name?.toLowerCase().includes(searchText) ||
          user._id.toLowerCase().includes(searchText))
        : true;
      const planMatch = filters.plan === 'all' || (user.plan || 'guest') === filters.plan;
      const roleMatch = filters.role === 'all' || user.role === filters.role;
      const statusMatch = filters.status === 'all' || String(user.isActive) === filters.status;

      return textMatch && planMatch && roleMatch && statusMatch;
    });
  }, [users, filters]);

  const itemsPerPage = 8;
  const paginatedUsers = useMemo(() => {
    return filteredUsers.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  }, [filteredUsers, page]);

  return (
    <Box sx={{ 
      p: { xs: 2, sm: 3 },
      '@keyframes fadeInDown': {
        '0%': { opacity: 0, transform: 'translateY(-20px)' },
        '100%': { opacity: 1, transform: 'translateY(0)' },
      },
      '@keyframes fadeInLeft': {
        '0%': { opacity: 0, transform: 'translateX(-20px)' },
        '100%': { opacity: 1, transform: 'translateX(0)' },
      },
      '@keyframes fadeInUp': {
        '0%': { opacity: 0, transform: 'translateY(20px)' },
        '100%': { opacity: 1, transform: 'translateY(0)' },
      },
    }}>
      <Box 
        display="flex" 
        alignItems="center" 
        gap={2} 
        mb={3}
        sx={{
          animation: 'fadeInDown 0.5s ease-out forwards',
        }}
      >
        <Typography variant="h4" fontWeight="bold" sx={{
          background: theme.palette.custom?.gradients?.text || 'linear-gradient(45deg, #D8B4FE 30%, #8E24AA 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <ShieldIcon sx={{ fontSize: 'inherit' }} />
          {/* ⚠️ MOCK: Uso de strings estáticas */}
          {t.title}
        </Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4} lg={3}>
          <Paper
            sx={{
              ...glassmorphismStyle,
              borderRadius: '20px',
              p: 3,
              position: { md: 'sticky' },
              top: { md: '24px' },
              animation: 'fadeInLeft 0.6s ease-out forwards',
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="text"
                  // ⚠️ MOCK: Uso de strings estáticas
                  label={t.searchPlaceholder}
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={filters.text}
                  onChange={handleFilterChange}
                  sx={inputStyle}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth size="small" sx={inputStyle}>
                  {/* ⚠️ MOCK: Uso de strings estáticas */}
                  <InputLabel>{t.filters.plan}</InputLabel>
                  <Select
                    name="plan"
                    value={filters.plan}
                    onChange={handleFilterChange}
                    label={t.filters.plan}
                    sx={{ borderRadius: '14px' }}
                  >
                    {/* ⚠️ MOCK: Uso de strings estáticas */}
                    <MenuItem value="all">{t.filters.allPlans}</MenuItem>
                    <MenuItem value="guest">{t.filters.guest}</MenuItem>
                    <MenuItem value="basic">{t.filters.basic}</MenuItem>
                    <MenuItem value="medium">{t.filters.pro}</MenuItem>
                    <MenuItem value="pro">{t.filters.premium}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth size="small" sx={inputStyle}>
                  {/* ⚠️ MOCK: Uso de strings estáticas */}
                  <InputLabel>{t.filters.role}</InputLabel>
                  <Select
                    name="role"
                    value={filters.role}
                    onChange={handleFilterChange}
                    label={t.filters.role}
                    sx={{ borderRadius: '14px' }}
                  >
                    {/* ⚠️ MOCK: Uso de strings estáticas */}
                    <MenuItem value="all">{t.filters.allRoles}</MenuItem>
                    <MenuItem value="admin">{t.filters.admin}</MenuItem>
                    <MenuItem value="manager">{t.filters.manager}</MenuItem>
                    <MenuItem value="sales">{t.filters.sales}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth size="small" sx={inputStyle}>
                  {/* ⚠️ MOCK: Uso de strings estáticas */}
                  <InputLabel>{t.filters.status}</InputLabel>
                  <Select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    label={t.filters.status}
                    sx={{ borderRadius: '14px' }}
                  >
                    {/* ⚠️ MOCK: Uso de strings estáticas */}
                    <MenuItem value="all">{t.filters.allStatuses}</MenuItem>
                    <MenuItem value="true">{t.filters.active}</MenuItem>
                    <MenuItem value="false">{t.filters.inactive}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Box display="flex" flexDirection="column" gap={2}>
                  <Button
                    variant="contained"
                    startIcon={<PersonAddIcon />}
                    onClick={() => setCreateUserOpen(true)}
                    sx={{ 
                      borderRadius: '14px',
                      py: 1.5,
                      fontWeight: 700,
                      background: theme.palette.custom?.gradients?.button || `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                      boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                      '&:hover': {
                        background: theme.palette.custom?.gradients?.button || `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 12px 25px ${alpha(theme.palette.primary.main, 0.4)}`,
                      }
                    }}
                  >
                    {/* ⚠️ MOCK: Uso de strings estáticas */}
                    {t.buttons.createUser}
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<CreditCardIcon />}
                    onClick={() => setCheckoutLinkOpen(true)}
                    sx={{ 
                      borderRadius: '14px',
                      py: 1.5,
                      fontWeight: 700,
                      background: theme.palette.custom?.gradients?.button || `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.success.main} 100%)`,
                      boxShadow: `0 8px 20px ${alpha(theme.palette.info.main, 0.3)}`,
                      '&:hover': {
                        background: theme.palette.custom?.gradients?.button || `linear-gradient(135deg, ${theme.palette.info.dark} 0%, ${theme.palette.success.dark} 100%)`,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 12px 25px ${alpha(theme.palette.info.main, 0.4)}`,
                      }
                    }}
                  >
                    {/* ⚠️ MOCK: Uso de strings estáticas */}
                    {t.buttons.generateCheckout}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8} lg={9}>
          <Box sx={{ 
            maxWidth: { xs: 450, sm: '100%' }, 
            mx: { xs: 'auto', sm: 0 }
          }}>
            {isLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {paginatedUsers.map((user, index) => (
              <Grid 
                item 
                xs={12} sm={6} md={4} xl={3} 
                key={user._id}
                sx={{
                  animation: `fadeInUp 0.5s ease-out ${index * 100}ms forwards`,
                  opacity: 0, 
                }}
              >
                <Card sx={{ 
                  ...glassmorphismStyle, 
                  borderRadius: '20px',
                  height: '100%', 
                  minHeight: 290, 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 15px 40px rgba(0, 0, 0, 0.4)'
                      : '0 15px 40px rgba(0, 0, 0, 0.15)',
                  }
                }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="start">
                      <Box flexGrow={1} overflow="hidden" pr={1}>
                        <Typography variant="h6" fontWeight="bold" noWrap title={user.name}>
                          {user.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap title={user.email}>
                          {user.email}
                        </Typography>
                      </Box>
                      <Chip
                        // ⚠️ MOCK: Uso de strings estáticas
                        label={user.isActive ? t.userCard.active : t.userCard.inactive}
                        size="small"
                        color={user.isActive ? 'success' : 'error'}
                        sx={{
                          height: '20px',
                          fontSize: '0.7rem',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          mt: 0.5,
                        }}
                      />
                    </Box>
                    <Box mt={3} display="flex" flexDirection="column" gap={1.5}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <WorkspacePremiumIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                        <Chip
                          label={user.plan || 'guest'}
                          size="small"
                          variant="outlined"
                          sx={{ 
                            textTransform: 'capitalize', 
                            borderColor: 'primary.main', 
                            color: 'primary.light',
                            borderRadius: '8px'
                          }}
                        />
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <AdminPanelSettingsIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                        <Chip
                          label={user.role}
                          size="small"
                          variant="outlined"
                          sx={{ 
                            textTransform: 'capitalize', 
                            borderColor: 'secondary.main', 
                            color: 'secondary.light',
                            borderRadius: '8px'
                          }}
                        />
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <BusinessIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {/* ⚠️ MOCK: Uso de strings estáticas */}
                          {user.company?.name || t.userCard.noCompany}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <CalendarTodayIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {/* ⚠️ MOCK: O format() permanece o mesmo, mas a data é renderizada. */}
                          {format(new Date(user.createdAt), 'P', { locale: ptBR })}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="secondary"
                      startIcon={<EditIcon />}
                      onClick={() => handleEditUser(user)}
                      sx={{
                        borderRadius: '10px',
                        transition: 'transform 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                        },
                      }}
                    >
                      {/* ⚠️ MOCK: Uso de strings estáticas */}
                      {t.userCard.edit}
                    </Button>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => handleViewDetails(user)}
                      sx={{
                        borderRadius: '10px',
                        transition: 'transform 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        },
                      }}
                    >
                      {/* ⚠️ MOCK: Uso de strings estáticas */}
                      {t.userCard.viewDetails}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        {filteredUsers.length > itemsPerPage && (
              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                  count={Math.ceil(filteredUsers.length / itemsPerPage)}
                  page={page}
                  onChange={(event, value) => setPage(value)}
                  color="primary"
                  sx={{ 
                    '& .MuiPaginationItem-root': { 
                      color: theme.palette.text.primary,
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      },
                      '&.Mui-selected': {
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        fontWeight: 'bold',
                        '&:hover': {
                          backgroundColor: theme.palette.primary.dark,
                        }
                      },
                      '&.MuiPaginationItem-ellipsis': {
                        color: theme.palette.text.secondary,
                      }
                    },
                    '& .MuiPaginationItem-icon': {
                      color: theme.palette.primary.main,
                    }
                  }}
                />
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>

      <Dialog 
        open={createUserOpen} 
        onClose={() => setCreateUserOpen(false)} 
        maxWidth="md" 
        fullWidth 
        PaperProps={{ 
          sx: { 
            ...glassmorphismStyle,
            borderRadius: '20px',
          } 
        }}
      >
        <CreateUserForm 
          onSuccess={handleUserCreated} 
          sx={{ background: 'transparent', boxShadow: 'none' }} 
        />
      </Dialog>

      <Dialog 
        open={checkoutLinkOpen} 
        onClose={() => setCheckoutLinkOpen(false)} 
        maxWidth="md" 
        fullWidth 
        PaperProps={{ 
          sx: { 
            ...glassmorphismStyle,
            borderRadius: '20px',
          } 
        }}
      >
        <CheckoutLinkGenerator 
          users={users} 
          sx={{ background: 'transparent', boxShadow: 'none' }} 
        />
      </Dialog>

      <Dialog 
        open={!!editingUser} 
        onClose={handleCloseEdit} 
        maxWidth="md" 
        fullWidth 
        PaperProps={{ 
          sx: { 
            ...glassmorphismStyle,
            borderRadius: '20px',
          } 
        }}
      >
        <CreateUserForm onSuccess={handleCloseEdit} sx={{ background: 'transparent', boxShadow: 'none' }} initialData={editingUser} />
      </Dialog>

      <Dialog
        open={detailsDrawerOpen}
        onClose={() => setDetailsDrawerOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ 
          sx: { 
            ...glassmorphismStyle,
            borderRadius: '20px',
          } 
        }}
      >
        {selectedUserForDetails && (
          <>
            <DialogTitle sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            }}>
              {/* ⚠️ MOCK: Uso de strings estáticas */}
              <Typography variant="h5" fontWeight="bold">{t.userDetails.title}</Typography>
              <IconButton 
                onClick={() => setDetailsDrawerOpen(false)}
                sx={{
                  color: theme.palette.text.secondary,
                  backgroundColor: alpha(theme.palette.text.primary, 0.05),
                  borderRadius: '12px',
                  '&:hover': {
                    color: theme.palette.text.primary,
                    backgroundColor: alpha(theme.palette.text.primary, 0.1),
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ py: 3 }}>
              <Typography variant="h6" fontWeight="bold">{selectedUserForDetails.name}</Typography>
              <Typography gutterBottom color="text.secondary">{selectedUserForDetails.email}</Typography>

              <Box my={3}>
                {/* ⚠️ MOCK: Uso de strings estáticas */}
                <Typography variant="overline" color="text.secondary" display="block">{t.userDetails.userId}</Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography sx={{ wordBreak: 'break-all', opacity: 0.7 }}>{selectedUserForDetails._id}</Typography>
                  <IconButton 
                    size="small" 
                    onClick={async () => {
                      await navigator.clipboard.writeText(selectedUserForDetails._id);
                      // ⚠️ MOCK: Uso de strings estáticas
                      toast.success(t.toasts.idCopied);
                    }}
                    sx={{
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.2),
                      }
                    }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              <Divider sx={{ my: 2, borderColor: alpha(theme.palette.divider, 0.2) }} />

              <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={2} mt={2}>
                <Box display="flex" alignItems="center" gap={1.5}>
                  <WorkspacePremiumIcon color="primary" />
                  <Chip 
                    label={selectedUserForDetails.plan || 'guest'} 
                    variant="outlined" 
                    sx={{ 
                      textTransform: 'capitalize',
                      borderRadius: '8px'
                    }} 
                  />
                </Box>
                <Box display="flex" alignItems="center" gap={1.5}>
                  <AdminPanelSettingsIcon color="secondary" />
                  <Chip 
                    label={selectedUserForDetails.role} 
                    variant="outlined" 
                    sx={{ 
                      textTransform: 'capitalize',
                      borderRadius: '8px'
                    }} 
                  />
                </Box>
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Chip 
                    // ⚠️ MOCK: Uso de strings estáticas
                    label={selectedUserForDetails.isActive ? t.filters.active : t.filters.inactive} 
                    size="small" 
                    color={selectedUserForDetails.isActive ? 'success' : 'error'} 
                    sx={{ borderRadius: '6px' }}
                  />
                  {/* ⚠️ MOCK: Uso de strings estáticas */}
                  <Typography variant="body2">{t.filters.status}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1.5}>
                  <BusinessIcon sx={{ color: 'text.secondary' }} />
                  {/* ⚠️ MOCK: Uso de strings estáticas */}
                  <Typography variant="body2">{selectedUserForDetails.company?.name || t.userCard.noCompany}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1.5} gridColumn={{ sm: 'span 2' }}>
                  <CalendarTodayIcon sx={{ color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {/* ⚠️ MOCK: Uso de strings estáticas (com interpolação manual) */}
                    {t.userCard.memberSince.replace('{{date}}', format(new Date(selectedUserForDetails.createdAt), 'Pp', { locale: ptBR }))}
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
}