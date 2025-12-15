import React from 'react';
import { Box, Typography, Card, CardContent, Avatar, useTheme, alpha } from '@mui/material';
import { Send as SendIcon, Forum as ForumIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

export default function WhatsappStatsBoard({ instances, conversations: conversationsData }) {
  const { t } = useTranslation();
  const theme = useTheme();

  if (!instances && !conversationsData) return null;
  
  const conversations = conversationsData?.conversations || [];
  const totalConversations = conversations.length;
  const activeConversations = conversations.filter(c => c.status === 'active').length;
  const closedConversations = totalConversations - activeConversations;

  const renderCard = ({ key, title, value, metric1, metric2, icon: Icon, iconColor }) => (
    <Card
      key={key}
      sx={{
        height: '100%',
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: 3,
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: alpha(theme.palette.primary.main, 0.3),
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.45)'
        },
        overflow: 'hidden',
      }}
    >
      {/* Efeito de brilho no hover */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${alpha(iconColor, 0.5)}, transparent)`,
          opacity: 0,
          transition: 'opacity 0.3s ease',
          '&:hover': {
            opacity: 1,
          },
        }}
      />

      <Avatar
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          bgcolor: alpha(iconColor, 0.15),
          color: iconColor,
          width: 56,
          height: 56,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `1px solid ${alpha(iconColor, 0.3)}`,
          backdropFilter: 'blur(5px)',
          boxShadow: `0 4px 20px 0 ${alpha(iconColor, 0.2)}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: `0 6px 25px 0 ${alpha(iconColor, 0.3)}`,
          },
          '& svg': {
            width: '60%',
            height: '60%',
          },
        }}
      >
        <Icon />
      </Avatar>

      <CardContent sx={{ 
        position: 'relative', 
        zIndex: 1, 
        p: 3,
        '&:last-child': {
          pb: 3
        }
      }}>
        <Typography 
          variant="h6"
          gutterBottom 
          sx={{ 
            fontSize: '0.9rem', 
            color: theme.palette.text.primary,
            opacity: 0.8,
            fontWeight: 500
          }}
        >
          {title}
        </Typography>
        
        <Typography 
          variant="h4" 
          component="h2" 
          sx={{ 
            fontWeight: 700,
            color: theme.palette.text.primary, // REMOVIDO GRADIENTE
            mb: 2,
            fontSize: { xs: '1.75rem', sm: '2rem' }
          }}
        >
          {value.toLocaleString()}
        </Typography>

        {(metric1 || metric2) && (
          <Box sx={{ 
            mt: 2, 
            display: 'flex', 
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            {[metric1, metric2].map((metric, idx) => (
              metric && (
                <Box
                  key={idx}
                  sx={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 2,
                    p: 2,
                    textAlign: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    transition: 'all 0.3s ease',
                    minHeight: '80px',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.08)',
                      borderColor: alpha(theme.palette.primary.main, 0.2),
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      opacity: 0.8,
                      fontSize: '0.75rem',
                      color: theme.palette.text.secondary,
                      fontWeight: 500,
                      mb: 0.5
                    }}
                  >
                    {metric.label}
                  </Typography>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 700,
                      color: theme.palette.text.primary, // REMOVIDO GRADIENTE
                      fontSize: { xs: '1.5rem', sm: '1.75rem' }
                    }}
                  >
                    {metric.value.toLocaleString()}
                  </Typography>
                </Box>
              )
            ))}
          </Box>
        )}
      </CardContent>

      {/* Efeito de brilho no canto */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '120px',
          height: '120px',
          background: `radial-gradient(circle at bottom right, ${alpha(iconColor, 0.1)}, transparent 70%)`,
          borderRadius: '50%',
          opacity: 0.6,
          filter: 'blur(10px)',
          zIndex: 0,
        }}
      />
    </Card>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 3,
        width: '100%',
        alignItems: 'stretch',
        flexDirection: { xs: 'column', md: 'row' }
      }}
    >
      {/* Card da Esquerda com os dados de Conversas */}
      <Box sx={{ 
        flex: 1, 
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {renderCard({
          key: 'conversations-card',
          title: t('dashboard.whatsappStats.initiatedConversations'),
          value: totalConversations,
          metric1: { 
            label: t('dashboard.whatsappStats.active'), 
            value: activeConversations 
          },
          metric2: { 
            label: t('dashboard.whatsappStats.others'), 
            value: closedConversations 
          },
          icon: ForumIcon,
          iconColor: theme.palette.mode === 'dark' ? '#60a5fa' : '#3b82f6',
        })}
      </Box>

      {/* Card da Direita com os dados das Instâncias */}
      {instances && instances.length > 0 && (
        <Box sx={{ 
          flex: 1, 
          minWidth: 0, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2 
        }}>
          {instances.map((inst) =>
            renderCard({
              key: inst._id,
              title: inst.instanceName,
              value: (inst.messagesSent || 0) + (inst.messagesReceived || 0),
              metric1: { 
                label: t('dashboard.whatsappStats.sent'), 
                value: inst.messagesSent || 0 
              },
              metric2: { 
                label: t('dashboard.whatsappStats.received'), 
                value: inst.messagesReceived || 0 
              },
              icon: SendIcon,
              iconColor: theme.palette.mode === 'dark' ? '#c084fc' : '#8b5cf6',
            })
          )}
        </Box>
      )}
    </Box>
  );
}