import { Card, CardContent, Typography, Box, Avatar, useTheme, alpha } from '@mui/material';

export default function StatCard({ title, value, icon, color, subtitle }) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: 3,
        transition: 'all 0.3s ease',
        '&:hover': { 
          borderColor: alpha(theme.palette.primary.main, 0.5),
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.37)'
        },
        overflow: 'hidden',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Conteúdo de texto */}
        <Box>
          <Typography 
            color="textSecondary" 
            gutterBottom 
            variant="h6"
            sx={{ fontSize: '0.9rem', opacity: 0.8 }}
          >
            {title}
          </Typography>
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              fontWeight: 700,
              color: theme.palette.text.primary, // REMOVIDO GRADIENTE
            }}
          >
            {value}
          </Typography>
          {subtitle && (
            <Typography 
              color="textSecondary" 
              variant="body2"
              sx={{ mt: 1, opacity: 0.7 }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {/* Avatar fixo no canto inferior direito */}
        <Avatar
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            bgcolor: alpha(color, 0.2),
            color: color,
            width: 56,
            height: 56,
            border: `1px solid ${alpha(color, 0.3)}`,
            backdropFilter: 'blur(5px)',
            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.2)',
            '& svg': {
              width: '60%',
              height: '60%',
            },
          }}
        >
          {icon}
        </Avatar>
      </CardContent>
    </Card>
  );
}