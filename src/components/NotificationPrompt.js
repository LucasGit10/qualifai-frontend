import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton, Slide } from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CloseIcon from '@mui/icons-material/Close';

/**
 * Banner customizado em português para solicitar permissão de notificação.
 * Aparece no canto inferior esquerdo após o login.
 * Só é exibido se a permissão ainda não foi concedida.
 */
function NotificationPrompt({ onAllow, onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Verifica se o usuário já respondeu antes
    if (Notification.permission === 'granted' || Notification.permission === 'denied') return;
    if (localStorage.getItem('notif_prompt_dismissed')) return;
    setVisible(true);
  }, []);

  const handleAllow = () => {
    setVisible(false);
    onAllow?.();
  };

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem('notif_prompt_dismissed', '1');
    onDismiss?.();
  };

  return (
    <Slide direction="up" in={visible} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          left: 24,
          zIndex: 9999,
          width: 340,
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          border: '1px solid rgba(99,102,241,0.35)',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
          p: 2.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <NotificationsActiveIcon sx={{ color: '#fff', fontSize: 20 }} />
            </Box>
            <Typography sx={{ color: '#f1f5f9', fontWeight: 600, fontSize: 14 }}>
              Ativar notificações
            </Typography>
          </Box>
          <IconButton size="small" onClick={handleDismiss} sx={{ color: '#94a3b8', mt: -0.5 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Body */}
        <Typography sx={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.5 }}>
          Receba alertas em tempo real sobre novos leads, mensagens e campanhas.
        </Typography>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
          <Button
            variant="contained"
            size="small"
            onClick={handleAllow}
            sx={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff',
              fontWeight: 600,
              fontSize: 13,
              borderRadius: 2,
              textTransform: 'none',
              flex: 1,
              '&:hover': { background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' },
            }}
          >
            ✅ Permitir
          </Button>
          <Button
            variant="text"
            size="small"
            onClick={handleDismiss}
            sx={{
              color: '#64748b',
              fontSize: 13,
              textTransform: 'none',
              borderRadius: 2,
              '&:hover': { color: '#94a3b8', background: 'rgba(255,255,255,0.05)' },
            }}
          >
            Agora não
          </Button>
        </Box>
      </Box>
    </Slide>
  );
}

export default NotificationPrompt;
