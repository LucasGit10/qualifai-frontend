import React from 'react';
import { Box } from '@mui/material';
import { 
    rotateNebula, 
    float1, 
    float2, 
    float3, 
    LightOrb 
} from 'pages/Login/Login.styles';

export default function AnimatedBackground() {
  return (
    <>
      <Box
        sx={{
          minHeight: '100vh',
          width: '100vw',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: -1,
          overflow: 'hidden',
          background: '#0a071a',
          '::before': {
            content: '""',
            position: 'absolute',
            width: '200%',
            height: '200%',
            top: '-50%',
            left: '-50%',
            zIndex: 0,
            background: 'conic-gradient(from 90deg at 50% 50%, #2575FC -25.58deg, #6A11CB 18.29deg, #D76D77 138.82deg, #2575FC 334.42deg, #6A11CB 378.29deg)',
            filter: 'blur(150px)',
            opacity: 0.25,
            animation: `${rotateNebula} 50s linear infinite`,
          },
        }}
      />
      <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
        <LightOrb sx={{ top: '10%', left: '20%', width: 400, height: 400, background: 'rgba(106, 17, 171, 0.6)', animation: `${float1} 20s ease-in-out infinite alternate` }} />
        <LightOrb sx={{ bottom: '15%', right: '10%', width: 350, height: 350, background: 'rgba(0, 119, 182, 0.5)', animation: `${float2} 25s ease-in-out infinite alternate-reverse` }} />
        <LightOrb sx={{ top: '30%', right: '30%', width: 300, height: 300, background: 'rgba(215, 109, 119, 0.5)', animation: `${float3} 30s ease-in-out infinite alternate` }} />
      </Box>
    </>
  );
}
