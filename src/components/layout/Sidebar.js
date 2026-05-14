import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip, Badge
} from '@mui/material';
import {
  SupportAgent as SupportAgentIcon,
  KeyboardDoubleArrowLeft as KeyboardDoubleArrowLeftIcon,
  KeyboardDoubleArrowRight as KeyboardDoubleArrowRightIcon,
  AssistantPhoto as TourIcon
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useTour } from 'contexts/TourContext';

import { ScrollableList } from './Layout.styles';
import ShowcaseBlocker from 'components/Showcase/ShowcaseBlocker';

export default function Sidebar({
  menuMinimizado,
  itensMenu,
  temConversasEscaladas,
  handleAbrirSuporte,
  handleToggleMinimizado,
  handleCloseMobileDrawer
}) {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { startSiteTour } = useTour();

  const handleStartTour = () => {
    startSiteTour();
    if (handleCloseMobileDrawer) {
      handleCloseMobileDrawer();
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '64px', 
        borderBottom: `1px solid ${theme.palette.divider}`, 
        flexShrink: 0 
      }}>
        <Box 
          component="img" 
          src={theme.palette.custom.logos.full} 
          alt="Logo QualifAI" 
          sx={{ 
            objectFit: 'contain', 
            height: theme.palette.mode === 'light' ? '40px' : '250px', 
            width: 'auto', 
            opacity: menuMinimizado ? 0 : 1, 
            transition: 'opacity 0.2s ease-out, height 0.2s ease-out' 
          }} 
        />
      </Box>

      <ScrollableList>
        {itensMenu.map((item) => {
          const isSelected = location.pathname === item.path || 
                             (item.path !== '/app/instagram' && item.path !== '/app/conversations' && location.pathname.startsWith(item.path + '/'));

          return (
            <ListItem key={item.tKey} disablePadding sx={{ display: 'block', my: 0.5 }}>
              <Tooltip title={menuMinimizado ? item.texto : ''} placement="right">
                <ListItemButton
                  selected={isSelected}
                  onClick={() => navigate(item.path)}
                  sx={{
                    minHeight: 48,
                    justifyContent: menuMinimizado ? 'center' : 'initial',
                    px: 2.5,
                    mx: 1,
                    borderRadius: 2,
                    transition: 'background-color 0.2s',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1)
                    },
                    '&.Mui-selected': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.2),
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: '25%',
                        height: '50%',
                        width: '4px',
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: '0 4px 4px 0'
                      },
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.25),
                      }
                    }
                  }}
                >
                  <ListItemIcon 
                    sx={{ 
                      minWidth: 0, 
                      mr: menuMinimizado ? 'auto' : 3, 
                      justifyContent: 'center', 
                      color: isSelected ? theme.palette.primary.main : theme.palette.text.secondary, 
                      width: menuMinimizado ? '100%' : 'auto' 
                    }}
                  >
                    {item.tKey === 'layout.menuItems.conversations' ? (
                      <Badge color="error" variant="dot" invisible={!temConversasEscaladas} overlap="circular">
                        {item.icone}
                      </Badge>
                    ) : (
                      item.icone
                    )}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.texto} 
                    sx={{ 
                      opacity: menuMinimizado ? 0 : 1, 
                      color: isSelected ? theme.palette.primary.main : theme.palette.text.primary, 
                      transition: 'opacity 0.2s ease-in-out', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap' 
                    }} 
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          )
        })}
      </ScrollableList>

      <Box sx={{ flexShrink: 0 }}>
        <Divider sx={{ borderColor: theme.palette.divider, my: 1 }} />
        <Tooltip title={menuMinimizado ? 'Fazer Tour Guiado' : ''} placement="right">
          <ListItemButton
            onClick={handleStartTour}
            sx={{
              minHeight: 48,
              justifyContent: menuMinimizado ? 'center' : 'initial',
              px: 2.5,
              mx: 1,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1)
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: menuMinimizado ? 'auto' : 3, justifyContent: 'center', color: theme.palette.text.secondary }}>
              <TourIcon />
            </ListItemIcon>
            <ListItemText
              primary="Tour Guiado"
              sx={{ opacity: menuMinimizado ? 0 : 1, color: theme.palette.text.primary, transition: 'opacity 0.2s ease-in-out' }}
            />
          </ListItemButton>
        </Tooltip>

        <Divider sx={{ borderColor: theme.palette.divider, my: 1 }} />
        <ShowcaseBlocker>
          <Tooltip title={menuMinimizado ? t('layout.supportFab.tooltip') : ''} placement="right">
            <ListItemButton
              onClick={handleAbrirSuporte}
              sx={{
                minHeight: 48,
                justifyContent: 'center',
                px: 2.5,
                py: 1.5,
                mx: 2,
                borderRadius: 2,
                transition: 'all 0.2s',
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', color: 'inherit' }}>
                <SupportAgentIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Suporte" 
                sx={{ 
                  opacity: menuMinimizado ? 0 : 1, 
                  transition: 'opacity 0.2s ease-in-out', 
                  pl: menuMinimizado ? 0 : 2 
                }} 
              />
            </ListItemButton>
          </Tooltip>
        </ShowcaseBlocker>
        <Divider sx={{ borderColor: theme.palette.divider, mt: 1 }} />
        <Tooltip title={menuMinimizado ? t('layout.sidebar.expandTooltip') : t('layout.sidebar.collapseTooltip')} placement="right">
          <ListItemButton 
            onClick={handleToggleMinimizado} 
            sx={{ 
              minHeight: 48, 
              justifyContent: menuMinimizado ? 'center' : 'initial', 
              px: 2.5, 
              py: 2,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1)
              }
            }}
          >
            <ListItemIcon 
              sx={{ 
                minWidth: 0, 
                mr: menuMinimizado ? 'auto' : 3, 
                justifyContent: 'center', 
                color: theme.palette.text.secondary, 
                width: menuMinimizado ? '100%' : 'auto' 
              }}
            >
              {menuMinimizado ? <KeyboardDoubleArrowRightIcon /> : <KeyboardDoubleArrowLeftIcon />}
            </ListItemIcon>
            <ListItemText 
              primary={t('layout.sidebar.collapseText')} 
              sx={{ 
                opacity: menuMinimizado ? 0 : 1, 
                color: theme.palette.text.secondary, 
                transition: 'opacity 0.2s ease-in-out', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis', 
                whiteSpace: 'nowrap' 
              }} 
            />
          </ListItemButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
