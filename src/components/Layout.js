// import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
// import { Outlet, useLocation, useNavigate } from 'react-router-dom';
// import {
//   Box, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton,
//   ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, Menu, MenuItem,
//   Fab, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
//   CircularProgress, Button, Badge, Tooltip, styled, useTheme, keyframes,
//   Switch // Mantenha a importação do Switch base
// } from '@mui/material';
// import {
//   Menu as MenuIcon,
//   Dashboard as DashboardIcon,
//   People as PeopleIcon,
//   Chat as ChatIcon,
//   Settings as SettingsIcon,
//   Logout as LogoutIcon,
//   Campaign as CampaignIcon,
//   GraphicEq as KanbanIcon,
//   SupportAgent as SupportAgentIcon,
//   CalendarMonth as CalendarIcon,
//   AdminPanelSettings as AdminPanelSettingsIcon,
//   AccountCircle as ProfileIcon,
//   KeyboardDoubleArrowLeft as KeyboardDoubleArrowLeftIcon,
//   KeyboardDoubleArrowRight as KeyboardDoubleArrowRightIcon,
//   Brightness4 as Brightness4Icon,
//   Brightness7 as Brightness7Icon,
//   DynamicFeed as DynamicFeedIcon,
//   Translate as TranslateIcon,
//   EmojiEvents as RankingIcon,
//   Groups as TeamIcon,
//   ViewQuilt as CardsIcon // Ícone para Cards
// } from '@mui/icons-material';
// import { useForm, Controller } from 'react-hook-form';
// import { toast } from 'react-toastify';
// import { useQuery } from 'react-query';
// import { useTranslation } from 'react-i18next';

// import { useAuthStore } from '../stores/authStore';
// import api from '../services/api';
// import { ShowcaseProvider } from '../contexts/ShowcaseContext';
// import ConversionModal from './Showcase/ConversionModal';
// import ShowcaseBlocker from './Showcase/ShowcaseBlocker';

// // --- NOVO COMPONENTE DE TOGGLE "SLIDING PILL" ---
// const ToggleContainer = styled(Box)(({ theme }) => ({
//   position: 'relative',
//   display: 'flex',
//   alignItems: 'center',
//   backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
//   borderRadius: '20px',
//   padding: '4px',
//   border: `1px solid ${theme.palette.divider}`,
// }));

// const SlidingPill = styled(Box)(({ theme }) => ({
//   position: 'absolute',
//   top: '4px',
//   height: 'calc(100% - 8px)',
//   width: 'calc(50% - 4px)',
//   backgroundColor: theme.palette.primary.main,
//   borderRadius: '16px',
//   transition: 'transform 0.3s cubic-bezier(0.65, 0, 0.35, 1)',
//   zIndex: 1,
// }));

// const ToggleButton = styled(Button)(({ theme }) => ({
//   flex: 1,
//   padding: '6px 12px',
//   color: theme.palette.text.secondary,
//   borderRadius: '16px',
//   zIndex: 2,
//   transition: 'color 0.3s ease-in-out',
//   textTransform: 'none',
//   fontWeight: 500,
//   '&.Mui-active': {
//     color: theme.palette.primary.contrastText,
//     fontWeight: 700,
//   },
// }));


// const ViewModeContext = createContext(null);
// export const useViewMode = () => useContext(ViewModeContext);

// const LARGURA_MENU = 240;
// const LARGURA_MENU_MINIMIZADO = 80;

// const fadeInOut = keyframes`
//   0% { opacity: 0; transform: translateY(-5px); }
//   50% { opacity: 1; transform: translateY(0); }
//   100% { opacity: 1; }
// `;

// const pulseAnimation = keyframes`
//   0% { box-shadow: 0 0 0 0 rgba(215, 109, 119, 0.4); }
//   70% { box-shadow: 0 0 0 10px rgba(215, 109, 119, 0); }
//   100% { box-shadow: 0 0 0 0 rgba(215, 109, 119, 0); }
// `;

