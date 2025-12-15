import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Grid,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  FormControlLabel,
  Checkbox,
  Link,
} from '@mui/material';
import { IMaskInput } from 'react-imask';
import { addMonths, format, isToday } from 'date-fns';
import { toast } from 'react-toastify';
import api from '../services/api';

import CustomAppBar from '../components/CustomAppBar';
import PartnershipsSection from '../components/apresentation/Partnerhips';
import Footer from '../components/Footer';
import TermsModal from '../components/TermsModal';
import ContactSectionWithSimpleBooking from '../components/Demonstration';
import { useTranslation, Trans } from 'react-i18next';

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

const countryData = [
  { code: '+55', label: 'Brasil', flag: '🇧🇷' },
  { code: '+1', label: 'EUA', flag: '🇺🇸' },
  { code: '+351', label: 'Portugal', flag: '🇵🇹' },
  { code: '+54', label: 'Argentina', flag: '🇦🇷' },
  { code: '+44', label: 'Reino Unido', flag: '🇬🇧' },
];

const NewRegisterPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const handleOpenTermsModal = () => setIsTermsModalOpen(true);
  const handleCloseTermsModal = () => setIsTermsModalOpen(false);

  const initialFormState = {
    fullName: '', email: '', countryCode: '+55', phoneNumber: '',
    company: '', role: '', plan: '', message: '',
    agreedToCommunications: false, agreedToPolicy: false,
    time: null,
  };

  const [mainFormData, setMainFormData] = useState(initialFormState);
  const [formStep, setFormStep] = useState('fullForm');
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(false);
  
  const [availableTimes, setAvailableTimes] = useState([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const emailFromUrl = queryParams.get('email');
    if (emailFromUrl) {
      setMainFormData(prevData => ({ ...prevData, email: emailFromUrl }));
    }
  }, [location.search]);

  const fieldStyle = {
    '& .MuiInputLabel-root': { color: '#1F2937', fontWeight: 500 },
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#F6F4FF',
      borderRadius: '8px',
      transition: 'background-color 0.3s ease, border-color 0.3s ease',
      '& .MuiOutlinedInput-input': { color: '#1F2937' },
      '& .MuiSelect-select': { color: '#1F2937' },
      '& .MuiSelect-icon': { color: '#48287D' },
      '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.1)' },
      '&:hover fieldset': { borderColor: '#7356FC' },
      '&.Mui-focused': {
        backgroundColor: '#FFFFFF',
        '& fieldset': { borderColor: '#7356FC' },
      },
    },
    '& label.Mui-focused': { color: '#48287D' },
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
    '&:hover': { backgroundColor: '#EAE6FF' },
    '&.Mui-selected': {
      backgroundColor: '#7356FC',
      color: 'white',
      fontWeight: 600,
      '&:hover': { backgroundColor: '#5a42d4' },
    },
  };

  const checkboxStyle = {
    color: '#48287D',
    '&.Mui-checked': { color: '#7356FC' },
  };

  const checkboxLabelStyle = { color: '#48287D', fontSize: '0.9rem' };

  const handleMainFormChange = (event) => {
    const { name, value, checked, type } = event.target;
    setMainFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleTimeChange = (newTimeValue) => {
    setMainFormData(prev => ({ ...prev, time: newTimeValue }));
  };

  const handleFullFormSubmit = (event) => {
    event.preventDefault();
    setFormStep('calendar');
    const element = document.getElementById('contact-section');
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDateSelect = async (date) => {
    if (date < new Date() && !isToday(date)) return;
    setSelectedDate(date);
    setIsLoadingTimes(true);
    setAvailableTimes([]);
    setMainFormData(prev => ({ ...prev, time: null }));

    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const response = await api.get(`/demo/availability?date=${formattedDate}`);
      setAvailableTimes(response.data.availableSlots || []);
    } catch (error) {
      toast.error(t('registerPage.toasts.availabilityError'));
      setAvailableTimes([]);
    } finally {
      setIsLoadingTimes(false);
    }
    setFormStep('booking');
  };

  const handleBackToCalendar = () => {
    setFormStep('calendar');
  };
  
  const handleBookingFormSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...mainFormData,
        selectedDate: selectedDate,
      };

      await api.post('/demo/', payload);

      toast.success(t('registerPage.toasts.scheduleSuccess'));
      setFormStep('fullForm');
      setMainFormData(initialFormState);
      setSelectedDate(null);
      setAvailableTimes([]);

    } catch (error) {
      toast.error(error.response?.data?.message || t('registerPage.toasts.scheduleError'));
    } finally {
      setLoading(false);
    }
  };

  const handlePrevMonth = () => setCurrentMonth(addMonths(currentMonth, -1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  return (
    <Box sx={{ width: '100%', bgcolor: 'white' }}>
      <Box sx={{
        position: 'relative',
        borderRadius: { xs: 0, md: '24px' },
        overflow: 'hidden',
        background: 'linear-gradient(-135deg, #F6F4FF 0%, #E9C1FF 50%, #7356FC 100%)',
      }}>
        <Box
          component="img"
          src="/5dc26fd348ffb138b8cb55fa4181a398c4b1de99.png"
          alt="Detalhe visual"
          sx={{ position: 'absolute', bottom: 0, left: 0, transform: 'translate(-40%, 40%)', width: '65%', opacity: 0.3, pointerEvents: 'none', zIndex: 1 }}
        />
        <Box sx={{ position: 'relative', zIndex: 2}}>
          <CustomAppBar />
          <Grid container alignItems="flex-start" sx={{ py: { xs: 4, md: 8 }, px: { xs: 2, sm: 4, md: 10 } }}>
            
            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', pr: { md: 4 } }}>
                <Typography variant="h2" component="h1" sx={{ fontWeight: 800, color: '#1A0A3A', mb: 3, fontSize: { xs: '2.8rem', sm: '3.2rem', md: '3.75rem' }, lineHeight: 1.2, background: '#48287D', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {t('registerPage.title')}
                </Typography>
                <Typography variant="h6" component="p" sx={{ color: '#48287D', lineHeight: 1.7, maxWidth: 500, fontSize: { xs: '1rem', md: '1.1rem' } }}>
                      {t('registerPage.subtitle')}
                </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box component="form" onSubmit={handleFullFormSubmit}>
                <Grid container spacing={2.5}>
                  <Grid item xs={12}><TextField name="fullName" label={t('registerPage.labels.fullName')} variant="outlined" fullWidth required value={mainFormData.fullName} onChange={handleMainFormChange} sx={fieldStyle} /></Grid>
                  <Grid item xs={12}><TextField name="email" label={t('registerPage.labels.workEmail')} type="email" variant="outlined" fullWidth required value={mainFormData.email} onChange={handleMainFormChange} sx={fieldStyle} /></Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={1}>
                      <Grid item xs={4} sm={3} md={4}>
                        <FormControl fullWidth sx={fieldStyle}>
                           <Select name="countryCode" value={mainFormData.countryCode} onChange={handleMainFormChange} MenuProps={menuPropsStyle} sx={{ '& .MuiSelect-select': { display: 'flex', alignItems: 'center' } }}>
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
                        <TextField name="phoneNumber" label={t('registerPage.labels.phone')} variant="outlined" fullWidth required value={mainFormData.phoneNumber} onChange={handleMainFormChange} sx={fieldStyle} InputProps={{ inputComponent: TextMaskCustom }}/>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}><TextField name="company" label={t('registerPage.labels.company')} variant="outlined" fullWidth required value={mainFormData.company} onChange={handleMainFormChange} sx={fieldStyle} /></Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth sx={fieldStyle}>
                      <InputLabel>{t('registerPage.labels.role')}</InputLabel>
                      <Select name="role" value={mainFormData.role} label={t('registerPage.labels.role')} onChange={handleMainFormChange} MenuProps={menuPropsStyle}>
                        <MenuItem value="ceo" sx={menuItemStyle}>{t('registerPage.roles.ceo')}</MenuItem>
                        <MenuItem value="diretor" sx={menuItemStyle}>{t('registerPage.roles.director')}</MenuItem>
                        <MenuItem value="gerente" sx={menuItemStyle}>{t('registerPage.roles.manager')}</MenuItem>
                        <MenuItem value="vendedor" sx={menuItemStyle}>{t('registerPage.roles.sales')}</MenuItem>
                        <MenuItem value="outro" sx={menuItemStyle}>{t('registerPage.roles.other')}</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth sx={fieldStyle}>
                      <InputLabel>{t('registerPage.labels.plan')}</InputLabel>
                      <Select name="plan" value={mainFormData.plan} label={t('registerPage.labels.plan')} onChange={handleMainFormChange} MenuProps={menuPropsStyle}>
                        <MenuItem value="starter" sx={menuItemStyle}>{t('registerPage.plans.light')}</MenuItem>
                        <MenuItem value="pro" sx={menuItemStyle}>{t('registerPage.plans.pro')}</MenuItem>
                        <MenuItem value="ilimitado" sx={menuItemStyle}>{t('registerPage.plans.unlimited')}</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}><TextField name="message" label={t('registerPage.labels.help')} variant="outlined" fullWidth multiline rows={4} value={mainFormData.message} onChange={handleMainFormChange} sx={fieldStyle} /></Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                        control={<Checkbox name="agreedToCommunications" checked={mainFormData.agreedToCommunications} onChange={handleMainFormChange} sx={checkboxStyle} />}
                        label={<Typography sx={checkboxLabelStyle}>{t('registerPage.checkboxes.communications')}</Typography>}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={<Checkbox name="agreedToPolicy" checked={mainFormData.agreedToPolicy} onChange={handleMainFormChange} required sx={checkboxStyle} />}
                      label={
                        <Typography variant="body2" sx={checkboxLabelStyle}>
                           <Trans i18nKey="registerPage.checkboxes.privacyPolicy">
                             Eu li e concordo com a  <Link component="button" type="button" onClick={handleOpenTermsModal} sx={{ verticalAlign: 'baseline', textDecoration: 'underline' }}>Politicas de privacidade</Link>
                           </Trans>
                        </Typography>
                      }
                    />
                  </Grid>
                  {formStep === 'fullForm' && (
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" size="large" fullWidth sx={{ py: 1.5, borderRadius: '8px', bgcolor: '#FF4081', '&:hover': { bgcolor: '#E0005F' } }}>
                            {t('registerPage.buttons.requestContact')}
                        </Button>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <div id="contact-section">
        <ContactSectionWithSimpleBooking
          isInView={true}
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          showForm={formStep === 'booking'}
          isCalendarVisible={formStep === 'calendar' || formStep === 'booking'}
          formData={mainFormData}
          loading={loading}
          handleDateSelect={handleDateSelect}
          handlePrevMonth={handlePrevMonth}
          handleNextMonth={handleNextMonth}
          handleTimeChange={handleTimeChange} 
          handleSubmit={handleBookingFormSubmit}
          handleBackToCalendar={handleBackToCalendar}
          isLoadingTimes={isLoadingTimes}
          availableTimes={availableTimes}
        />
      </div>
      <Footer />
      <TermsModal open={isTermsModalOpen} onClose={handleCloseTermsModal} />
    </Box>
  );
};

export default NewRegisterPage;