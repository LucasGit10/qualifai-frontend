import React from 'react';
import { Box, Typography, Container, Button, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next'; // 1. IMPORTE O HOOK

// 2. MODIFIQUE O ARRAY PARA USAR CHAVES DE TRADUÇÃO (tKey)
const featuresData = [
  {
    iconPath: '/icons/Vector-6.svg',
    tKey: 'wastedTime',
  },
  {
    iconPath: '/icons/Vector-11.svg',
    tKey: 'coldLeads',
  },
  {
    iconPath: '/icons/Vector-4.svg',
    tKey: 'highCost',
  },
  {
    iconPath: '/icons/Vector-1.svg',
    tKey: 'lostOpportunities',
  },
];

const FeaturesSection = () => {
  const { t } = useTranslation(); // 3. USE O HOOK

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
      {/* Título e Descrição */}
      <Typography 
        variant="h4" 
        component="h4" 
        sx={{ 
            fontWeight: 700, 
            color: '#1A0A3A', 
            mb: 2,
            fontFamily: '"Nunito Sans", sans-serif',
        }}
    >
        {t('featuresSection.title')}
      </Typography>
      <Typography 
        variant="h6" 
        component="p" 
        sx={{ 
            color: '#555', 
            maxWidth: 700, 
            mx: 'auto', 
            mb: 8,
            fontFamily: '"Nunito Sans", sans-serif',
            fontWeight: 400,
        }}
    >
       {t('featuresSection.subtitle')}
      </Typography>

      {/* Grid de Cards */}
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: { xs: 3, sm: 10 },
          maxWidth: '1200px',
          mx: 'auto',
        }}
      >
        {/* 4. FAÇA O MAP NO NOVO ARRAY 'featuresData' */}
        {featuresData.map((feature, index) => (
          <Paper
            key={index}
            elevation={0}
            sx={{
              p: 2.5,
              display: 'flex',
              alignItems: 'center',
              gap: 2.5,
              textAlign: 'left',
              borderRadius: '16px',
              border: '1px solid #e0e0e0',
              backgroundColor: 'white',
              width: '100%',
              transition: 'box-shadow 0.3s ease, transform 0.3s ease',
              '&:hover': {
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                  transform: 'translateY(-5px)',
              }
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                width: 80,
                height: 80,
                borderRadius: '12px',
                bgcolor: '#7356FC',
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: 'white',
                  maskImage: `url(${feature.iconPath})`,
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  WebkitMaskImage: `url(${feature.iconPath})`,
                  WebkitMaskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                }}
              />
            </Box>
            <Box>
              <Typography 
                  variant="h6" 
                  component="h3" 
                  sx={{ 
                      fontWeight: 700, 
                      color: '#1A0A3A',
                      fontFamily: '"Nunito Sans", sans-serif',
                  }}
              >
                {/* 5. USE A tKey PARA BUSCAR O TEXTO NO JSON */}
                {t(`featuresSection.features.${feature.tKey}.title`)}
              </Typography>
              <Typography 
                  variant="body2" 
                  sx={{ 
                      color: '#555',
                      fontFamily: '"Nunito Sans", sans-serif',
                  }}
              >
                {/* 6. FAÇA O MESMO PARA A DESCRIÇÃO */}
                {t(`featuresSection.features.${feature.tKey}.description`)}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Botão */}
      <Box sx={{ mt: 8 }}>
        <Button
          onClick={handleScrollToTop}
          variant="contained"
          sx={{
            height: 57,
            borderRadius: '15px',
            bgcolor: '#DC3884',
            color: 'white',
            fontWeight: 600,
            fontSize: '16px',
            textTransform: 'none',
            px: 5,
            '&:hover': {
              bgcolor: '#B8286C',
            },
          }}
        >
          {t('featuresSection.scheduleButton')}
        </Button>
      </Box>
    </Container>
  );
};

export default FeaturesSection;