// const ScrollableList = styled(List)(({ theme }) => ({
//   flexGrow: 1,
//   overflowY: 'auto',
//   overflowX: 'hidden',
//   '&::-webkit-scrollbar': { width: '6px' },
//   '&::-webkit-scrollbar-track': { background: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f1f1f1', borderRadius: '10px' },
//   '&::-webkit-scrollbar-thumb': { background: theme.palette.mode === 'dark' ? '#555' : '#888', borderRadius: '10px', '&:hover': { background: theme.palette.mode === 'dark' ? '#777' : '#666' } },
//   paddingRight: '4px',
// }));

// export default function Layout({ toggleColorMode }) {
//   const { t, i18n } = useTranslation();
//   const theme = useTheme();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { user, logout, isAuthenticated, updateUser } = useAuthStore();

//   const [showCardsView, setShowCardsView] = useState(user?.settings?.conversationView === 'cards');
//   const [menuMobileAberto, setMenuMobileAberto] = useState(false);
//   const [menuMinimizado, setMenuMinimizado] = useState(false);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [langAnchorEl, setLangAnchorEl] = useState(null);
//   const [modalSuporteAberto, setModalSuporteAberto] = useState(false);
//   const [enviandoSuporte, setEnviandoSuporte] = useState(false);
//   const [modalConversaoAberto, setModalConversaoAberto] = useState(false);

//   const { control: supportControl, handleSubmit: handleSupportSubmit, reset: resetSupportForm, formState: { errors: supportErrors } } = useForm();

//   const plan = isAuthenticated ? (user?.plan || 'guest') : 'guest';

//   const { data: dadosEscalados } = useQuery('verificarConversasEscaladas', () => api.get('/conversations?status=escalated&limit=1').then(res => res.data), { refetchInterval: 15000, enabled: isAuthenticated && plan !== 'guest', staleTime: 10000 });
//   const temConversasEscaladas = dadosEscalados?.total > 0;

//   useEffect(() => {
//     const buscarPerfil = async () => {
//       try {
//         const response = await api.get('/auth/profile');
//         if (response.data.user) {
//           updateUser(response.data.user);
//           setShowCardsView(response.data.user.settings?.conversationView === 'cards');
//         }
//       } catch (error) { console.error("Falha ao buscar perfil do usuário:", error); }
//     };
//     if (isAuthenticated) buscarPerfil();
//   }, [isAuthenticated, updateUser]);

//   useEffect(() => {
//     if (user?.settings?.conversationView) {
//       setShowCardsView(user.settings.conversationView === 'cards');
//     }
//   }, [user]);

//   const showcaseContextValue = useMemo(() => {
//     const isGuestMode = !isAuthenticated || plan === 'guest';
//     const featurePermissions = {
//       TEMPLATE: ['basic', 'medium', 'pro'],
//       CALENDAR: ['basic', 'medium', 'pro'],
//       KANBAN: ['basic', 'medium', 'pro'],
//       VOICE_AI: ['medium', 'pro'],
//       FOLLOWUP_AI: ['medium', 'pro'],
//       ADVANCED_REPORTS: ['pro'],
//     };
//     const canAccess = (featureKey) => {
//       if (isGuestMode) return false;
//       if (!featureKey) return true;
//       if (!featurePermissions[featureKey]) return true;
//       return featurePermissions[featureKey].includes(plan);
//     };
//     return { isGuestMode, plan, canAccess, openModal: () => setModalConversaoAberto(true) };
//   }, [isAuthenticated, user, plan]);

