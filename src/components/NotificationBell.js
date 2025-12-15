import React, { useState, useEffect } from 'react';
import { Bell, X, Calendar, CheckCircle, Clock, Video } from 'lucide-react';
import {
  Badge,
  IconButton,
  Menu,
  Typography,
  Box,
  Button,
  Chip,
  Alert,
  useTheme
} from '@mui/material';
import api from '../services/api';
import { useSocket } from '../contexts/SocketContext';

const NotificationBell = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const {
    notifications,
    markAsRead,
    markAllAsRead,
    isConnected,
    unreadCount
  } = useSocket();


  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notifications', {
        params: {
          limit: 50,
          unreadOnly: false,
          types: ['event_reminder', 'meeting_alert', 'meeting_scheduled', 'meeting_updated', 'meeting_cancelled']
        }
      });

      const notificationsData = response.data.notifications || [];
      console.log('Loaded notifications:', notificationsData.length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = (notification) => {
  console.log('🖱️ Notificação clicada - DEBUG:', {
    notification,
    id: notification.id,
    _id: notification._id,
    stringId: String(notification.id),
    string_id: String(notification._id)
  });

  const notificationId = notification._id || notification.id;
  
  if (!notificationId || notificationId === 'undefined' || notificationId === 'null') {
    console.error('❌ ID inválido na notificação:', notificationId);
    return;
  }

  console.log('✅ ID válido encontrado:', notificationId);
  markAsRead(notificationId);
  
  if (notification.event?.meetLink) {
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
        color: theme.palette.mode === 'dark' ? 'white' : 'black',
        position: 'relative',
        '&:hover': {
          backgroundColor: theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.08)'
            : 'rgba(0, 0, 0, 0.04)'
        }
      }}
    >
      <Badge
        badgeContent={unreadCount > 0 ? unreadCount : null}
        color="error"
        max={99}
      >
        <Bell
          size={24}
          color={theme.palette.mode === 'dark' ? 'white' : 'black'}
        />
      </Badge>

      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: isConnected ? '#4caf50' : '#f44336',
          border: `1px solid ${theme.palette.background.paper}`
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
            ? 'rgba(25, 25, 35, 0.85)'
            : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${
            theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.1)'
          }`,
          boxShadow: theme.palette.mode === 'dark'
            ? '0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(255, 255, 255, 0.05)'
            : '0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)',
          borderRadius: '16px',
          overflow: 'hidden'
        }
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <Box
        sx={{
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(100, 100, 255, 0.1) 0%, rgba(255, 100, 255, 0.05) 100%)'
            : 'linear-gradient(135deg, rgba(100, 100, 255, 0.08) 0%, rgba(255, 100, 255, 0.04) 100%)',
          p: 2,
          borderBottom: `1px solid ${
            theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.08)'
          }`
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography 
            variant="h6" 
            fontWeight="bold" 
            color="text.primary"
            sx={{
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #fff 0%, #aaa 100%)'
                : 'linear-gradient(135deg, #000 0%, #444 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Notificações {unreadCount > 0 && `(${unreadCount})`}
          </Typography>
          {unreadCount > 0 && (
            <Button
              size="small"
              onClick={markAllAsRead}
              startIcon={<CheckCircle size={16} />}
              color="primary"
              variant="outlined"
              sx={{
                borderRadius: '12px',
                border: `1px solid ${
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.2)'
                    : 'rgba(0, 0, 0, 0.2)'
                }`,
                background: theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(255, 255, 255, 0.9)'
                }
              }}
            >
              Limpar todas
            </Button>
          )}
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

      <Box sx={{ maxHeight: 350, overflow: 'auto', p: 1 }}>
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
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              sx={{
                position: 'relative',
                borderRadius: '12px',
                p: 2,
                mb: 1,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: `1px solid ${
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(0, 0, 0, 0.05)'
                }`,
                background: notification.isRead
                  ? theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.02)'
                    : 'rgba(255, 255, 255, 0.4)'
                  : theme.palette.mode === 'dark'
                    ? 'rgba(100, 100, 255, 0.1)'
                    : 'rgba(100, 100, 255, 0.08)',
                '&:hover': {
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(255, 255, 255, 0.7)',
                  transform: 'translateY(-1px)',
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                    : '0 4px 12px rgba(0, 0, 0, 0.1)'
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '4px',
                  background: getNotificationColor(notification.type),
                  borderTopLeftRadius: '12px',
                  borderBottomLeftRadius: '12px'
                }
              }}
            >
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box
                  sx={{
                    color: getNotificationColor(notification.type),
                    flexShrink: 0,
                    mt: 0.5
                  }}
                >
                  {getNotificationIcon(notification.type)}
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography 
                      variant="subtitle2" 
                      fontWeight="600" 
                      color="text.primary"
                      sx={{ lineHeight: 1.2 }}
                    >
                      {notification.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getPriorityChip(notification.priority)}
                    </Box>
                  </Box>

                  <Typography 
                    variant="body2" 
                    color="text.primary" 
                    sx={{ 
                      mb: 1.5,
                      lineHeight: 1.4,
                      whiteSpace: 'pre-line',
                      wordBreak: 'break-word'
                    }}
                  >
                    {notification.message}
                  </Typography>

                  {notification.event && (
                    <Box 
                      sx={{ 
                        mt: 1.5,
                        p: 1.5,
                        borderRadius: '8px',
                        background: theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.05)'
                          : 'rgba(0, 0, 0, 0.03)',
                        border: `1px solid ${
                          theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.1)'
                            : 'rgba(0, 0, 0, 0.08)'
                        }`
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Clock
                          size={14}
                          color={theme.palette.mode === 'dark' ? '#ccc' : '#666'}
                        />
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
                            if (notification.event?.meetLink) {
                              window.open(notification.event.meetLink, '_blank', 'noopener,noreferrer');
                            }
                          }}
                          variant="outlined"
                          sx={{
                            borderRadius: '8px',
                            border: `1px solid ${
                              theme.palette.mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.2)'
                                : 'rgba(0, 0, 0, 0.2)'
                            }`,
                            background: theme.palette.mode === 'dark'
                              ? 'rgba(255, 255, 255, 0.05)'
                              : 'rgba(255, 255, 255, 0.8)',
                            '&:hover': {
                              background: theme.palette.mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.1)'
                                : 'rgba(255, 255, 255, 0.9)'
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
                    sx={{ 
                      display: 'block', 
                      mt: 1.5,
                      opacity: 0.7,
                      fontSize: '0.7rem'
                    }}
                  >
                    {formatTime(notification.timestamp || notification.createdAt)}
                  </Typography>
                </Box>
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