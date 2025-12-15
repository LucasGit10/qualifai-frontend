import { Paper, Typography, List, ListItem, ListItemText, ListItemIcon, Avatar, useTheme, Box, alpha } from '@mui/material';
import { Chat as ChatIcon, FiberNew as FiberNewIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

export default function RecentActivities({ activities }) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Paper
      sx={{
        height: 380,
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      }}
    >
      {/* Título fixo */}
      <Box sx={{ 
        p: 2.5, 
        borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        background: alpha(theme.palette.primary.main, 0.05)
      }}>
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 600,
            display: 'inline-block',
            position: 'relative',
            paddingBottom: '4px',
            '&:after': {
              content: '""',
              display: 'block',
              width: '100%',
              height: '3px',
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              marginTop: '4px',
              borderRadius: '2px'
            }
          }}
        >
          {t('dashboard.recentActivities.title')}
        </Typography>
      </Box>

      {/* Lista rolando sem scroll visível */}
      <Box
        sx={{
          overflowY: 'auto',
          flex: 1,
          p: 2,
          // Esconde a barra de scroll
          '&::-webkit-scrollbar': { width: 0, height: 0 },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <List disablePadding>
          {activities?.map((activity, index) => (
            <ListItem
              key={activity.id}
              disablePadding
              sx={{
                mb: 1.5,
                p: 2,
                background: alpha(theme.palette.background.paper, 0.1),
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: alpha(theme.palette.primary.main, 0.1),
                  borderLeft: `3px solid ${theme.palette.primary.main}`,
                  transform: 'translateX(4px)',
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 48 }}>
                <Avatar
                  sx={{
                    bgcolor: activity.type === 'lead' ? 
                      alpha(theme.palette.primary.main, 0.2) : 
                      alpha(theme.palette.secondary.main, 0.2),
                    color: activity.type === 'lead' ? 
                      theme.palette.primary.main : 
                      theme.palette.secondary.main,
                    width: 40,
                    height: 40,
                    border: `1px solid ${activity.type === 'lead' ? 
                      alpha(theme.palette.primary.main, 0.3) : 
                      alpha(theme.palette.secondary.main, 0.3)}`,
                  }}
                >
                  {activity.type === 'lead' ? <FiberNewIcon fontSize="small" /> : <ChatIcon fontSize="small" />}
                </Avatar>
              </ListItemIcon>

              <ListItemText
                primary={
                  <Typography sx={{ 
                    color: theme.palette.text.primary, 
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}>
                    {activity.title}
                  </Typography>
                }
                secondary={
                  <Typography sx={{ 
                    color: theme.palette.text.secondary, 
                    fontSize: '0.8rem',
                    mt: 0.5
                  }}>
                    {`${activity.description} • ${format(new Date(activity.timestamp), 'dd/MM, HH:mm')}`}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Paper>
  );
}