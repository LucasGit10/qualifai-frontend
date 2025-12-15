import { Typography, Grid, Card, CardContent, Box, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Importe o hook

const MotionCard = motion(Card);

// 1. MANTENHA O ARRAY COM DADOS ESTRUTURAIS (ÍCONES) E ADICIONE UMA CHAVE DE TRADUÇÃO
const servicesData = [
  {
    iconPath: "/icons/Vector-5.svg",
    tKey: "instantQualification" // Chave para buscar no JSON
  },
  {
    iconPath: "/icons/Vector-12.svg",
    tKey: "humanCommunication"
  },
  {
    iconPath: "/icons/Vector-3.svg",
    tKey: "fullCalendar"
  },
  {
    iconPath: "/icons/Vector-8.svg",
    tKey: "service247"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  },
};

const ServicesSection = () => {
  const { t } = useTranslation(); // Use o hook
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/register-calendar');
  };
  
  return (
    <Box
      component={motion.section}
      sx={{
        position: 'relative',
        width: '100%',
        p: { xs: 3, md: 6 },
        borderRadius: '41px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        overflow: 'hidden',
        my: 8,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.4) 5%, rgba(115, 86, 252, 0.7) 40%, rgba(72, 40, 125, 0.95) 100%)',
          zIndex: 2,
        },
      }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 1,
        }}
      >
        <source src="/0907.mp4" type="video/mp4" />
      </video>

      <Box sx={{ position: 'relative', zIndex: 3, width: '100%' }}>
        <motion.div variants={itemVariants}>
          <Typography
            variant="h4"
            component="h4"
            sx={{
              fontWeight: 600,
              fontSize: { xs: '2rem', md: '2.625rem' },
              mb: { xs: 6, md: 8 },
              color: '#0F0C29',
              maxWidth: '800px',
              mx: 'auto',
            }}
          >
            {t('servicesSection.title')}
          </Typography>
        </motion.div>

        <Grid container spacing={4} justifyContent="center">
          {/* 2. FAÇA O MAP NO ARRAY ORIGINAL */}
          {servicesData.map((service, index) => (
            <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: 'flex' }}>
              <MotionCard
                variants={itemVariants}
                whileHover={{ y: -10, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
                sx={{
                  width: '100%',
                  height: '100%',
                  minHeight: { xs: 380, md: 420 },
                  p: 3,
                  borderRadius: '32px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
                  color: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)',
                  }
                }}
              >
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3,
                    flexGrow: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 74,
                      height: 74,
                      borderRadius: '50%',
                      bgcolor: '#7356FC',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        backgroundColor: 'white',
                        maskImage: `url(${service.iconPath})`, // O ícone vem do array
                        maskSize: 'contain',
                        maskRepeat: 'no-repeat',
                        maskPosition: 'center',
                        WebkitMaskImage: `url(${service.iconPath})`,
                        WebkitMaskSize: 'contain',
                        WebkitMaskRepeat: 'no-repeat',
                        WebkitMaskPosition: 'center',
                      }}
                    />
                  </Box>

                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      fontWeight: 600,
                      fontSize: '18px',
                      lineHeight: '1.4',
                    }}
                  >
                    {/* 3. TRADUZA O TÍTULO USANDO A CHAVE */}
                    {t(`servicesSection.services.${service.tKey}.title`)}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      lineHeight: '1.6',
                      fontSize: '16px',
                      flexGrow: 1,
                    }}
                  >
                    {/* 4. TRADUZA A DESCRIÇÃO USANDO A CHAVE */}
                    {t(`servicesSection.services.${service.tKey}.description`)}
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>

        <Box 
          component={motion.div} 
          variants={itemVariants}
          sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}
        >
          <Button
            onClick={handleRedirect}
            variant="contained"
            size="large"
            sx={{
              borderRadius: '15px',
              px: 6,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              background: '#DC3884',
              color: '#FFFFFF',
              boxShadow: '0 4px 20px rgba(220, 56, 132, 0.5)',
              '&:hover': {
                background: '#C72A74',
                boxShadow: '0 6px 25px rgba(220, 56, 132, 0.7)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            {t('servicesSection.specialistButton')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ServicesSection;