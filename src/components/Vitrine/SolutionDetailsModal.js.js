import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Chip,
  Grid,
  IconButton,
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import BusinessIcon from '@mui/icons-material/Business';

import ConnectionModal from './ConnectionModal';

export default function SolutionDetailsModal({ open, onClose, solution }) {
  const [isConnecting, setIsConnecting] = useState(false);

  if (!solution) return null;

  const handleInitiateContact = () => {
    setIsConnecting(true);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#1a1625',
            backgroundImage: 'linear-gradient(135deg, rgba(26, 22, 37, 0.95), rgba(49, 46, 129, 0.9))',
            backdropFilter: 'blur(24px)',
            color: 'white',
            borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: '0 40px 80px -12px rgba(0, 0, 0, 0.7)',
            overflow: 'hidden'
          }
        }}
      >
        <Box sx={{ position: 'relative', p: 4, background: 'linear-gradient(to bottom, rgba(255,255,255,0.03), transparent)' }}>
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute', top: 16, right: 16,
              color: 'rgba(255,255,255,0.4)',
              '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
            }}
          >
            <CloseIcon />
          </IconButton>

          <Box display="flex" gap={3} alignItems="flex-start">
            <Box sx={{
              width: 80, height: 80, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center',
              bgcolor: solution.color, boxShadow: `0 10px 40px ${solution.color}60`,
              fontSize: '2rem', fontWeight: 'bold', color: 'white',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              {solution.logo}
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="800" sx={{ mb: 1 }}>{solution.name}</Typography>
              <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
                <Chip
                  label={solution.category}
                  size="small"
                  icon={<BusinessIcon style={{ fontSize: 14, color: 'inherit' }} />}
                  sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.1)' }}
                />
                <Box display="flex" alignItems="center" color="#fbbf24" sx={{ bgcolor: 'rgba(251, 191, 36, 0.1)', px: 1, py: 0.5, borderRadius: 10 }}>
                  <StarIcon sx={{ fontSize: 16, mr: 0.5 }} />
                  <Typography variant="caption" fontWeight="bold">
                    {solution.rating} ({solution.reviews} avaliações)
                  </Typography>
                </Box>
                {solution.verified && (
                  <Box display="flex" alignItems="center" color="#34d399" sx={{ bgcolor: 'rgba(52, 211, 153, 0.1)', px: 1, py: 0.5, borderRadius: 10 }}>
                    <CheckCircleIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="caption" fontWeight="bold">Verificado</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>

        <DialogContent sx={{ px: 4, pb: 2 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: '#c084fc' }}>
                Sobre a Solução
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, mb: 3 }}>
                {solution.description}
                <br /><br />
                Além disso, nossa plataforma oferece dashboards em tempo real, integração via API e suporte 24/7 dedicado para contas Enterprise. Ideal para escalar sua operação sem perder o controle de qualidade.
              </Typography>

              <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ color: 'white', mt: 2 }}>
                Tags de Especialidade:
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {solution.tags.map(tag => (
                  <Chip
                    key={tag}
                    label={`#${tag}`}
                    sx={{ bgcolor: 'rgba(168, 85, 247, 0.1)', color: '#d8b4fe', border: '1px solid rgba(168, 85, 247, 0.2)' }}
                  />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{
                bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 4, p: 3,
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex', flexDirection: 'column', gap: 2
              }}>
                <Typography variant="subtitle1" fontWeight="bold" align="center">Vamos conversar?</Typography>
                <Typography variant="caption" align="center" sx={{ color: 'rgba(255,255,255,0.5)', mb: 1 }}>
                  Escolha como prefere iniciar o atendimento com este fornecedor.
                </Typography>

                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<WhatsAppIcon />}
                  onClick={handleInitiateContact}
                  sx={{
                    bgcolor: '#25D366', color: '#fff', py: 1.5, borderRadius: 3, fontWeight: 'bold',
                    '&:hover': {
                      bgcolor: '#128C7E', transform: 'translateY(-2px)', boxShadow: '0 8px 20px -4px rgba(37, 211, 102, 0.4)'
                    },
                    transition: 'all 0.2s'
                  }}
                >
                  Chamar no WhatsApp
                </Button>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }}>ou</Divider>

                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<ChatBubbleOutlineIcon />}
                  onClick={handleInitiateContact}
                  sx={{
                    bgcolor: '#6366f1', color: '#fff', py: 1.5, borderRadius: 3, fontWeight: 'bold',
                    '&:hover': {
                      bgcolor: '#4f46e5', transform: 'translateY(-2px)', boxShadow: '0 8px 20px -4px rgba(99, 102, 241, 0.4)'
                    },
                    transition: 'all 0.2s'
                  }}
                >
                  Chat da Plataforma
                </Button>

                <Typography variant="caption" align="center" sx={{ color: 'rgba(255,255,255,0.3)', mt: 1, fontSize: '0.7rem' }}>
                  Tempo médio de resposta: 15 min
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }} />
      </Dialog>

      <ConnectionModal 
        open={isConnecting} 
        onClose={() => setIsConnecting(false)} 
        targetCompany={solution} 
      />
    </>
  );
}