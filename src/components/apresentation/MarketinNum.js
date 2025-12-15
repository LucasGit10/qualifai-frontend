import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useTranslation } from 'react-i18next'; // 1. IMPORTE O HOOK

const AnimatedCounter = ({ from, to }) => {
  const count = useMotionValue(from);
  const rounded = useTransform(count, Math.round);

  React.useEffect(() => {
    const animation = animate(count, to, { duration: 2 });
    return animation.stop;
  }, [count, to]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
      <Typography
        component="span"
        sx={{
          fontSize: { xs: '3rem', md: '4rem' },
          fontWeight: 700,
          color: '#6a11cb',
          lineHeight: 1,
        }}
      >
        <motion.span>{rounded}</motion.span>
      </Typography>
      <Typography
        component="span"
        sx={{
          fontSize: { xs: '3rem', md: '4rem' },
          fontWeight: 700,
          color: '#6a11cb',
          ml: 0.5,
        }}
      >
        %
      </Typography>
    </Box>
  );
};

const StatsComponent = () => {
  const { t } = useTranslation(); // 2. USE O HOOK

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 1500,
        mx: 'auto',
        p: { xs: 2, md: 4 },
        borderRadius: 4,
        background: '#FFFFFF',
        color: '#000000',
        boxShadow: 'none',
        borderTop: '1px solid rgba(200, 200, 200, 0.8)',
        borderBottom: '1px solid rgba(200, 200, 200, 0.8)',
      }}
    >
      <Grid container spacing={{ xs: 8, md: 4 }} alignItems="center" justifyContent="center">
        {/* Seção 1: 3X mais vendas */}
        <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            <Typography
              component="span"
              sx={{
                fontSize: { xs: '0.8rem', md: '1rem' },
                fontWeight: 500,
                mr: 1,
                mb: 1,
                color: 'rgba(0, 0, 0, 0.7)',
              }}
            >
            </Typography>
            <Typography
              component="span"
              sx={{
                fontSize: { xs: '3rem', md: '4rem' },
                fontWeight: 700,
                color: '#6a11cb',
                lineHeight: 1,
              }}
            >
              3X
            </Typography>
          </Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mt: 1,
              fontSize: { xs: '1rem', md: '1.2rem' },
              color: '#000000',
            }}
          >
            {t('statsSection.sales.title')}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mt: 0.5,
              fontSize: { xs: '0.8rem', md: '0.9rem' },
              color: 'rgba(0, 0, 0, 0.7)',
            }}
          >
            {t('statsSection.sales.description')}
          </Typography>
        </Grid>

        {/* Seção 2: Porcentagem Animada */}
        <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
          <AnimatedCounter from={0} to={72}/>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mt: 1,
              fontSize: { xs: '1rem', md: '1.2rem' },
              color: '#000000',
            }}
          >
            {t('statsSection.costReduction.title')}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mt: 0.5,
              fontSize: { xs: '0.8rem', md: '0.9rem' },
              color: 'rgba(0, 0, 0, 0.7)',
            }}
          >
            {t('statsSection.costReduction.description')}
          </Typography>
        </Grid>

        {/* Seção 3: Número Estático */}
        <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
          <Box>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '3rem', md: '4rem' },
                fontWeight: 700,
                color: '#6a11cb',
                lineHeight: 1,
              }}
            >
              24/7
            </Typography>
          </Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mt: 1,
              fontSize: { xs: '1rem', md: '1.2rem' },
              color: '#000000',
            }}
          >
            {t('statsSection.noPauses.title')}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mt: 0.5,
              fontSize: { xs: '0.8rem', md: '0.9rem' },
              color: 'rgba(0, 0, 0, 0.7)',
            }}
          >
            {t('statsSection.noPauses.description')}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatsComponent;