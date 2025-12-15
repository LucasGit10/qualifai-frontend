import { styled, keyframes } from '@mui/material/styles';
import { Box, List, Button } from '@mui/material';

export const LARGURA_MENU = 260;
export const LARGURA_MENU_MINIMIZADO = 70;

export const fadeInOut = keyframes`
  0% { opacity: 0; transform: translateY(-5px); }
  50% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(5px); }
`;

export const moveOrb1 = keyframes`
  0% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(60vw, -30vh) scale(1.2); }
  50% { transform: translate(20vw, 40vh) scale(0.9); }
  75% { transform: translate(-40vw, -20vh) scale(1.3); }
  100% { transform: translate(0, 0) scale(1); }
`;

export const moveOrb2 = keyframes`
  0% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(-50vw, 40vh) scale(0.8); }
  50% { transform: translate(30vw, -10vh) scale(1.1); }
  75% { transform: translate(10vw, -50vh) scale(1.2); }
  100% { transform: translate(0, 0) scale(1); }
`;

export const ToggleContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : theme.palette.grey[200],
  borderRadius: theme.shape.borderRadius,
  padding: '4px',
  overflow: 'hidden',
}));

export const SlidingPill = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '4px',
  left: '4px',
  width: 'calc(50% - 2px)',
  height: 'calc(100% - 8px)',
  backgroundColor: theme.palette.primary.main,
  borderRadius: theme.shape.borderRadius,
  transition: 'transform 0.3s ease-in-out',
  zIndex: 1,
}));

export const ToggleButton = styled(Button)(({ theme }) => ({
  flex: 1,
  zIndex: 2,
  color: theme.palette.text.primary,
  '&.Mui-active': {
    color: theme.palette.primary.contrastText,
  },
}));

export const ScrollableList = styled(List)({
  flexGrow: 1,
  overflowY: 'auto',
  scrollbarWidth: 'thin',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent',
  },
});

