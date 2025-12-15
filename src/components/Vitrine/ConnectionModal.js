import React, { useEffect, useState } from 'react';
import { Dialog, Box, Typography, Avatar, Fade, Zoom } from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import HandshakeIcon from '@mui/icons-material/Handshake';
import BusinessIcon from '@mui/icons-material/Business';
import { keyframes } from '@mui/system';

const lockSpin = keyframes`
  0% { transform: rotate(0deg); border-color: rgba(255,255,255,0.1); }
  50% { border-color: #fbbf24; } // Gold no meio
  100% { transform: rotate(360deg); border-color: #10b981; } // Verde no final
`;

const beamFlow = keyframes`
  0% { background-position: -100% 0; }
  100% { background-position: 200% 0; }
`;

const magneticSnap = keyframes`
  0% { transform: scale(0.9); opacity: 0; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
`;

const ConnectionModal = ({ open, onClose, targetCompany }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (open) {
      setStep(0);
      const t1 = setTimeout(() => setStep(1), 800);
      const t2 = setTimeout(() => setStep(2), 3000);
      const t3 = setTimeout(onClose, 5000);

      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
  }, [open, onClose]);

  const accentColor = step === 2 ? '#10b981' : (step === 1 ? '#fbbf24' : '#64748b');

  return (
    <Dialog 
      open={open} 
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#0f172a',
          backgroundImage: 'linear-gradient(180deg, rgba(30, 41, 59, 0.5) 0%, transparent 100%)',
          backdropFilter: 'blur(16px)',
          borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 25px 80px -12px rgba(0, 0, 0, 0.7)',
          p: 0,
          overflow: 'hidden'
        }
      }}
    >
      <Box sx={{ p: 5, textAlign: 'center', position: 'relative' }}>

        <Box sx={{
          position: 'absolute', top: '-50%', left: '50%', transform: 'translateX(-50%)',
          width: '80%', height: '80%',
          background: `radial-gradient(circle, ${accentColor}30 0%, transparent 70%)`,
          transition: 'background 1s ease',
          zIndex: 0
        }} />

        <Box position="relative" zIndex={1} mb={5}>
          <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.4)', letterSpacing: 3, fontWeight: 600 }}>
            SMART MATCH
          </Typography>
          <Typography variant="h4" fontWeight="700" sx={{ color: 'white', mt: 1 }}>
            {step === 2 ? "Parceria Confirmada" : "Conectando Empresas"}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" justifyContent="space-between" position="relative" zIndex={1} px={1}>

          <Box textAlign="center">
            <Avatar 
              sx={{ 
                width: 80, height: 80, 
                bgcolor: '#334155', 
                border: '3px solid rgba(255,255,255,0.1)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
              }}
            >
              TL
            </Avatar>
          </Box>

          <Box sx={{ flex: 1, mx: 2, position: 'relative', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

            <Box sx={{ 
              position: 'absolute', width: '100%', height: '2px', 
              bgcolor: 'rgba(255,255,255,0.1)', 
              borderRadius: 2,
              overflow: 'hidden'
            }}>
              {step < 2 && (
                <Box sx={{
                  width: '100%', height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
                  backgroundSize: '50% 100%',
                  backgroundRepeat: 'no-repeat',
                  animation: `${beamFlow} 1.5s infinite linear`
                }} />
              )}
              {step === 2 && (
                <Box sx={{ width: '100%', height: '100%', bgcolor: '#10b981', transition: 'background 0.5s' }} />
              )}
            </Box>

            <Box sx={{ 
              position: 'relative',
              width: 64, height: 64, borderRadius: '50%',
              bgcolor: '#0f172a',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 2
            }}>
              
              {step < 2 && (
                <Box sx={{
                  position: 'absolute', width: '100%', height: '100%', borderRadius: '50%',
                  border: '2px solid transparent',
                  borderTopColor: accentColor,
                  animation: `${lockSpin} 2s linear infinite`
                }} />
              )}

              <Box sx={{ 
                transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transform: step === 2 ? 'scale(1.1)' : 'scale(1)'
              }}>
                {step === 2 ? (
                   <Zoom in={true}>
                     <VerifiedUserIcon sx={{ fontSize: 36, color: '#10b981', animation: `${magneticSnap} 0.4s ease-out` }} />
                   </Zoom>
                ) : (
                   <HandshakeIcon sx={{ fontSize: 28, color: step === 1 ? '#fbbf24' : 'rgba(255,255,255,0.2)' }} />
                )}
              </Box>
            </Box>

          </Box>

          <Box textAlign="center">
             <Avatar 
              src={targetCompany?.logo}
              sx={{ 
                width: 80, height: 80, 
                bgcolor: targetCompany?.color || '#db2777',
                border: step === 2 ? '3px solid #10b981' : '3px solid rgba(255,255,255,0.1)',
                transition: 'all 0.5s ease',
                filter: step < 1 ? 'grayscale(100%) opacity(0.6)' : 'none',
                boxShadow: step === 2 ? '0 0 40px rgba(16, 185, 129, 0.3)' : 'none'
              }}
            >
              <BusinessIcon />
            </Avatar>
          </Box>

        </Box>

        <Fade in={true} key={step}>
          <Box mt={4} sx={{ 
            bgcolor: 'rgba(255,255,255,0.03)', 
            py: 1.5, px: 3, borderRadius: '12px',
            display: 'inline-flex', alignItems: 'center', gap: 1.5,
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <Box sx={{ 
              width: 8, height: 8, borderRadius: '50%', 
              bgcolor: accentColor,
              boxShadow: `0 0 10px ${accentColor}`
            }} />
            
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
              {step === 0 && "Iniciando protocolo de handshake..."}
              {step === 1 && `Aguardando resposta de ${targetCompany?.name || 'Parceiro'}...`}
              {step === 2 && "Canal seguro estabelecido. Redirecionando..."}
            </Typography>
          </Box>
        </Fade>

      </Box>
    </Dialog>
  );
};

export default ConnectionModal;