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
import { useTranslation } from 'react-i18next';
import { staggerContainer, fadeInUp } from './AnimatedComponents';
import CalendarComponent from './CalendarComponent';
import BookingForm from './BookingForm';

const ContactSection = ({
  isInView,
  currentMonth,
  selectedDate,
  showForm,
  formData,
  handleDateSelect,
  handlePrevMonth,
  handleNextMonth,
  handleInputChange,
  handleSubmit,
  handleBackToCalendar
}) => {
  const { t } = useTranslation();
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
  
  const contactInfo = [
    {
      icon: <LocationOn sx={{ color: '#FFFFFF', fontSize: '1.5rem' }} />,
      text: t('contactSection.address'),
      alignItems: 'flex-start'
    },
    {
      icon: <Phone sx={{ color: '#FFFFFF', fontSize: '1.5rem' }} />,
      text: "+55 (11) 94269-8013",
      alignItems: 'flex-start'
    },
    {
      icon: <Email sx={{ color: '#FFFFFF', fontSize: '1.5rem' }} />,
      text: "contato@qualifai.tech",
      alignItems: 'flex-start'
    }
  ];

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
            {t('contactSection.successTitle')}
        </Typography>
        <Typography variant="body1" sx={{ color: '#757575', mt: 1 }}>
            {t('contactSection.successMessage')}
        </Typography>
    </motion.div>
  );

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, sm: 8, md: 10 },
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
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
            color: '#ffffff',
            maxWidth: '1200px',
            mx: 'auto',
          }}
        >
          {/* Contact Information Section */}
          <Grid
            item
            xs={12} md={5}
            sx={{
              textAlign: { xs: 'center', md: 'left' },
              p: { xs: 4, sm: 5, md: 6 },
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
                  mb: 2,
                  color: '#0F0C29',
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                }}
              >
                {t('contactSection.title')}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 5,
                  color: '#757575',
                  fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                  mx: { xs: 'auto', md: 0 },
                  maxWidth: '500px',
                  '&:after': {
                    content: '""',
                    display: 'block',
                    width: '80px',
                    height: '0.2rem',
                    background: '#3A1F6A',
                    borderRadius: '2px',
                    marginTop: '12px',
                    mx: { xs: 'auto', md: 0 },
                  }
                }}
              >
                {t('contactSection.subtitle')}
              </Typography>

              <Box sx={{ mb: 3 }}>
                {contactInfo.map(({ icon, text, alignItems }, i) => (
                  <Box
                    component={motion.div}
                    whileHover={{ x: 5 }}
                    key={i}
                    sx={{
                      display: 'flex',
                      alignItems,
                      mb: 3,
                      color: '#424242',
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                    }}
                  >
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      width: { xs: 36, sm: 40 },
                      height: { xs: 36, sm: 40 },
                      borderRadius: '50%',
                      backgroundColor: '#8A2BE2',
                      mr: 2,
                    }}>
                      {icon}
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                    >
                      {text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </motion.div>
          </Grid>

          <Grid
            item
            xs={12} md={7}
            sx={{
              p: { xs: 3, sm: 5, md: 6 },
            }}
          >
            <AnimatePresence mode="wait">
              {showSuccess ? (
                <SuccessMessage />
              ) : !showForm ? (
                <CalendarComponent
                  key="calendar"
                  currentMonth={currentMonth}
                  selectedDate={selectedDate}
                  handleDateSelect={handleDateSelect}
                  handlePrevMonth={isPastMonth() ? null : handlePrevMonth}
                  handleNextMonth={handleNextMonth}
                />
              ) : (
                <BookingForm
                  key="form"
                  selectedDate={selectedDate}
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleSubmit={handleFormSubmit}
                  handleBackToCalendar={handleBackToCalendar}
                />
              )}
            </AnimatePresence>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
};

export default ContactSection;