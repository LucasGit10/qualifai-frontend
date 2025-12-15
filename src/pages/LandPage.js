import { useState, useRef } from 'react';
import { useInView } from 'framer-motion';
import { addMonths, formatISO } from 'date-fns';
import { Box, Container, Snackbar, Alert } from '@mui/material';
import HeroSection from '../components/HeroSection';
import PlansApresentation from '../components/apresentation/QualifApresentation';
import FeaturesCarousel from '../components/apresentation/AboutUsApresentation';
import ServicesSection from '../components/ServicesSection';
import ContactSection from '../components/ContactSection';
import { smoothScroll } from '../components/AnimatedComponents';
import AnimatedBackground from '../components/AnimatedBackground';
import PartnershipsSection from '../components/apresentation/Partnerhips';
import FeaturesSection from '../components/apresentation/Marketing';
import { HowItWorksSection } from '../components/apresentation/HowItWorksSection';
import AISalesSimulator from '../components/apresentation/SalesMethodologiesShowcase';
import Footer from '../components/Footer';
import api from '../services/api';
import ChatBot from '../components/AiChat';
import '../styles/LandingPage.css';
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import StatsComponent from '../components/apresentation/MarketinNum';

const LandingPage = () => {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const servicesRef = useRef(null);
  const aboutUsRef = useRef(null);
  const contactRef = useRef(null);
  const footerRef = useRef(null);

  const isFeaturesInView = useInView(featuresRef, { once: true, amount: 0.1 });
  const isServicesInView = useInView(servicesRef, { once: true, amount: 0.1 });
  const isAboutUsInView = useInView(aboutUsRef, { once: true, amount: 0.1 });
  const isContactInView = useInView(contactRef, { once: true, amount: 0.3 });

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
    time: ''
  });

  const handleDateSelect = (date) => {
    if (date < new Date()) return;

    setSelectedDate(date);
    setShowForm(true);

    setTimeout(() => {
      const formElement = document.getElementById('agendamento-form');
      if (formElement) {
        smoothScroll(formElement);
      }
    }, 150);
  };

  const handleBackToCalendar = () => {
    setShowForm(false);
    setTimeout(() => {
      setSelectedDate(null);
      smoothScroll(document.getElementById('agendamento'));
    }, 200);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(addMonths(currentMonth, -1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dateTime = new Date(selectedDate);
      const [hours, minutes] = formData.time.split(':');
      dateTime.setHours(parseInt(hours, 10));
      dateTime.setMinutes(parseInt(minutes, 10));

      const startDateTime = formatISO(dateTime);
      const endDateTime = formatISO(new Date(dateTime.getTime() + 30 * 60000));

      const meetingData = {
        summary: `Demonstração QualifAI com ${formData.name}`,
        description: formData.message || `Demonstração agendada por ${formData.name} (${formData.email}).`,
        startDateTime,
        endDateTime,
        attendeesEmails: [formData.email, 'qualifai.tech@gmail.com',],
      };

      await api.post('/demo/schedule-demo', meetingData);

      setSnackbar({
        open: true,
        message: 'Reunião agendada com sucesso! Você receberá um e-mail com os detalhes.',
        severity: 'success'
      });

      setFormData({ name: '', email: '', phone: '', service: '', message: '', time: '' });
      handleBackToCalendar();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.error || 'Erro ao agendar a reunião. Por favor, tente novamente.',
        severity: 'error'
      });
    }
  };

  const scrollToSchedule = () => {
    setShowForm(false);
    setSelectedDate(null);
    smoothScroll(document.getElementById('agendamento'));
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const theme = useTheme();
  const animatedBgTheme = createTheme({
    ...theme,
    palette: {
      ...theme.palette,
      background: {
        ...theme.palette.background,
        gradient: theme.palette.custom.gradients.background,
      },
    },
  });

  return (
    <>
      <ThemeProvider theme={animatedBgTheme}>
        <AnimatedBackground />
      </ThemeProvider>
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          overflowX: 'hidden',
          backgroundColor: '#ffffffff',
        }}
      >
        <HeroSection onScheduleClick={scrollToSchedule} />

        {/* --- CORREÇÃO APLICADA AQUI --- */}
        <Box sx={{ width: '90%', margin: '0 auto', marginTop: 3}}>
          <AISalesSimulator />
        </Box>
        
        <Box sx={ { marginTop: -5 } }>
          <FeaturesSection isInView={isFeaturesInView} />
        </Box>

        <Box
          ref={servicesRef}
          sx={{
            minHeight: 380,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <ServicesSection isInView={isServicesInView} />
        </Box>

        <Box sx={{ mb: 10 }}>
          <StatsComponent />
        </Box>

        <Box>
          <HowItWorksSection isInView={isServicesInView} />
        </Box>

        <Box
          ref={aboutUsRef}
          sx={{
            minHeight: 380,
          }}
        >
          <FeaturesCarousel />
        </Box>
        
        <Box ref={featuresRef}>
          <PlansApresentation isInView={isFeaturesInView} />
        </Box>

        <Container maxWidth="xl">
          <Box ref={contactRef} >
            <ContactSection
              isInView={isContactInView}
              currentMonth={currentMonth}
              selectedDate={selectedDate}
              showForm={showForm}
              formData={formData}
              handleDateSelect={handleDateSelect}
              handlePrevMonth={handlePrevMonth}
              handleNextMonth={handleNextMonth}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              handleBackToCalendar={handleBackToCalendar}
            />
          </Box>
        </Container>

        <Box ref={footerRef} sx={{ width: '100%' }}>
          <Footer />
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>

        <ChatBot conversationId="landingpage" />
      </Box>
    </>
  );
};

export default LandingPage;