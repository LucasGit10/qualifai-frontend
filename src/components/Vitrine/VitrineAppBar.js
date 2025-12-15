import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Avatar, IconButton, useTheme, Zoom, Tooltip 
} from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { GlassPanel } from './style'; 

const VitrineAppBar = () => {
  const theme = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [navView, setNavView] = useState('buyer'); 

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navButtonStyle = (isActive) => ({
    borderRadius: '10px',
    px: 3,
    py: 0.8,
    textTransform: 'none',
    fontWeight: isActive ? 700 : 500,
    fontSize: '0.9rem',
    color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
    bgcolor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
    border: isActive ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
    boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
    transition: 'all 0.3s ease',
    '&:hover': {
      bgcolor: isActive ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
      color: '#fff',
      transform: 'translateY(-1px)'
    }
  });

  return (
    <GlassPanel sx={{ 
        position: 'fixed',
        top: 0, 
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 1200, 
        borderRadius: 0, 
        borderLeft: 0, borderRight: 0, borderTop: 0,
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
        background: scrolled ? 'rgba(15, 5, 24, 0.85)' : 'rgba(15, 5, 24, 0.2)', 
        backdropFilter: 'blur(12px)',
        boxShadow: scrolled ? '0 4px 30px rgba(0, 0, 0, 0.1)' : 'none',
        transition: 'all 0.4s ease',
        py: scrolled ? 1.5 : 2.5, 
        px: { xs: 2, md: 4 }, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
      
      <Box display="flex" alignItems="center">
        <Box 
          component="img"
          src="/Fundo transparente(1) 1.png"
          alt="Logo Qualifai"
          onClick={handleScrollToTop}
          sx={{ 
            height: 60,
            width: 'auto',
            cursor: 'pointer',
            transition: 'transform 0.3s ease',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))', 
            '&:hover': { transform: 'scale(1.05)' }
          }}
        />
      </Box>

      <Box sx={{ 
          display: { xs: 'none', md: 'flex' }, 
          gap: 0.5, 
          p: 0.5,
          bgcolor: 'rgba(255,255,255,0.03)', 
          borderRadius: '14px',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
        <Button 
          startIcon={<TravelExploreIcon />}
          onClick={() => setNavView('buyer')}
          sx={navButtonStyle(navView === 'buyer')}
        >
          Explorar Soluções
        </Button>
        <Button 
          startIcon={<StorefrontIcon />}
          onClick={() => setNavView('seller')}
          sx={navButtonStyle(navView === 'seller')}
        >
          Sou Fornecedor
        </Button>
      </Box>

      <Box display="flex" alignItems="center" gap={2}>
        
        <Zoom in={scrolled}>
            <Tooltip title="Voltar ao topo">
                <IconButton 
                    onClick={handleScrollToTop}
                    size="small"
                    sx={{ 
                        color: '#fff',
                        bgcolor: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        '&:hover': { bgcolor: '#c084fc', borderColor: '#c084fc' }
                    }}
                >
                    <KeyboardArrowUpIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        </Zoom>

        <IconButton sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#c084fc', bgcolor: 'rgba(192, 132, 252, 0.1)' } }}>
          <NotificationsNoneIcon />
        </IconButton>

        <Box textAlign="right" sx={{ display: { xs: 'none', sm: 'block' } }}>
          <Typography variant="caption" sx={{ color: '#c084fc', display: 'block', lineHeight: 1, fontWeight: 600, mb: 0.5 }}>
            PERFIL ATIVO
          </Typography>
          <Typography variant="body2" fontWeight="bold" color="white">TechLogistics S.A.</Typography>
        </Box>
        <Avatar 
          sx={{ 
            background: 'linear-gradient(135deg, #7c3aed, #db2777)', 
            border: '2px solid rgba(255,255,255,0.2)', 
            width: 42, height: 42,
            cursor: 'pointer',
            transition: 'box-shadow 0.3s ease',
            '&:hover': { boxShadow: '0 0 0 4px rgba(124, 58, 237, 0.2)' }
          }}
        >
          TL
        </Avatar>
      </Box>
    </GlassPanel>
  );
};

export default VitrineAppBar;