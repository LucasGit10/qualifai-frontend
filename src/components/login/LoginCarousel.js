import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import {
  RocketLaunch as RocketLaunchIcon,
  BarChart as BarChartIcon,
  AutoAwesome as AutoAwesomeIcon,
  Hub as HubIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const carouselItems = [
  { icon: <RocketLaunchIcon sx={{ fontSize: 40 }} />, text: "Pronto para\nagilizar a qualificação\ndos seus leads?" },
  { icon: <BarChartIcon sx={{ fontSize: 40 }} />, text: "Decisões baseadas\nem dados,\nresultados reais." },
  { icon: <AutoAwesomeIcon sx={{ fontSize: 40 }} />, text: "O futuro das vendas\ninteligentes\ncomeça aqui." },
  { icon: <HubIcon sx={{ fontSize: 40 }} />, text: "Inteligência Artificial\na serviço do seu\ncrescimento." },
];

export default function LoginCarousel() {
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTextIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Box sx={{
      width: { md: '55%' },
      display: { xs: 'none', md: 'flex' },
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      p: { md: 6, lg: 8 },
      position: 'relative',
      color: 'white',
      backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)',
      backgroundSize: '20px 20px',
    }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={textIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{ width: '100%' }}
        >
          <Box sx={{ mb: 3 }}>{carouselItems[textIndex].icon}</Box>
          <Typography variant="h3" sx={{ fontWeight: 700, textShadow: '0 4px 15px rgba(0,0,0,0.4)', whiteSpace: 'pre-line', mb: 4 }}>
            {carouselItems[textIndex].text}
          </Typography>
        </motion.div>
      </AnimatePresence>
      <Box sx={{ display: 'flex', gap: 1.5, position: 'absolute', bottom: 40 }}>
        {carouselItems.map((_, index) => (
          <Box
            key={index}
            component={motion.div}
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: textIndex === index ? 1.2 : 1, opacity: textIndex === index ? 1 : 0.5 }}
            transition={{ duration: 0.3 }}
            sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'white' }}
          />
        ))}
      </Box>
    </Box>
  );
}
