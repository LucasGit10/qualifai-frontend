import React, { useState, useEffect } from 'react'; // ✅ Adicionar useEffect
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, IconButton, Typography, Tooltip, Menu, MenuItem,
  Avatar, Box, Button, ListItemIcon
} from '@mui/material';
import {
  Menu as MenuIcon, Brightness4 as Brightness4Icon, Brightness7 as Brightness7Icon,
  Translate as TranslateIcon, AccountCircle as ProfileIcon, Settings as SettingsIcon,
  Logout as LogoutIcon, Chat as ChatIcon, ViewQuilt as CardsIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from 'stores/authStore';
import { ToggleContainer, SlidingPill, ToggleButton, fadeInOut } from './Layout.styles';
import NotificationBell from './../NotificationBell';

export default function TopBar({
  larguraDrawer,
  handleToggleMenuMobile,
  tituloDaPagina,
  toggleColorMode,
  showCardsView,
  handleViewChange,
}) {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user, logout, isAuthenticated } = useAuthStore();

  const [anchorEl, setAnchorEl] = useState(null);
  const [langAnchorEl, setLangAnchorEl] = useState(null);


  // ✅ DEBUG - verificar se está funcionando
  useEffect(() => {
    console.log('🔔 TopBar - Estado de autenticação:', { 
      isAuthenticated, 
      user: user?.name,
      path: location.pathname 
    });
  }, [isAuthenticated, user, location.pathname]);

  const handleMenuUsuario = (event) => setAnchorEl(event.currentTarget);
  const handleFecharMenuUsuario = () => setAnchorEl(null);
  const handleOpenLangMenu = (event) => setLangAnchorEl(event.currentTarget);
  const handleCloseLangMenu = () => setLangAnchorEl(null);
  const handleChangeLanguage = (lang) => { 
    i18n.changeLanguage(lang); 
    handleCloseLangMenu(); 
  };
  
  const handleLogout = () => { 
    logout(); 
    navigate('/login'); 
    handleFecharMenuUsuario(); 
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { sm: `calc(100% - ${larguraDrawer}px)` },
        ml: { sm: `${larguraDrawer}px` },
        transition: theme.transitions.create(['width', 'margin']),
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(15px)',
        borderBottom: `1px solid rgba(255, 255, 255, 0.2)`,
      }}
    >
      <Toolbar>
        <IconButton 
          color="inherit" 
          aria-label="abrir menu" 
          edge="start" 
          onClick={handleToggleMenuMobile} 
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography 
          variant="h6" 
          noWrap 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            fontWeight: 600, 
            background: theme.palette.custom.gradients.text, 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent', 
            animation: `${fadeInOut} 0.5s ease-in-out` 
          }} 
          key={tituloDaPagina}
        >
          {tituloDaPagina}
        </Typography>

        {/* Toggle View para conversas */}
        {(location.pathname.startsWith('/app/conversations') || location.pathname.startsWith('/app/instagram-conversations')) && (
          <ToggleContainer sx={{ mr: 2 }}>
            <SlidingPill sx={{ transform: showCardsView ? 'translateX(calc(100% + 4px))' : 'translateX(0)' }} />

            <ToggleButton
              className={!showCardsView ? 'Mui-active' : ''}
              onClick={() => showCardsView && handleViewChange()}
              startIcon={<ChatIcon />}
            >
              Chat
            </ToggleButton>

            <ToggleButton
              className={showCardsView ? 'Mui-active' : ''}
              onClick={() => !showCardsView && handleViewChange()}
              startIcon={<CardsIcon />}
            >
              Cards
            </ToggleButton>
          </ToggleContainer>
        )}

        {/* ✅ NOTIFICATION BELL - CONDICIONAL SIMPLIFICADA */}
        {isAuthenticated && <NotificationBell />}

        {/* Seletor de Idioma */}
        <Tooltip title={t('layout.appBar.toggleLanguage', 'Alterar idioma')}>
          <IconButton onClick={handleOpenLangMenu} color="inherit">
            <TranslateIcon />
          </IconButton>
        </Tooltip>
        
        <Menu 
          anchorEl={langAnchorEl} 
          open={Boolean(langAnchorEl)} 
          onClose={handleCloseLangMenu} 
          PaperProps={{ 
            sx: { 
              background: theme.palette.background.paper, 
              border: `1px solid ${theme.palette.divider}` 
            } 
          }}
        >
          <MenuItem onClick={() => handleChangeLanguage('pt')} selected={i18n.language === 'pt'}>
            Português
          </MenuItem>
          <MenuItem onClick={() => handleChangeLanguage('en')} selected={i18n.language === 'en'}>
            English
          </MenuItem>
        </Menu>

        {/* Toggle Theme */}
        <Tooltip title={t('layout.appBar.toggleTheme')}>
          <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color="inherit">
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>

        {/* Área do Usuário */}
        {isAuthenticated ? (
          <>
            <IconButton 
              size="large" 
              aria-label="conta do usuário atual" 
              aria-controls="menu-appbar" 
              aria-haspopup="true" 
              onClick={handleMenuUsuario} 
              color="inherit"
            >
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  background: theme.palette.custom.gradients.button, 
                  color: theme.palette.primary.contrastText, 
                  fontSize: '0.875rem' 
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            
            <Menu 
              id="menu-appbar" 
              anchorEl={anchorEl} 
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} 
              transformOrigin={{ vertical: 'top', horizontal: 'right' }} 
              open={Boolean(anchorEl)} 
              onClose={handleFecharMenuUsuario} 
              PaperProps={{ 
                sx: { 
                  background: theme.palette.background.paper, 
                  border: `1px solid ${theme.palette.divider}` 
                } 
              }}
            >
              <MenuItem onClick={() => { navigate('/app/profile'); handleFecharMenuUsuario(); }}>
                <ListItemIcon>
                  <ProfileIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="body2">
                  {t('layout.appBar.userMenu.profile')}
                </Typography>
              </MenuItem>
              
              <MenuItem onClick={() => { navigate('/app/settings'); handleFecharMenuUsuario(); }}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="body2">
                  {t('layout.appBar.userMenu.settings')}
                </Typography>
              </MenuItem>
              
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="body2">
                  {t('layout.appBar.userMenu.logout')}
                </Typography>
              </MenuItem>
            </Menu>
          </>
        ) : (
          // ✅ Esta parte provavelmente NUNCA será exibida no Dashboard
          // já que o Dashboard é protegido por ProtectedRoute
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button color="inherit" onClick={() => navigate('/login')}>
              {t('layout.appBar.loginButton')}
            </Button>
            <Button 
              variant="contained" 
              onClick={() => navigate('/register')} 
              sx={{ background: theme.palette.custom.gradients.button }}
            >
              {t('layout.appBar.registerButton')}
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}