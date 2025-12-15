import { Box, useTheme } from '@mui/material';

const AnimatedBackground = () => {
  const theme = useTheme();

  // Acessando as cores corretamente
  const { dark1, dark2, dark3, dark4 } = theme.palette.background.gradient;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        backgroundImage: `
          linear-gradient(45deg, ${dark1}, ${dark2}, ${dark3}, ${dark4}, ${dark1}),
          radial-gradient(circle, rgba(255,255,255,0.02) 1%, transparent 1%)`,
        backgroundSize: '600% 600%, 4px 4px',
        animation: 'gradientShiftDiagonal 20s ease-in-out infinite',
        filter: 'blur(1px)',
        opacity: 0.98,
        backgroundBlendMode: 'overlay',
        // Adicionando a animação diretamente
        '@keyframes gradientShiftDiagonal': {
          '0%': {
            backgroundPosition: '0% 0%, 0 0'
          },
          '50%': {
            backgroundPosition: '100% 100%, 0 0'
          },
          '100%': {
            backgroundPosition: '0% 0%, 0 0'
          }
        }
      }}
    />
  );
};

export default AnimatedBackground;