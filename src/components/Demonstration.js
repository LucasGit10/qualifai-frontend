import React, { useState } from 'react';
import {
  Typography,
  Grid,
  Box,
} from '@mui/material';
import {
  LocationOn,
  Email,
  Phone
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next'; // 1. IMPORTE O HOOK
import { staggerContainer, fadeInUp } from './AnimatedComponents';
import CalendarComponent from './CalendarComponent';
import SimpleBookingForm from './BookingFormRegister';

const ContactSectionWithSimpleBooking = ({
  isInView,
  currentMonth,
  selectedDate,
  showForm,
  formData,
  loading,
  handleDateSelect,
  handlePrevMonth,
  handleNextMonth,
  handleSubmit,
  handleBackToCalendar,
  handleTimeChange,
  isLoadingTimes,
  availableTimes,
}) => {
  const { t } = useTranslation(); // 2. USE O HOOK
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFormSubmit = (event) => {
    handleSubmit(event);
    setShowSuccess(true);
    setTimeout(() => {
        setShowSuccess(false);
        handleBackToCalendar();
    }, 3000);
  };

  const isPastMonth = () => {
    const today = new Date();
    const current = new Date(currentMonth);
    return current.getMonth() < today.getMonth() && current.getFullYear() <= today.getFullYear();
  };

  const SuccessMessage = () => (
    <motion.div
        key="success"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            minHeight: '450px',
            textAlign: 'center',
        }}
    >
        <Box sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: '#E8F5E9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </Box>
        <Typography variant="h5" sx={{ mt: 3, fontWeight: 600, color: '#2E7D32' }}>
            {t('simpleContactSection.successTitle')}
        </Typography>
        <Typography variant="body1" sx={{ color: '#757575', mt: 1 }}>
            {t('simpleContactSection.successMessage')}
        </Typography>
    </motion.div>
  );


  return (
    <Box
      component="section"
      sx={{
        py: 10,
        px: { xs: 2, sm: 4, md: 6 },
      }}
      id="agendamento"
    >
      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={staggerContainer}
      >
        <Grid
          container
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            background: '#FFFFFF',
            boxShadow: '0 8px 32px rgba(255, 255, 255, 1)',
            color: '#ffffff',
            maxWidth: '3000px',
            maxHeight: '3000px',
            mx: 'auto',
          }}
        >
          {/* Contact Information Section */}
          <Grid
            item
            xs={12} md={5}
            sx={{
              p: { xs: 3, md: 6 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <motion.div variants={fadeInUp}>
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  color: '#0F0C29',
                  position: 'relative',
                  display: 'inline-block',
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                }}
              >
                {t('simpleContactSection.title')}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 4,
                  color: '#757575',
                  fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.75rem' },
                  position: 'relative',
                  display: 'inline-block',
                  '&:after': {
                    content: '""',
                    display: 'block',
                    width: '100%',
                    height: '0.2rem',
                    background: '#3A1F6A',
                    borderRadius: '2px',
                    marginTop: '10px',
                  }
                }}
              >
                {t('simpleContactSection.subtitle')}
              </Typography>

              <Box sx={{ mb: 3 }}>
                {[
                  {
                    icon: <LocationOn sx={{ color: '#FFFFFF', fontSize: '1.7rem' }} />,
                    text: t('simpleContactSection.address'),
                    alignItems: 'flex-start'
                  },
                  {
                    icon: <Phone sx={{ color: '#FFFFFF', fontSize: '1.7rem' }} />,
                    text: "+55 (11) 94269-8013",
                    alignItems: 'center'
                  },
                  {
                    icon: <Email sx={{ color: '#FFFFFF', fontSize: '1.7rem' }} />,
                    text: "contato@qualifai.tech",
                    alignItems: 'center'
                  }
                ].map(({ icon, text, alignItems }, i) => (
                  <Box
                    component={motion.div}
                    whileHover={{ x: 5 }}
                    key={i}
                    sx={{
                      display: 'flex',
                      alignItems,
                      mb: 3,
                      color: '#424242',
                    }}
                  >
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: '#8A2BE2',
                      mr: 2,
                    }}>
                      {icon}
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{ fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } }}
                    >
                      {text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </motion.div>
          </Grid>

          {/* Scheduling Section */}
          <Grid
            item
            xs={12} md={7}
            sx={{
              p: { xs: 3, md: 7 },
            }}
          >
            <AnimatePresence mode="wait">
              {showSuccess ? (
                <SuccessMessage />
              ) : !showForm ? (
                <CalendarComponent
                  currentMonth={currentMonth}
                  key="calendar"
                  selectedDate={selectedDate}
                  handleDateSelect={handleDateSelect}
                  handlePrevMonth={isPastMonth() ? null : handlePrevMonth}
                  handleNextMonth={handleNextMonth}
                />
              ) : (
                <SimpleBookingForm
                  selectedDate={selectedDate}
                  key="bookingForm"
                  formData={formData}
                  handleSubmit={handleFormSubmit}
                  handleBackToCalendar={handleBackToCalendar}
                  handleTimeChange={handleTimeChange}
                  loading={loading}
                  isLoadingTimes={isLoadingTimes}
                  availableTimes={availableTimes}
                />
              )}
            </AnimatePresence>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
};

export default ContactSectionWithSimpleBooking;