//   const itensMenuConfig = useMemo(() => {
//     const { canAccess } = showcaseContextValue;
//     const baseItems = [
//       { tKey: 'layout.menuItems.dashboard', icone: <DashboardIcon />, path: '/app/dashboard' },
//       { tKey: 'layout.menuItems.leads', icone: <PeopleIcon />, path: '/app/leads' },
//       { tKey: 'layout.menuItems.conversations', icone: <ChatIcon />, path: '/app/conversations' },
//       { tKey: 'layout.menuItems.campaigns', icone: <CampaignIcon />, path: '/app/campaigns' },
//     ];
//     if (canAccess('TEMPLATE')) baseItems.push({ tKey: 'layout.menuItems.templates', icone: <DynamicFeedIcon />, path: '/app/template-message' });
//     if (canAccess('CALENDAR')) baseItems.push({ tKey: 'layout.menuItems.calendar', icone: <CalendarIcon />, path: '/app/calendar' });
//     if (canAccess('KANBAN')) baseItems.push({ tKey: 'layout.menuItems.kanban', icone: <KanbanIcon />, path: '/app/kanban' });
//     const salesItems = [...baseItems, { tKey: 'layout.menuItems.ranking', icone: <RankingIcon />, path: '/app/ranking' }, { tKey: 'layout.menuItems.profile', icone: <ProfileIcon />, path: '/app/profile' }];
//     const managerItems = [...baseItems, { tKey: 'layout.menuItems.team', icone: <TeamIcon />, path: '/app/team' }, { tKey: 'layout.menuItems.ranking', icone: <RankingIcon />, path: '/app/ranking' }, { tKey: 'layout.menuItems.profile', icone: <ProfileIcon />, path: '/app/profile' }, { tKey: 'layout.menuItems.settings', icone: <SettingsIcon />, path: '/app/settings' }];
//     const adminItems = [...managerItems, { tKey: 'layout.menuItems.admin', icone: <AdminPanelSettingsIcon />, path: '/app/admin' }];
//     switch (user?.role) {
//       case 'admin': return adminItems;
//       case 'manager': return managerItems;
//       case 'sales': return salesItems;
//       default: return [];
//     }
//   }, [user, showcaseContextValue]);

//   const itensMenu = useMemo(() => itensMenuConfig.map(item => ({ ...item, texto: t(item.tKey) })), [itensMenuConfig, i18n.language]);
//   const tituloDaPagina = useMemo(() => itensMenu.find(item => location.pathname.startsWith(item.path))?.texto || t('layout.pageTitleFallback'), [location.pathname, itensMenu]);

//   const handleViewChange = async (newView) => {
//     const isCards = newView === 'cards';
//     const previousState = showCardsView;
//     setShowCardsView(isCards);

//     try {
//       const response = await api.patch('/auth/settings/view', { view: newView });
//       if (response.data.success) {
//         const updatedUserSettings = { ...user.settings, conversationView: newView };
//         const updatedUser = { ...user, settings: updatedUserSettings };
//         updateUser(updatedUser);
//       }
//     } catch (error) {
//       setShowCardsView(previousState);
//       toast.error(error.response?.data?.message || "Falha ao salvar preferência.");
//     }
//   };

//   const handleToggleMenuMobile = () => setMenuMobileAberto(!menuMobileAberto);
//   const handleToggleMinimizado = () => setMenuMinimizado(!menuMinimizado);
//   const handleMenuUsuario = (event) => setAnchorEl(event.currentTarget);
//   const handleFecharMenuUsuario = () => setAnchorEl(null);
//   const handleOpenLangMenu = (event) => setLangAnchorEl(event.currentTarget);
//   const handleCloseLangMenu = () => setLangAnchorEl(null);
//   const handleChangeLanguage = (lang) => { i18n.changeLanguage(lang); handleCloseLangMenu(); };
//   const handleLogout = () => { logout(); navigate('/login'); handleFecharMenuUsuario(); };
//   const handleAbrirSuporte = () => { resetSupportForm({ subject: '', message: '' }); setModalSuporteAberto(true); };
//   const handleFecharSuporte = () => setModalSuporteAberto(false);

//   const onSupportSubmit = async (data) => {
//     setEnviandoSuporte(true);
//     try {
//       await api.post('/support/send-message', data);
//       toast.success(t('layout.toasts.supportSuccess'));
//       handleFecharSuporte();
//     } catch (error) {
//       toast.error(error.response?.data?.message || t('layout.toasts.supportError'));
//     } finally {
//       setEnviandoSuporte(false);
//     }
//   };

