import { Paper, Typography, Box, useTheme, alpha } from '@mui/material';

export default function ChartPaper({ title, children }) {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        p: 3,
        height: 380,
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: 3,
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: alpha(theme.palette.primary.main, 0.3),
        }
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{ 
          color: theme.palette.text.primary, 
          fontWeight: 600,
          mb: 2
        }}
      >
        <Box
          component="span"
          sx={{
            position: 'relative',
            paddingBottom: '8px',
            '&:after': {
              content: '""',
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: '100%',
              height: '3px',
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              borderRadius: '2px',
            },
            flexGrow: 1,
            outline: 'none',
            '& *': {
              outline: 'none !important',
              boxShadow: 'none !important',
            },
          }}
        >
          {title}
        </Box>
      </Typography>
      <Box sx={{ flexGrow: 1 }}>{children}</Box>
    </Paper>
  );
}