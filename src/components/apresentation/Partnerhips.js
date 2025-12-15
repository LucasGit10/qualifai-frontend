import React from 'react';
import { Box, Typography, Grid, Paper, Button, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CheckCircleOutline as CheckIcon, ArrowForward as ArrowIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// --- Card de Benefício (retangulinho) ---
const BenefitCard = ({ description }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      height: '100%',
      width: '100%',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start', // <-- ALINHAMENTO AJUSTADO AQUI
      gap: 1.5,
      background: 'rgba(255, 255, 255, 0.15)', 
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      color: 'white'
    }}
  >
    <CheckIcon sx={{ color: '#FFFFFF', opacity: 0.8 }} />
    <Typography
      variant="body2"
      sx={{
        color: 'white',
        fontWeight: 600,
        fontFamily: '"Nunito Sans", sans-serif',
      }}
    >
      {description}
    </Typography>
  </Paper>
);

// --- Componente Principal Modificado ---
const PartnershipsSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate('/sua-rota-aqui'); 
  };

  return (
    <Box 
      id="parcerias"
      sx={{ 
        py: { xs: 8, md: 12 },
        bgcolor: 'white'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 6, md: 6 }} alignItems="center">
          
          {/* COLUNA DA ESQUERDA (MAIS LARGA) */}
          <Grid item xs={12} md={7}> {/* <-- LARGURA AJUSTADA AQUI */}
            <Box sx={{ pr: { md: 4 } }}>
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontWeight: 700,
                  color: '#1A0A3A',
                  fontFamily: '"Nunito Sans", sans-serif',
                  lineHeight: 1.3,
                }}
              >
                {t('partnerships.mainText')}
              </Typography>
            </Box>
          </Grid>
          
          {/* COLUNA DA DIREITA (MAIS ESTREITA) */}
          <Grid item xs={12} md={5}> {/* <-- LARGURA AJUSTADA AQUI */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: '24px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 4,
                background: 'linear-gradient(135deg, #7356FC 0%, #a378e9ff 100%)',
                color: 'white',
                boxShadow: '0 16px 40px -12px rgba(72, 40, 125, 0.5)',
              }}
            >
              {/* Conteúdo Superior do Card */}
              <Box>
                <Typography 
                  variant="h4" 
                  fontWeight="bold" 
                  gutterBottom
                  sx={{ fontFamily: '"Nunito Sans", sans-serif' }}
                >
                  {t('partnerships.leftCard.title')}
                </Typography>

                {/* Container dos Benefícios */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    mt: 3,
                  }}
                >
                  {t('partnerships.benefits', { returnObjects: true }).map((benefit, index) => (
                    <BenefitCard key={index} description={benefit.description} />
                  ))}
                </Box>
              </Box>

            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default PartnershipsSection;