//   const conteudoDrawer = (
//     <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', background: theme.palette.background.paper, overflow: 'hidden' }}>
//       <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '65px', borderBottom: `1px solid ${theme.palette.divider}`, flexShrink: 0 }}>
//         <Box component="img" src={theme.palette.custom.logos.full} alt="Logo QualifAI" sx={{ objectFit: 'contain', height: theme.palette.mode === 'light' ? '40px' : '250px', width: 'auto', opacity: menuMinimizado ? 0 : 1, transition: 'opacity 0.2s ease-out, height 0.2s ease-out' }} />
//       </Box>
//       <ScrollableList>
//         {itensMenu.map((item) => {
//           const isSelected = location.pathname.startsWith(item.path);
//           return (
//             <ListItem key={item.tKey} disablePadding sx={{ display: 'block', my: 0.5 }}>
//               <Tooltip title={menuMinimizado ? item.texto : ''} placement="right">
//                 <ListItemButton selected={isSelected} onClick={() => navigate(item.path)} sx={{ minHeight: 48, justifyContent: menuMinimizado ? 'center' : 'initial', px: 2.5, borderRadius: 2, transition: 'transform 0.15s ease-in-out, background-color 0.2s', position: 'relative', overflow: 'hidden', '&:hover': { transform: 'scale(1.03)', background: theme.palette.custom.glass.light }, '&.Mui-selected': { background: theme.palette.primary.dark, '&::before': { content: '""', position: 'absolute', left: 0, top: '25%', height: '50%', width: '4px', backgroundColor: theme.palette.secondary.main, borderRadius: '0 4px 4px 0', animation: `${keyframes`from { transform: translateX(-10px); } to { transform: translateX(0); }`} 0.3s ease-out` }, '&:hover': { background: theme.palette.primary.dark } } }}>
//                   <ListItemIcon sx={{ minWidth: 0, mr: menuMinimizado ? 'auto' : 3, justifyContent: 'center', color: isSelected ? theme.palette.secondary.light : theme.palette.text.secondary, width: menuMinimizado ? '100%' : 'auto' }}>
//                     {item.tKey === 'layout.menuItems.conversations' ? (<Badge color="error" variant="dot" invisible={!temConversasEscaladas} overlap="circular">{item.icone}</Badge>) : (item.icone)}
//                   </ListItemIcon>
//                   <ListItemText primary={item.texto} sx={{ opacity: menuMinimizado ? 0 : 1, color: isSelected ? theme.palette.secondary.light : theme.palette.text.primary, transition: 'opacity 0.2s ease-in-out, color 0.2s', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} />
//                 </ListItemButton>
//               </Tooltip>
//             </ListItem>
//           )
//         })}
//       </ScrollableList>
//       <Box sx={{ flexShrink: 0 }}>
//         <Divider sx={{ borderColor: theme.palette.divider, my: 1 }} />
//         <ShowcaseBlocker>
//           <Tooltip title={menuMinimizado ? t('layout.supportFab.tooltip') : ''} placement="right">
//             <ListItemButton
//               onClick={handleAbrirSuporte}
//               sx={{
//                 minHeight: 48,
//                 justifyContent: 'center',
//                 px: 2.5,
//                 py: 1.5,
//                 mx: 2,
//                 borderRadius: 2,
//                 transition: 'background-color 0.2s',
//                 animation: `${pulseAnimation} 2s infinite`,
//                 bgcolor: 'primary.main',
//                 color: 'primary.contrastText',
//                 '&:hover': {
//                   bgcolor: 'primary.dark'
//                 }
//               }}
//             >
//               <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', color: 'inherit' }}>
//                 <SupportAgentIcon />
//               </ListItemIcon>
//               <ListItemText 
//                 primary="Suporte" 
//                 sx={{ 
//                   opacity: menuMinimizado ? 0 : 1, 
//                   transition: 'opacity 0.2s ease-in-out',
//                   pl: menuMinimizado ? 0 : 2
//                 }} 
//               />
//             </ListItemButton>
//           </Tooltip>
//         </ShowcaseBlocker>
//         <Divider sx={{ borderColor: theme.palette.divider, mt: 1 }} />
//         <Tooltip title={menuMinimizado ? t('layout.sidebar.expandTooltip') : t('layout.sidebar.collapseTooltip')} placement="right">
//           <ListItemButton onClick={handleToggleMinimizado} sx={{ minHeight: 48, justifyContent: menuMinimizado ? 'center' : 'initial', px: 2.5, py: 2 }}>
//             <ListItemIcon sx={{ minWidth: 0, mr: menuMinimizado ? 'auto' : 3, justifyContent: 'center', color: theme.palette.text.secondary, width: menuMinimizado ? '100%' : 'auto' }}>
//               {menuMinimizado ? <KeyboardDoubleArrowRightIcon /> : <KeyboardDoubleArrowLeftIcon />}
//             </ListItemIcon>
//             <ListItemText primary={t('layout.sidebar.collapseText')} sx={{ opacity: menuMinimizado ? 0 : 1, color: theme.palette.text.secondary, transition: 'opacity 0.2s ease-in-out', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} />
//           </ListItemButton>
//         </Tooltip>
//       </Box>
//     </Box>
//   );

