import React, { useEffect, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box, Drawer, useTheme } from '@mui/material';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';

import { useAuthStore } from 'stores/authStore';
import { useLayoutStore } from 'stores/layoutStore';
import { useMenuItems } from 'hooks/useMenuItems';

import api from 'services/api';
import { ShowcaseProvider } from 'contexts/ShowcaseContext';
import ConversionModal from 'components/Showcase/ConversionModal';

import TopBar from './TopBar';
import Sidebar from './Sidebar';
import SupportDialog from './SupportDialog';
import { Instagram as InstagramIcon } from '@mui/icons-material';

import AnimatedBackground from './AnimatedBackground';
import StaticBackground from './StaticBackground';

import { LARGURA_MENU, LARGURA_MENU_MINIMIZADO } from './Layout.styles';

export default function Layout({ toggleColorMode }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const location = useLocation();
  const { user, isAuthenticated, updateUser } = useAuthStore();
  
  const {
    menuMobileAberto,
    toggleMenuMobile,
    menuMinimizado,
    toggleMenuMinimizado,
    modalSuporteAberto,
    abrirModalSuporte,
    fecharModalSuporte,
    modalConversaoAberto,
    abrirModalConversao,
    fecharModalConversao,
    toggleViewMode, 
  } = useLayoutStore();
  
  const showCardsView = useLayoutStore(state => state.showCardsView);

  const plan = isAuthenticated ? (user?.plan || 'guest') : 'guest';
  
  const { itensMenu, canAccess: hookCanAccess } = useMenuItems(user, null, plan); 
  
  const itensMenuCompletos = useMemo(() => {
    const instagramConversationsItem = {
      tKey: 'layout.menuItems.instagramConversations',
      texto: t('layout.menuItems.instagramConversations', 'Conversas Instagram'),
      path: '/app/instagram-conversations',
      icone: <InstagramIcon />,
    };

    const menuComInstagram = [...itensMenu];
    const conversationsIndex = menuComInstagram.findIndex(item => item.tKey === 'layout.menuItems.conversations');
    menuComInstagram.splice(conversationsIndex + 1, 0, instagramConversationsItem);

    return menuComInstagram;
  }, [itensMenu, t]);
  const showcaseContextValue = useMemo(() => {
    const isGuestMode = !isAuthenticated || plan === 'guest';
    
    const canAccess = (featureKey) => {
        if (!hookCanAccess) return false;
        return hookCanAccess(featureKey);
    };

    return { isGuestMode, plan, canAccess, openModal: abrirModalConversao };
  }, [isAuthenticated, plan, abrirModalConversao, hookCanAccess]);
  
  const { data: dadosEscalados } = useQuery(
    'verificarConversasEscaladas',
    () => api.get('/conversations?status=escalated&limit=1').then(res => res.data),
    { refetchInterval: 15000, enabled: isAuthenticated && plan !== 'guest' }
  );
  const temConversasEscaladas = dadosEscalados?.total > 0;

  useEffect(() => {
    if (isAuthenticated) {
      api.get('/auth/profile').then(response => {
        if (response.data.user) {
          updateUser(response.data.user);
        }
      }).catch(error => console.error("Falha ao buscar perfil do usuário:", error));
    }
  }, [isAuthenticated, updateUser]);

  const tituloDaPagina = useMemo(() => itensMenuCompletos.find(item => location.pathname.startsWith(item.path))?.texto || t('Dashboard'), [location.pathname, itensMenuCompletos, t]);
  const larguraAtualDrawer = menuMinimizado ? LARGURA_MENU_MINIMIZADO : LARGURA_MENU;

  return (
    <ShowcaseProvider value={showcaseContextValue}>
      
      {theme.palette.mode === 'dark' ? <AnimatedBackground /> : <StaticBackground />}

      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <TopBar
          larguraDrawer={larguraAtualDrawer}
          handleToggleMenuMobile={toggleMenuMobile}
          tituloDaPagina={tituloDaPagina}
          toggleColorMode={toggleColorMode}
          showCardsView={showCardsView}
          handleViewChange={toggleViewMode}
        />

        <Box component="nav" sx={{ width: { sm: larguraAtualDrawer }, flexShrink: { sm: 0 }, transition: theme.transitions.create('width') }}>
          <Drawer 
            variant="temporary" 
            open={menuMobileAberto} 
            onClose={toggleMenuMobile} 
            ModalProps={{ keepMounted: true }} 
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: LARGURA_MENU, 
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(15px)', 
                border: `1px solid rgba(255, 255, 255, 0.2)` 
              }
            }}
          >
            <Sidebar 
              menuMinimizado={false} 
              itensMenu={itensMenuCompletos} 
              temConversasEscaladas={temConversasEscaladas} 
              handleAbrirSuporte={abrirModalSuporte} 
              handleToggleMinimizado={toggleMenuMinimizado}
              handleCloseMobileDrawer={toggleMenuMobile} // <-- ADICIONADO: PASSA A FUNÇÃO PARA FECHAR O MENU MOBILE
            />
          </Drawer>
          <Drawer 
            variant="permanent" 
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: larguraAtualDrawer, 
                overflowX: 'hidden', 
                transition: theme.transitions.create('width'), 
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(15px)', 
                border: `1px solid rgba(255, 255, 255, 0.2)` 
              }
            }} 
            open
          >
            <Sidebar 
              menuMinimizado={menuMinimizado} 
              itensMenu={itensMenuCompletos} 
              temConversasEscaladas={temConversasEscaladas} 
              handleAbrirSuporte={abrirModalSuporte} 
              handleToggleMinimizado={toggleMenuMinimizado}
              // Não precisa passar a função de fechar aqui, pois o menu desktop é permanente
            />
          </Drawer>
        </Box>

        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: 3, 
            width: { sm: `calc(100% - ${larguraAtualDrawer}px)` }, 
            mt: 8, 
            transition: theme.transitions.create('width') 
          }}
        >
          <Outlet />
        </Box>
        
        <SupportDialog open={modalSuporteAberto} onClose={fecharModalSuporte} />
        <ConversionModal open={modalConversaoAberto} onClose={fecharModalConversao} />
      </Box>
    </ShowcaseProvider>
  );
}