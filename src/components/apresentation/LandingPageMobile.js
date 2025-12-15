import { useState } from 'react';
import { motion } from 'framer-motion';
import { Box } from '@mui/material';

const cardTransition = {
  type: 'spring',
  stiffness: 400,
  damping: 40,
};

export const LandingPageMobile = ({ sections }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Função para calcular o estilo de cada card na pilha
  const getCardStyle = (index) => {
    const offset = activeIndex - index;

    if (offset < 0) {
      // Esconde as cartas que já foram "descartadas"
      return { y: '-150%', zIndex: index };
    }
    
    // As 3 primeiras cartas visíveis na pilha
    const scale = 1 - (offset * 0.05);
    const y = (offset * -25); // Deslocamento para criar a pilha
    const opacity = 1 - (offset * 0.2);

    return {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      position: 'absolute',
      scale,
      y,
      opacity,
      zIndex: sections.length - offset, // A carta do topo tem o maior zIndex
      transition: cardTransition,
    };
  };

  const handleDragEnd = (event, info) => {
    const dragThreshold = 100; // Distância mínima para mudar de card
    if (info.offset.y < -dragThreshold) {
      // Arrasta para cima -> vai para o próximo card
      setActiveIndex((prev) => Math.min(prev + 1, sections.length - 1));
    } else if (info.offset.y > dragThreshold) {
      // Arrasta para baixo -> volta para o card anterior
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: '#f0f0f0', // Um fundo para destacar os cards
        padding: '16px',
      }}
    >
      <Box sx={{ width: '100%', height: '95%', position: 'relative' }}>
        {sections.map((section, index) => {
          // Renderiza apenas as cartas próximas da ativa para otimizar
          if (index < activeIndex - 1 || index > activeIndex + 3) {
            return null;
          }

          const isTopCard = index === activeIndex;

          return (
            <motion.div
              key={index}
              animate={getCardStyle(index)}
              drag={isTopCard ? 'y' : false} // Apenas a carta do topo é arrastável
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              style={{
                height: '100%',
                width: '100%',
                borderRadius: '20px',
                backgroundColor: '#ffffff',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* O conteúdo do card com rolagem interna */}
              <Box sx={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                {section}
              </Box>
            </motion.div>
          );
        })}
      </Box>
    </Box>
  );
};