//   const larguraAtualDrawer = menuMinimizado ? LARGURA_MENU_MINIMIZADO : LARGURA_MENU;

//   return (
//     <ShowcaseProvider value={showcaseContextValue}>
//       <Box sx={{ display: 'flex', background: theme.palette.background.default, minHeight: '100vh' }}>
//         <AppBar position="fixed" elevation={0} sx={{ width: { sm: `calc(100% - ${larguraAtualDrawer}px)` }, ml: { sm: `${larguraAtualDrawer}px` }, transition: theme.transitions.create(['width', 'margin']), zIndex: theme.zIndex.drawer + 1 }}>
//           <Toolbar>
//             <IconButton color="inherit" aria-label="abrir menu" edge="start" onClick={handleToggleMenuMobile} sx={{ mr: 2, display: { sm: 'none' } }}><MenuIcon /></IconButton>
//             <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600, background: theme.palette.custom.gradients.text, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: `${fadeInOut} 0.5s ease-in-out` }} key={tituloDaPagina}>
//               {tituloDaPagina}
//             </Typography>

//             {/* --- NOVO TOGGLE IMPLEMENTADO AQUI --- */}
//             {location.pathname.startsWith('/app/conversations') && (
//               <ToggleContainer sx={{ mr: 2 }}>
//                 <SlidingPill sx={{ transform: showCardsView ? 'translateX(calc(100% + 4px))' : 'translateX(0)' }} />
//                 <ToggleButton 
//                   className={!showCardsView ? 'Mui-active' : ''}
//                   onClick={() => handleViewChange('chat')}
//                   startIcon={<ChatIcon />}
//                 >
//                   Chat
//                 </ToggleButton>
//                 <ToggleButton 
//                   className={showCardsView ? 'Mui-active' : ''}
//                   onClick={() => handleViewChange('cards')}
//                   startIcon={<CardsIcon />}
//                 >
//                   Cards
//                 </ToggleButton>
//               </ToggleContainer>
//             )}

