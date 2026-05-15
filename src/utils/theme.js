import { createTheme, alpha } from '@mui/material';

const getComponentStyles = (palette) => ({
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out',
        '&::-webkit-scrollbar': { width: '8px', height: '8px' },
        '&::-webkit-scrollbar-track': { background: alpha(palette.background.default, 0.5) },
        '&::-webkit-scrollbar-thumb': { background: alpha(palette.text.primary, 0.2), borderRadius: '4px' },
        '&::-webkit-scrollbar-thumb:hover': { background: alpha(palette.text.primary, 0.4) },
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: ({ ownerState, theme }) => ({
        borderRadius: 50,
        textTransform: 'none',
        fontWeight: 700,
        padding: '10px 20px',
        ...(ownerState.variant === 'text' && ownerState.color === 'primary' && theme.palette.mode === 'dark' && {
          color: theme.palette.secondary.main,
          '&:hover': {
            backgroundColor: alpha(theme.palette.secondary.main, theme.palette.action.hoverOpacity),
          },
        }),
      }),
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundColor: alpha(palette.background.paper, 0.8),
        backdropFilter: 'blur(10px)',
        boxShadow: 'none',
        borderBottom: `1px solid ${palette.divider}`,
        color: palette.text.primary,
        transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out',
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        border: `1px solid ${palette.divider}`,
        transition: 'background-color 0.3s ease-in-out, border-color 0.3s ease-in-out',
      },
    },
  },
});

const darkPalette = {
  mode: 'dark',
  primary: { main: '#2575FC', light: '#6a9eff', dark: '#004dc8', contrastText: '#e2d6ff' },
  secondary: { main: '#D76D77', light: '#ff9da6', dark: '#a23f4c', contrastText: '#e2d6ff' },
  hover:{main: '#3a1c71', light: '#6a4a9d', dark: '#281350', contrast: '#281350'},
  switch: {main: '#6a4a9d', light: '#3a1c71', dark: '#281350', contrastText: '#e2d6ff'},
  accent: { main: '#6A11CB', contrastText: '#e2d6ff' },
  background: {
    default: '#0a071a',
    paper: '#1c1633',
    gradient: 'linear-gradient(135deg, #0a071a 0%, #1c1633 100%)',
  },
  text: { primary: '#e2d6ff', secondary: '#b3a2d8' },
  divider: 'rgba(226, 214, 255, 0.12)',
  custom: {
    logos: {
      full: '/logo-dark.png',
    },
    gradients: {
      background: 'linear-gradient(135deg, #0a071a 0%, #1c1633 100%)',
      button: 'linear-gradient(135deg, #2575FC 0%, #6A11CB 100%)',
      text: 'linear-gradient(90deg, #e2d6ff, #D76D77)'
    },
    glass: {
      light: 'rgba(226, 214, 255, 0.1)',
      medium: 'rgba(226, 214, 255, 0.3)',
      dark: 'rgba(30, 25, 60, 0.8)'
    },
    pink: {
      500: '#D76D77'
    }
  }
};

export const darkTheme = createTheme({
  palette: darkPalette,
  typography: { fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif' },
  components: getComponentStyles(darkPalette),
});

// =================================================================================
// --- TEMA CLARO ---
// =================================================================================

const lightPalette = {
  mode: 'light',
  primary: { main: '#6D28D9', light: '#8B5CF6', dark: '#5B21B6', contrastText: '#1F2937' },
  secondary: { main: '#EC4899', light: '#F472B6', dark: '#DB2777', contrastText: '#1F2937' },
  hover:{main: '#3a1c71', light: '#6a4a9d', dark: '#281350', contrast: '#e2d6ff'},
  switch: { main: '#6D28D9', light: '#8B5CF6', dark: '#5B21B6', contrastText: '#1F2937' },
  accent: { main: '#10B981', contrastText: '#1F2937' },
  background: {
    default: '#F3F4F6',
    paper: '#FFFFFF',
    // --- CORREÇÃO AQUI ---
    gradient: 'linear-gradient(135deg, #FFFFFF 0%, #E5E7EB 100%)',
  },
  text: { primary: '#1F2937', secondary: '#6B7280' },
  divider: 'rgba(0, 0, 0, 0.12)',
  custom: {
    logos: {
      full: '/logo-light.png',
    },
    gradients: {
      background: 'linear-gradient(135deg, #FFFFFF 0%, #E5E7EB 100%)',
      button: 'linear-gradient(135deg, #6D28D9 0%, #EC4899 100%)',
      text: 'linear-gradient(90deg, #5B21B6, #EC4899)'
    },
    glass: {
      light: 'rgba(0, 0, 0, 0.05)',
      medium: 'rgba(0, 0, 0, 0.1)',
      dark: 'rgba(255, 255, 255, 0.7)'
    },
    pink: {
      500: '#EC4899'
    }
  }
};

export const lightTheme = createTheme({
  palette: lightPalette,
  typography: { fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif' },
  components: getComponentStyles(lightPalette),
});