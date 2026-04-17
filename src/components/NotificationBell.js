import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, X, Calendar, CheckCircle, Clock, Video, Zap, Trash2 } from 'lucide-react';
import api from '../services/api';
import {
  Badge,
  IconButton,
  Menu,
  Typography,
  Box,
  Button,
  Chip,
  Alert,
  useTheme,
  alpha
} from '@mui/material';
import { USE_MOCKS } from '../config/env';
import { MOCK_NOTIFICATIONS } from '../mocks';
import { useSocket } from '../contexts/SocketContext';

// ==========================================
// MOCKS (Simulando o Socket e a API)
// ==========================================
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const NotificationBell = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingTest, setLoadingTest] = useState(false); // Adicionado
  const theme = useTheme();
  const navigate = useNavigate();

  // Função para disparar notificação de teste integrada
  const handleTestNotification = async (e) => {
    e.stopPropagation();
    try {
      setLoadingTest(true);
      await api.post('/notifications/test');
      
      // Recarrega a lista para garantir que mesmo com delay no socket apareça na lista
      setTimeout(() => {
        loadNotifications();
      }, 500);
    } catch (error) {
      console.error('Erro ao disparar teste:', error);
    } finally {
      setLoadingTest(false);
    }
  };

  // ------------------------------------------------------------------
  // INTEGRAÇÃO REAL COM O SOCKET CONTEXT
  // ------------------------------------------------------------------
  const { 
    notifications: socketNotifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    deleteAllNotifications, // Novo
    isConnected, 
    unreadCount 
  } = useSocket();
  
  const [localNotifications, setLocalNotifications] = useState([]);
  
  // Decidir se usa mock ou real
  const notifications = USE_MOCKS ? localNotifications : socketNotifications;
  // ------------------------------------------------------------------

  useEffect(() => {
    if (USE_MOCKS) {
      loadNotifications();
    }
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      await delay(800); // Simulando tempo de rede
      setLocalNotifications(MOCK_NOTIFICATIONS);
      console.log('Loaded mock notifications:', MOCK_NOTIFICATIONS.length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = (notification) => {
    const notificationId = notification._id || notification.id;
    
    if (notificationId) {
      markAsRead(notificationId);
    }
    
    // Redirecionamento baseado no link salvo na notificação
    if (notification.link) {
      navigate(notification.link);
    } else if (notification.event?.meetLink) {
      window.open(notification.event.meetLink, '_blank');
    }

    handleClose();
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted');
        }
      });
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'event_reminder':
      case 'meeting_alert':
        return <Calendar size={18} />;
      case 'meeting_scheduled':
        return <Video size={18} />;
      case 'meeting_updated':
        return <Clock size={18} />;
      case 'meeting_cancelled':
        return <X size={18} />;
      default:
        return <Bell size={18} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'event_reminder':
        return '#1976d2';
      case 'meeting_alert':
        return '#ed6c02';
      case 'meeting_scheduled':
        return '#2e7d32';
      case 'meeting_updated':
        return '#0288d1';
      case 'meeting_cancelled':
        return '#d32f2f';
      default:
        return '#757575';
    }
  };

  const getPriorityChip = (priority) => {
    const priorityConfig = {
      low: { label: 'Baixa', color: 'default' },
      medium: { label: 'Média', color: 'primary' },
      high: { label: 'Alta', color: 'secondary' },
      urgent: { label: 'Urgente', color: 'error' }
    };

    const config = priorityConfig[priority] || priorityConfig.medium;

    return (
      <Chip
        size="small"
        label={config.label}
        color={config.color}
        variant="outlined"
      />
    );
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date - now;
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 0) {
      return 'Há ' + Math.abs(diffMins) + ' min';
    } else if (diffMins < 60) {
      return `Em ${diffMins} min`;
    } else if (diffMins < 1440) {
      return `Em ${Math.floor(diffMins / 60)}h`;
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    requestNotificationPermission();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
  <div>
    <IconButton
      onClick={handleClick}
      sx={{
        position: 'relative',
        borderRadius: '12px',
        width: 40,
        height: 40,
        background: unreadCount > 0
          ? 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.15))'
          : 'rgba(255, 255, 255, 0.06)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: unreadCount > 0
          ? '1px solid rgba(99,102,241,0.4)'
          : '1px solid rgba(255,255,255,0.1)',
        boxShadow: unreadCount > 0
          ? '0 0 16px rgba(99,102,241,0.25)'
          : 'none',
        color: 'white',
        transition: 'all 0.25s ease',
        '&:hover': {
          background: 'rgba(255, 255, 255, 0.12)',
          border: '1px solid rgba(255,255,255,0.2)',
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        }
      }}
    >
      <Badge
        badgeContent={unreadCount > 0 ? unreadCount : null}
        color="error"
        max={99}
        sx={{
          '& .MuiBadge-badge': {
            fontSize: '0.65rem',
            minWidth: 16,
            height: 16,
            padding: '0 4px',
          }
        }}
      >
        <Bell
          size={20}
          color="white"
        />
      </Badge>

      {/* Indicador de conexão — pontinho discreto */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 6,
          right: 6,
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: isConnected ? '#4ade80' : '#f87171',
          boxShadow: isConnected ? '0 0 6px #4ade80' : '0 0 6px #f87171',
        }}
      />
    </IconButton>

    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: 420,
          maxHeight: 500,
          mt: 1,
          background: theme.palette.mode === 'dark'
            ? 'rgba(18, 18, 30, 0.85)'
            : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid',
          borderColor: theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.1)',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 24px 64px rgba(0,0,0,0.5)'
            : '0 24px 64px rgba(0,0,0,0.1)',
          borderRadius: 3,
          overflow: 'hidden',
          backgroundImage: 'none',
        }
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <Box
        sx={{
          p: 2,
          pb: 1.5,
          borderBottom: `1px solid ${
            theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(0, 0, 0, 0.05)'
          }`
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography 
              variant="subtitle1" 
              fontWeight="600" 
              color="text.primary"
              sx={{ letterSpacing: '-0.2px' }}
            >
              Notificações
            </Typography>

            <Button
              size="small"
              onClick={handleTestNotification}
              disabled={loadingTest}
              variant="outlined"
              sx={{
                height: 24,
                fontSize: '0.65rem',
                textTransform: 'none',
                ml: 1,
                borderRadius: '8px',
                borderColor: alpha(theme.palette.primary.main, 0.3),
                color: 'primary.main',
                '&:hover': { background: alpha(theme.palette.primary.main, 0.05) }
              }}
              startIcon={<Zap size={10} />}
            >
              {loadingTest ? '...' : 'Testar'}
            </Button>

            {unreadCount > 0 && (
              <Chip 
                label={unreadCount}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)',
                  color: theme.palette.mode === 'dark' ? '#818cf8' : 'primary.main',
                  borderRadius: '6px'
                }}
              />
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {unreadCount > 0 && (
              <Button
                size="small"
                onClick={markAllAsRead}
                startIcon={<CheckCircle size={14} />}
                sx={{
                  fontSize: '0.75rem',
                  textTransform: 'none',
                  color: 'text.secondary',
                  '&:hover': { background: 'transparent', color: 'primary.main' },
                  minWidth: 'auto',
                  px: 1
                }}
              >
                Lidas
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                size="small"
                onClick={deleteAllNotifications}
                startIcon={<Trash2 size={14} />}
                sx={{
                  fontSize: '0.75rem',
                  textTransform: 'none',
                  color: 'text.secondary',
                  '&:hover': { background: 'transparent', color: 'error.main' },
                  minWidth: 'auto',
                  px: 1
                }}
              >
                Limpar
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      {!isConnected && (
        <Box sx={{ px: 2, pt: 1 }}>
          <Alert
            severity="warning"
            sx={{
              borderRadius: '12px',
              background: theme.palette.mode === 'dark'
                ? 'rgba(255, 152, 0, 0.1)'
                : 'rgba(255, 152, 0, 0.08)',
              border: `1px solid ${
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 152, 0, 0.3)'
                  : 'rgba(255, 152, 0, 0.2)'
              }`,
              fontSize: '0.75rem',
              py: 0.5
            }}
          >
            Conexão offline - reconectando...
          </Alert>
        </Box>
      )}

      {loading && (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography 
            color="text.secondary" 
            sx={{ 
              fontStyle: 'italic',
              opacity: 0.7
            }}
          >
            Carregando notificações...
          </Typography>
        </Box>
      )}

      <Box sx={{ maxHeight: 350, overflow: 'auto', p: 1, '&::-webkit-scrollbar': { display: 'none' }, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
        {notifications.length === 0 && !loading ? (
          <Box
            sx={{
              p: 4,
              textAlign: 'center',
              opacity: 0.6
            }}
          >
            <Bell
              size={32}
              color={theme.palette.mode === 'dark' ? '#666' : '#ccc'}
            />
            <Typography 
              color="text.secondary" 
              sx={{ mt: 1 }}
            >
              Nenhuma notificação
            </Typography>
          </Box>
        ) : (
          notifications.map((notification) => (
            <Box
              key={notification._id || notification.id}
              onClick={() => handleNotificationClick(notification)}
              onMouseEnter={() => {
                if (!notification.isRead) {
                  markAsRead(notification._id || notification.id);
                }
              }}
              sx={{
                position: 'relative',
                borderRadius: '12px',
                p: 2,
                mb: 0.5,
                cursor: 'pointer',
                transition: 'background 0.2s ease',
                border: 'none',
                background: notification.isRead
                  ? 'transparent'
                  : (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.03)'),
                boxShadow: 'none',
                display: 'flex',
                gap: 2,
                overflow: 'hidden',
                '&:hover': {
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.06)'
                }
              }}
            >
              {/* Unread indicator dot */}
              {!notification.isRead && (
                <Box sx={{
                  position: 'absolute', top: '50%', right: 16, transform: 'translateY(-50%)', width: 6, height: 6, borderRadius: '50%',
                  backgroundColor: '#818cf8', boxShadow: '0 0 10px rgba(129, 140, 248, 0.8)'
                }} />
              )}

              {/* Icon Container */}
              <Box
                sx={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 42, height: 42, borderRadius: '12px', flexShrink: 0,
                  background: alpha(getNotificationColor(notification.type), 0.1),
                  color: getNotificationColor(notification.type),
                  border: `1px solid ${alpha(getNotificationColor(notification.type), 0.2)}`
                }}
              >
                {getNotificationIcon(notification.type)}
              </Box>

              <Box sx={{ flex: 1, minWidth: 0, pt: 0.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                  <Typography 
                    variant="subtitle2" 
                    fontWeight="700" 
                    color="text.primary"
                    sx={{ pr: 3, letterSpacing: '-0.3px', display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    {notification.title}
                    {getPriorityChip(notification.priority)}
                  </Typography>

                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification._id || notification.id);
                    }}
                    sx={{
                      p: 0.5,
                      color: 'text.secondary',
                      '&:hover': { 
                        color: 'error.main',
                        background: alpha(theme.palette.error.main, 0.1)
                      }
                    }}
                  >
                    <Trash2 size={14} />
                  </IconButton>
                </Box>

                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 1.5,
                    lineHeight: 1.5,
                    whiteSpace: 'pre-line',
                    wordBreak: 'break-word',
                    fontSize: '0.82rem'
                  }}
                >
                  {notification.message}
                </Typography>

                {notification.event && (
                  <Box 
                    sx={{ 
                      mt: 1, p: 1.5, borderRadius: '10px',
                      background: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.03)',
                      border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.08)'}`
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: notification.event.meetLink ? 1.5 : 0 }}>
                      <Clock size={14} color={theme.palette.mode === 'dark' ? '#aaa' : '#666'} />
                      <Typography variant="caption" color="text.secondary" fontWeight="500">
                        {formatTime(notification.event.start)}
                      </Typography>
                    </Box>

                    {notification.event.meetLink && (
                      <Button
                        size="small"
                        startIcon={<Video size={14} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          window.open(notification.event.meetLink, '_blank', 'noopener,noreferrer');
                        }}
                        variant="outlined"
                        sx={{
                          borderRadius: '8px', fontSize: '0.75rem', py: 0.5,
                          borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
                          color: 'text.primary',
                          '&:hover': {
                            background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                          }
                        }}
                      >
                        Entrar na reunião
                      </Button>
                    )}
                  </Box>
                )}

                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  sx={{ display: 'block', mt: 1, opacity: 0.5, fontSize: '0.7rem', fontWeight: 600 }}
                >
                  {formatTime(notification.timestamp || notification.createdAt)}
                </Typography>
              </Box>
            </Box>
          ))
        )}
      </Box>
    </Menu>
  </div>
);
};

export default NotificationBell;