//             <Tooltip title={t('layout.appBar.toggleLanguage', 'Alterar idioma')}>
//               <IconButton onClick={handleOpenLangMenu} color="inherit"><TranslateIcon /></IconButton>
//             </Tooltip>
//             <Menu anchorEl={langAnchorEl} open={Boolean(langAnchorEl)} onClose={handleCloseLangMenu} PaperProps={{ sx: { background: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` } }}>
//               <MenuItem onClick={() => handleChangeLanguage('pt')} selected={i18n.language === 'pt'}>Português</MenuItem>
//               <MenuItem onClick={() => handleChangeLanguage('en')} selected={i18n.language === 'en'}>English</MenuItem>
//             </Menu>
//             <Tooltip title={t('layout.appBar.toggleTheme')}>
//               <IconButton sx={{ ml: 1 }} onClick={(event) => toggleColorMode(event)} color="inherit">
//                 {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
//               </IconButton>
//             </Tooltip>
//             {isAuthenticated ? (
//               <>
//                 <IconButton size="large" aria-label="conta do usuário atual" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleMenuUsuario} color="inherit"><Avatar sx={{ width: 32, height: 32, background: theme.palette.custom.gradients.button, color: theme.palette.primary.contrastText, fontSize: '0.875rem' }}>{user?.name?.charAt(0).toUpperCase()}</Avatar></IconButton>
//                 <Menu id="menu-appbar" anchorEl={anchorEl} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }} open={Boolean(anchorEl)} onClose={handleFecharMenuUsuario} PaperProps={{ sx: { background: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` } }}>
//                   <MenuItem onClick={() => { navigate('/app/profile'); handleFecharMenuUsuario(); }}><ListItemIcon><ProfileIcon fontSize="small" /></ListItemIcon><Typography variant="body2">{t('layout.appBar.userMenu.profile')}</Typography></MenuItem>
//                   <MenuItem onClick={() => { navigate('/app/settings'); handleFecharMenuUsuario(); }}><ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon><Typography variant="body2">{t('layout.appBar.userMenu.settings')}</Typography></MenuItem>
//                   <MenuItem onClick={handleLogout}><ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon><Typography variant="body2">{t('layout.appBar.userMenu.logout')}</Typography></MenuItem>
//                 </Menu>
//               </>
//             ) : (<Box sx={{ display: 'flex', gap: 1 }}><Button color="inherit" onClick={() => navigate('/login')}>{t('layout.appBar.loginButton')}</Button><Button variant="contained" onClick={() => navigate('/register')} sx={{ background: theme.palette.custom.gradients.button }}>{t('layout.appBar.registerButton')}</Button></Box>)}
//           </Toolbar>
//         </AppBar>

//         <Box component="nav" sx={{ width: { sm: larguraAtualDrawer }, flexShrink: { sm: 0 }, transition: theme.transitions.create('width') }}>
//           <Drawer variant="temporary" open={menuMobileAberto} onClose={handleToggleMenuMobile} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: LARGURA_MENU, border: 'none' } }}>{conteudoDrawer}</Drawer>
//           <Drawer variant="permanent" sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: larguraAtualDrawer, border: 'none', overflowX: 'hidden', transition: theme.transitions.create('width') } }} open>{conteudoDrawer}</Drawer>
//         </Box>

//         <ViewModeContext.Provider value={{ showCardsView }}>
//             <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${larguraAtualDrawer}px)` }, mt: 8, transition: theme.transitions.create('width') }}>
//                 <Outlet />
//             </Box>
//         </ViewModeContext.Provider>
//         <Dialog open={modalSuporteAberto} onClose={handleFecharSuporte} fullWidth maxWidth="sm" PaperProps={{ sx: { background: theme.palette.background.paper } }}>
//           <form onSubmit={handleSupportSubmit(onSupportSubmit)}>
//             <DialogTitle>{t('layout.supportDialog.title')}</DialogTitle>
//             <DialogContent>
//               <Typography variant="body2" sx={{ mb: 2, color: theme.palette.text.secondary }}>{t('layout.supportDialog.description')}</Typography>
//               <Controller name="subject" control={supportControl} defaultValue="" rules={{ required: t('layout.supportDialog.subjectError') }} render={({ field }) => (<TextField {...field} autoFocus margin="dense" label={t('layout.supportDialog.subjectLabel')} type="text" fullWidth variant="outlined" error={!!supportErrors.subject} helperText={supportErrors.subject?.message} />)} />
//               <Controller name="message" control={supportControl} defaultValue="" rules={{ required: t('layout.supportDialog.messageError') }} render={({ field }) => (<TextField {...field} margin="dense" label={t('layout.supportDialog.messageLabel')} type="text" fullWidth variant="outlined" multiline rows={6} error={!!supportErrors.message} helperText={supportErrors.message?.message} />)} />
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={handleFecharSuporte}>{t('layout.supportDialog.cancelButton')}</Button>
//               <Button type="submit" variant="contained" disabled={enviandoSuporte}>{enviandoSuporte ? <CircularProgress size={24} color="inherit" /> : t('layout.supportDialog.sendButton')}</Button>
//             </DialogActions>
//           </form>
//         </Dialog>
//         <ConversionModal open={modalConversaoAberto} onClose={() => setModalConversaoAberto(false)} />
//       </Box>
//     </ShowcaseProvider>
//   );
// }
