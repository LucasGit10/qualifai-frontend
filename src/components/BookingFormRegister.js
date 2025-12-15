import React from 'react';
import {
  Typography,
  Button,
  Grid,
  Box,
  IconButton,
  Divider,
  CircularProgress,
  TextField,
  Chip,
} from '@mui/material';
import { AccessTime, ArrowBack } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

const locales = {
  pt: ptBR,
  en: enUS,
};

const TimeSlotSelector = ({ value, onChange, availableTimes, isLoading }) => {
  const { t } = useTranslation();
  const selectedTime = value ? format(value, 'HH:mm') : null;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 150, flexDirection: 'column' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2, color: 'text.secondary' }}>{t('simpleBookingForm.loadingMessage')}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, borderRadius: 3, background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
      <Typography align="center" sx={{ fontWeight: 600, color: '#111827', mb: 2 }}>
        {t('simpleBookingForm.availableTimesTitle')}
      </Typography>
      <Box 
        sx={{ 
          display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center',
          maxHeight: 220, overflowY: 'auto', p: 1
        }}
      >
        {availableTimes.length > 0 ? (
          availableTimes.map(timeISO => {
            const time = new Date(timeISO);
            const timeString = format(time, 'HH:mm');
            const isSelected = timeString === selectedTime;

            return (
              <Chip
                key={timeString}
                label={timeString}
                clickable
                onClick={() => onChange(time)}
                sx={{
                  fontSize: '1rem', fontWeight: 600, px: 2, py: 2.5,
                  borderRadius: '8px',
                  color: isSelected ? '#FFFFFF' : '#111827',
                  backgroundColor: isSelected ? '#3A1C6E' : '#FFFFFF',
                  border: '1px solid', borderColor: isSelected ? '#3A1C6E' : '#D1D5DB',
                  '&:hover': { backgroundColor: isSelected ? '#48287D' : '#F3F4F6' }
                }}
              />
            );
          })
        ) : (
          <Typography sx={{ color: 'text.secondary', my: 4, textAlign: 'center' }}>
            {t('simpleBookingForm.noSlotsMessage')}
          </Typography>
        )}
      </Box>
    </Box>
  );
};


const SimpleBookingForm = ({
  selectedDate,
  formData,
  handleTimeChange,
  handleSubmit,
  handleBackToCalendar,
  loading,
  isLoadingTimes,
  availableTimes,
}) => {
  const { t, i18n } = useTranslation();
  const currentLocale = locales[i18n.language] || ptBR;
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, when: "beforeChildren" } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } };

  return (
    <Box
      component={motion.form}
      onSubmit={handleSubmit}
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={containerVariants}
      sx={{
        maxWidth: '400px', mx: 'auto',
        px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 },
        borderRadius: 3, background: '#FFFFFF',
        boxShadow: '0 8px 32px rgba(255, 255, 255, 1)',
      }}
    >
      <Box sx={{ mb: { xs: 3, sm: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <motion.div variants={itemVariants}>
            <IconButton onClick={handleBackToCalendar} disabled={loading} sx={{ mr: 2, color: '#4B5563', '&:hover': { color: '#1F2937', backgroundColor: 'rgba(0,0,0, 0.05)' } }}>
              <ArrowBack fontSize="medium" />
            </IconButton>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827' }}>
              {t('simpleBookingForm.mainTitle')}
            </Typography>
          </motion.div>
        </Box>
        <motion.div variants={itemVariants}>
          <Typography variant="h6" sx={{ color: '#1F2937', mb: 1 }}>
            {selectedDate && format(selectedDate, t('simpleBookingForm.dateFormat'), { locale: currentLocale })}
          </Typography>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Divider sx={{ my: 2, height: '2px', background: 'linear-gradient(90deg, transparent, #7356FC, transparent)' }} />
        </motion.div>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label={t('simpleBookingForm.selectedTimeLabel')}
            value={formData.time ? format(formData.time, 'HH:mm') : t('simpleBookingForm.selectTimeDefault')}
            fullWidth
            InputProps={{ readOnly: true, startAdornment: <AccessTime sx={{ mr: 1, color: 'text.secondary' }} /> }}
            sx={{ 
              mb: 2,
              '& .MuiInputBase-input': {
                color: '#111827',
                fontWeight: 500
              }
            }}
          />
          <TimeSlotSelector
            value={formData.time}
            onChange={handleTimeChange}
            availableTimes={availableTimes}
            isLoading={isLoadingTimes}
          />
        </Grid>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <motion.div variants={itemVariants} whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }}>
            <Button
              type="submit" fullWidth size="large" variant="contained"
              disabled={loading || !formData.time}
              sx={{ py: 1.5, borderRadius: '8px', fontSize: '1.1rem', fontWeight: 600, color: '#fff', bgcolor: '#FF4081', '&:hover': { bgcolor: '#E0005F' } }}
            >
              {loading ? <CircularProgress size={26} color="inherit" /> : t('simpleBookingForm.confirmButton')}
            </Button>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SimpleBookingForm;