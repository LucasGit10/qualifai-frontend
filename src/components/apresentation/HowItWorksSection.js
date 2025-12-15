import React, { useState } from 'react';
import { Box, Container, Typography, Grid, Stack, useTheme, useMediaQuery } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const stepsData = [
  {
    number: "01",
    image: "qualif-2.png",
    tKey: "connect",
  },
  {
    number: "02",
    image: "robozinho.png",
    tKey: "qualify",
  },
  {
    number: "03",
    image: "calen.png",
    tKey: "schedule",
  },
];

const fluidEasing = "easeOut";

export const HowItWorksSection = () => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container 
      maxWidth={false} 
      disableGutters
      sx={{ 
        my: { xs: 8, md: 12 }, 
      }}
    >
      <Typography
        variant="h4"
        component="h4"
        sx={{
          textAlign: 'center',
          fontWeight: 600,
          color: '#0F0C29',
          mb: { xs: 8, md: 10 },
        }}
        dangerouslySetInnerHTML={{ __html: t('howItWorksSection.title') }}
      >
      </Typography>

      <Stack spacing={0}>
        {stepsData.map((step, index) => {
          const isActive = activeStep === index;
          const isAlwaysActiveOnMobile = isMobile;
          const isHighlightedOnMobile = isMobile && index === 1;
          const shouldShowImage = isActive || isAlwaysActiveOnMobile;
          return (
            <Box
              key={index}
              onMouseEnter={() => setActiveStep(index)}
              sx={{
                position: 'relative',
                p: { xs: 4, md: 6 },
                backgroundColor: '#FFFFFF',
                cursor: 'pointer',
                overflow: 'hidden',
                color: (isActive || isAlwaysActiveOnMobile) && !isHighlightedOnMobile ? '#FFFFFF' : '#0F0C29',
                transition: 'color 0.6s ease',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: 'linear-gradient(90deg, #3D1E6D, #1C0F2A)',
                  opacity: (isActive || isAlwaysActiveOnMobile) && !isHighlightedOnMobile ? 1 : 0,
                  transition: 'opacity 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)',
                },
              }}
            >
              <Grid
                container
                spacing={{ xs: 3, md: 6 }}
                alignItems="center"
                sx={{
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <Grid item xs="auto">
                  <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                    <Typography 
                      component="span" 
                      sx={{ 
                        fontWeight: 700, 
                        fontSize: { xs: '4rem', md: '82px' }, 
                        color: 'inherit', 
                        transition: 'color 0.6s ease'                      }}>
                      {step.number}
                    </Typography>
                    <Typography component="span" sx={{ fontWeight: 700, fontSize: { xs: '4rem', md: '82px' }, color: '#9d78ff' }}>
                      .
                    </Typography>
                  </Box>
                </Grid>

                <AnimatePresence>
                  {shouldShowImage && (
                    <>
                      <Grid item xs={12} sm={5} md={4}>
                        <motion.div
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: '100%' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.7, ease: fluidEasing }}
                        >
                          <Box component="img" src={step.image} alt={t(`howItWorksSection.steps.${step.tKey}.title`)} sx={{ 
                            width: '100%', 
                            height: { xs: '150px', md: '220px' },
                            objectFit: 'contain',
                          }} />
                        </motion.div>
                      </Grid>
                    </>
                  )}
                </AnimatePresence>

                <Grid item xs>
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="h4" component="h3" sx={{ fontWeight: 700, color: 'inherit', fontSize: { xs: '1.5rem', md: '2.25rem' } }}>
                      {t(`howItWorksSection.steps.${step.tKey}.title`)}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'inherit', opacity: 0.9, mt: 1.5, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                      {t(`howItWorksSection.steps.${step.tKey}.description`)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          );
        })}
      </Stack>
    </Container>
  );
};

export default HowItWorksSection;