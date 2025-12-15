// src/components/SalesMethodologiesTicker.js
import { Box, Typography, Paper, CardMedia, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';

const methodologies = [
  { name: 'SPIN Selling', image: '/spin.jpeg' },
  { name: 'BANT', image: '/bant.jpeg' },
  { name: 'MEDDIC', image: '/meddic.jpeg' },
  { name: 'SPICED', image: '/spiced.jpeg' },
];

// Variante de animação para o ticker
const marqueeVariants = {
  animate: {
    x: ['0%', '-100%'],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: 'loop',
        duration: 25, // Aumente para um movimento mais lento
        ease: 'linear',
      },
    },
  },
};

const MethodologyCard = ({ name, image }) => (
  <Paper
    variant="outlined"
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2,
      mx: 2,
      minWidth: { xs: 200, sm: 280 }, // Largura aumentada para as imagens
      height: 150,
      borderRadius: '16px',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderColor: 'rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
      }
    }}
  >
    <CardMedia
      component="img"
      image={image}
      alt={name}
      sx={{
        width: '100%',
        height: '100%',
        objectFit: 'contain', // Garante que a imagem inteira apareça sem cortes
        mb: 1,
      }}
    />
  </Paper>
);


const SalesMethodologiesTicker = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{
      py: { xs: 8, md: 12 },
      backgroundColor: '#F8F9FA', // Fundo claro e limpo
      overflow: 'hidden', // Essencial para o efeito ticker
    }}>
      <Box sx={{ textAlign: 'center', mb: 8, px: 2 }}>
        <Typography variant={isMobile ? "h4" : "h3"} component="h2" gutterBottom sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
          Inteligência que se Adapta à sua Estratégia
        </Typography>
        <Typography variant="h6" sx={{ color: theme.palette.text.secondary, maxWidth: '700px', mx: 'auto' }}>
          Nossa IA foi treinada nas metodologias de vendas mais eficazes do mundo, garantindo uma abordagem consistente e de alta performance.
        </Typography>
      </Box>

      {/* Container do Ticker */}
      <Box sx={{ width: '100%', display: 'flex' }}>
        <motion.div
          style={{ display: 'flex' }}
          variants={marqueeVariants}
          animate="animate"
        >
          {/* Renderizamos a lista duas vezes para o loop ser perfeito */}
          {[...methodologies, ...methodologies].map((method, index) => (
            <MethodologyCard key={`${method.name}-${index}`} name={method.name} image={method.image} />
          ))}
        </motion.div>
      </Box>
    </Box>
  );
};

export default SalesMethodologiesTicker;