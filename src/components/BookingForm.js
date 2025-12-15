import React, { useState } from 'react';
import PolicyModal from './TermsModal';
import {
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  IconButton,
  Divider,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  FormControlLabel,
  Checkbox,
  Link,
  useTheme
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import { IMaskInput } from 'react-imask';
import { useTranslation, Trans } from 'react-i18next';

// Mapeia os códigos de idioma do i18next para os objetos de locale do date-fns
const locales = {
  pt: ptBR,
  en: enUS,
};

// Estilo de máscara de telefone
const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="(#0) 00000-0000"
      definitions={{ '#': /[1-9]/ }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

// Dados de países
const countryData = [
  { code: '+55', label: 'Brasil', flag: '🇧🇷' },
  { code: '+1', label: 'EUA', flag: '🇺🇸' },
  { code: '+351', label: 'Portugal', flag: '🇵🇹' },
  { code: '+54', label: 'Argentina', flag: '🇦🇷' },
  { code: '+44', label: 'Reino Unido', flag: '🇬🇧' },
];

// Lista de horários disponíveis para o seletor
const availableTimes = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30',
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  },
};

const BookingForm = ({
  selectedDate,
  formData,
  handleInputChange,
  handleSubmit,
  handleBackToCalendar,
  isEmbedded = false,
}) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentLocale = locales[i18n.language] || ptBR;

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleConfirmPolicy = () => {
    handleInputChange({
      target: { name: 'agreedToPolicy', type: 'checkbox', checked: true },
    });
    handleCloseModal();
  };

  const fieldStyle = {
    '& .MuiInputLabel-root': {
      color: '#48287D',
      fontWeight: 500,
    },
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#F6F4FF',
      borderRadius: '8px',
      transition: 'background-color 0.3s ease, border-color 0.3s ease',
      '& .MuiOutlinedInput-input': {
        color: '#1A0A3A',
      },
      '& .MuiSelect-select': {
        color: '#1A0A3A',
      },
      '& .MuiSelect-icon': {
        color: '#48287D',
      },
      '& fieldset': {
        borderColor: 'rgba(0, 0, 0, 0.1)',
      },
      '&:hover fieldset': {
        borderColor: '#7356FC',
      },
      '&.Mui-focused': {
        backgroundColor: '#FFFFFF',
        '& fieldset': {
          borderColor: '#7356FC',
        },
      },
    },
    '& label.Mui-focused': {
      color: '#48287D',
    },
  };

  const menuPropsStyle = {
    PaperProps: {
      style: {
        backgroundColor: '#F6F4FF',
        borderRadius: '8px',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
      },
    },
  };

  const menuItemStyle = {
    color: '#1A0A3A',
    '&:hover': {
      backgroundColor: '#EAE6FF',
    },
    '&.Mui-selected': {
      backgroundColor: '#7356FC',
      color: 'white',
      fontWeight: 600,
      '&:hover': {
        backgroundColor: '#5a42d4',
      },
    },
  };

  const checkboxStyle = {
    color: '#48287D',
    '&.Mui-checked': {
      color: '#7356FC',
    },
  };

  const checkboxLabelStyle = {
    color: '#48287D',
    fontSize: '0.9rem',
  };

  if (isEmbedded) {
    return (
      <Box
        component={motion.div}
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={containerVariants}
        sx={{
          maxWidth: '400px',
          mx: 'auto',
          px: { xs: 2, sm: 3 },
          py: { xs: 3, sm: 4 },
          borderRadius: 3,
          background: '#FFFFFF',
          boxShadow: '0 8px 32px rgba(255, 255, 255, 1)',
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <motion.div variants={itemVariants}>
              <FormControl fullWidth required sx={fieldStyle}>
                <InputLabel>{t('contactSection.form.labels.time')}</InputLabel>
                <Select
                  name="time"
                  value={formData.time}
                  label={t('contactSection.form.labels.time')}
                  onChange={handleInputChange}
                  MenuProps={menuPropsStyle}
                >
                  {availableTimes.map(time => (
                    <MenuItem key={time} value={time} sx={menuItemStyle}>
                      {time}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </motion.div>
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                fullWidth
                size="large"
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  py: { xs: 1.5, sm: 2 },
                  borderRadius: 3,
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  fontWeight: 600,
                  color: '#fff',
                  background: '#FF4081',
                  boxShadow: '0 4px 15px rgba(58, 28, 113, 0.4)',
                  '&:hover': {
                    background: '#E0005F',
                    boxShadow: '0 6px 20px rgba(58, 28, 113, 0.6)',
                  },
                }}
              >
                {t('contactSection.form.buttons.schedule')}
              </Button>
            </motion.div>
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <>
      <Box
        component={motion.div}
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={containerVariants}
        sx={{
          maxWidth: '600px',
          mx: 'auto',
          px: { xs: 2, sm: 4 },
          py: { xs: 3, sm: 4 },
          borderRadius: 3,
          background: '#FFFFFF',
          boxShadow: '0 8px 32px rgba(255, 255, 255, 1)',
        }}
      >
        <Box sx={{ mb: { xs: 3, sm: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <motion.div variants={itemVariants}>
              <IconButton
                onClick={handleBackToCalendar}
                sx={{
                  mr: 1,
                  color: '#48287D',
                  padding: { xs: '6px', sm: undefined },
                  '&:hover': {
                    color: '#7356FC',
                    backgroundColor: 'rgba(115, 86, 252, 0.1)'
                  }
                }}
                component={motion.div}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                size="medium"
              >
                <ArrowBack fontSize="medium" />
              </IconButton>
            </motion.div>
            <motion.div variants={itemVariants} style={{ minWidth: 0 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: '#1A0A3A',
                  fontSize: { xs: '1.5rem', sm: '2.125rem' },
                  whiteSpace: { xs: 'nowrap', sm: 'normal' },
                  overflow: { xs: 'hidden', sm: 'visible' },
                  textOverflow: { xs: 'ellipsis', sm: 'clip' },
                }}
              >
                {t('contactSection.form.title')}
              </Typography>
            </motion.div>
          </Box>

          <motion.div variants={itemVariants}>
            <Typography
              variant="h6"
              sx={{
                color: '#48287D',
                mb: 1,
                fontSize: { xs: '1rem', sm: '1.25rem' },
              }}
            >
              {selectedDate && format(selectedDate, 'PPPP', { locale: currentLocale })}
            </Typography>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Divider sx={{
              my: 2,
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #7356FC, transparent)'
            }} />
          </motion.div>
        </Box>

        <Grid container spacing={{ xs: 2.5, sm: 3 }}>
          <Grid item xs={12}>
            <motion.div variants={itemVariants}>
              <TextField
                fullWidth
                name="fullName"
                label={t('contactSection.form.labels.fullName')}
                variant="outlined"
                required
                value={formData.fullName}
                onChange={handleInputChange}
                sx={fieldStyle}
              />
            </motion.div>
          </Grid>
          <Grid item xs={12}>
            <motion.div variants={itemVariants}>
              <TextField
                fullWidth
                name="email"
                label={t('contactSection.form.labels.workEmail')}
                type="email"
                variant="outlined"
                required
                value={formData.email}
                onChange={handleInputChange}
                sx={fieldStyle}
              />
            </motion.div>
          </Grid>
          <Grid item xs={12}>
            <motion.div variants={itemVariants}>
              <Grid container spacing={1}>
                <Grid item xs={4} sm={3} md={4}>
                  <FormControl fullWidth sx={fieldStyle}>
                    <InputLabel>{t('contactSection.form.labels.countryCode')}</InputLabel>
                    <Select
                      name="countryCode"
                      label={t('contactSection.form.labels.countryCode')}
                      value={formData.countryCode}
                      onChange={handleInputChange}
                      MenuProps={menuPropsStyle}
                      sx={{ '& .MuiSelect-select': { display: 'flex', alignItems: 'center' } }}
                    >
                      {countryData.map(country => (
                        <MenuItem key={country.label} value={country.code} sx={menuItemStyle}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography sx={{ mr: 1, mt: 0.5 }}>{country.flag}</Typography>
                            <Typography variant="body2">{country.code}</Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={8} sm={9} md={8}>
                  <TextField
                    name="phoneNumber"
                    label={t('contactSection.form.labels.phone')}
                    variant="outlined"
                    fullWidth
                    required
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    sx={fieldStyle}
                    InputProps={{ inputComponent: TextMaskCustom }}
                  />
                </Grid>
              </Grid>
            </motion.div>
          </Grid>
          <Grid item xs={12}>
            <motion.div variants={itemVariants}>
              <TextField
                fullWidth
                name="company"
                label={t('contactSection.form.labels.company')}
                variant="outlined"
                required
                value={formData.company}
                onChange={handleInputChange}
                sx={fieldStyle}
              />
            </motion.div>
          </Grid>
          <Grid item xs={12}>
            <motion.div variants={itemVariants}>
              <FormControl fullWidth required sx={fieldStyle}>
                <InputLabel>{t('contactSection.form.labels.role')}</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  label={t('contactSection.form.labels.role')}
                  onChange={handleInputChange}
                  MenuProps={menuPropsStyle}
                >
                  <MenuItem value="ceo" sx={menuItemStyle}>{t('contactSection.form.roles.ceo')}</MenuItem>
                  <MenuItem value="diretor" sx={menuItemStyle}>{t('contactSection.form.roles.director')}</MenuItem>
                  <MenuItem value="gerente" sx={menuItemStyle}>{t('contactSection.form.roles.manager')}</MenuItem>
                  <MenuItem value="vendedor" sx={menuItemStyle}>{t('contactSection.form.roles.sales')}</MenuItem>
                  <MenuItem value="outro" sx={menuItemStyle}>{t('contactSection.form.roles.other')}</MenuItem>
                </Select>
              </FormControl>
            </motion.div>
          </Grid>
          <Grid item xs={12}>
            <motion.div variants={itemVariants}>
              <FormControl fullWidth required sx={fieldStyle}>
                <InputLabel>{t('contactSection.form.labels.plan')}</InputLabel>
                <Select
                  name="plan"
                  value={formData.plan}
                  label={t('contactSection.form.labels.plan')}
                  onChange={handleInputChange}
                  MenuProps={menuPropsStyle}
                >
                  <MenuItem value="starter" sx={menuItemStyle}>{t('contactSection.form.plans.light')}</MenuItem>
                  <MenuItem value="pro" sx={menuItemStyle}>{t('contactSection.form.plans.pro')}</MenuItem>
                  <MenuItem value="ilimitado" sx={menuItemStyle}>{t('contactSection.form.plans.unlimited')}</MenuItem>
                </Select>
              </FormControl>
            </motion.div>
          </Grid>
          <Grid item xs={12}>
            <motion.div variants={itemVariants}>
              <TextField
                fullWidth
                name="message"
                label={t('contactSection.form.labels.help')}
                variant="outlined"
                multiline
                rows={4}
                value={formData.message}
                onChange={handleInputChange}
                sx={fieldStyle}
              />
            </motion.div>
          </Grid>
          <Grid item xs={12}>
            <motion.div variants={itemVariants}>
              <FormControl fullWidth required sx={fieldStyle}>
                <InputLabel>{t('contactSection.form.labels.time')}</InputLabel>
                <Select
                  name="time"
                  value={formData.time}
                  label={t('contactSection.form.labels.time')}
                  onChange={handleInputChange}
                  MenuProps={menuPropsStyle}
                >
                  {availableTimes.map(time => (
                    <MenuItem key={time} value={time} sx={menuItemStyle}>
                      {time}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </motion.div>
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <motion.div variants={itemVariants}>
              <FormControlLabel
                sx={{ alignItems: 'flex-start' }}
                control={<Checkbox name="agreedToCommunications" checked={formData.agreedToCommunications} onChange={handleInputChange} sx={{...checkboxStyle, pt: 0}} />}
                label={
                  <Typography sx={checkboxLabelStyle}>
                    {t('contactSection.form.checkboxes.communications')}
                  </Typography>
                }
              />
            </motion.div>
          </Grid>
          <Grid item xs={12}>
            <motion.div variants={itemVariants}>
              <FormControlLabel
                sx={{ alignItems: 'flex-start' }}
                control={<Checkbox name="agreedToPolicy" checked={formData.agreedToPolicy} onChange={handleInputChange} required sx={{...checkboxStyle, pt: 0}} />}
                label={
                  <Typography variant="body2" sx={checkboxLabelStyle}>
                    <Trans i18nKey="contactSection.form.checkboxes.privacyPolicy">
                      Eu li e concordo com a <Link component="button" type="button" onClick={handleOpenModal} sx={{ verticalAlign: 'baseline', textDecoration: 'underline' }}>
                        Políticas de privacidade
                      </Link>.
                    </Trans>
                  </Typography>
                }
              />
            </motion.div>
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                fullWidth
                size="large"
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  py: { xs: 1.5, sm: 2 },
                  borderRadius: '8px',
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  fontWeight: 600,
                  color: '#fff',
                  bgcolor: '#FF4081',
                  '&:hover': {
                    bgcolor: '#E0005F',
                  },
                }}
              >
                {t('contactSection.form.buttons.confirm')}
              </Button>
            </motion.div>
          </Grid>
        </Grid>
      </Box>

      <PolicyModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmPolicy}
      />
    </>
  );
};

export default BookingForm;