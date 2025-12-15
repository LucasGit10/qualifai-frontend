import { Box, TextField, Button, Grid } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

export const float = keyframes`
  0% { transform: translate(0px, 0px); }
  50% { transform: translate(20px, -20px); }
  100% { transform: translate(0px, 0px); }
`;

export const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const gradientText = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export const PageWrapper = styled(Box)({
  position: 'relative',
  minHeight: '100vh',
  backgroundColor: '#0f0518',
  overflowX: 'hidden',
  color: '#e2e8f0',
  paddingBottom: '8rem',
});

export const BackgroundOrb = styled(Box)(({ top, left, right, bottom, color, size, delay }) => ({
  position: 'fixed',
  top: top,
  left: left,
  right: right,
  bottom: bottom,
  width: size,
  height: size,
  backgroundColor: color,
  borderRadius: '50%',
  filter: 'blur(120px)',
  opacity: 0.25,
  zIndex: 0,
  animation: `${float} 15s infinite ease-in-out`,
  animationDelay: delay || '0s',
  pointerEvents: 'none',
}));

export const GlassPanel = styled(Box)({
  position: 'relative',
  background: 'rgba(255, 255, 255, 0.02)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: 24,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  zIndex: 1,
});

export const GlassCardContainer = styled(GlassPanel)({
  padding: '1.75rem',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
  '&:hover': {
    background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
    borderColor: 'rgba(168, 85, 247, 0.4)',
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px -5px rgba(139, 92, 246, 0.15)',
  }
});

export const FilterItemContainer = styled(Box)(({ active }) => ({
  padding: '12px 16px',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  border: '1px solid transparent',
  backgroundColor: active ? 'rgba(168, 85, 247, 0.1)' : 'transparent',
  borderColor: active ? 'rgba(168, 85, 247, 0.3)' : 'transparent',
  marginBottom: '8px',
  '&:hover': {
    backgroundColor: active ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255, 255, 255, 0.03)',
    transform: 'translateX(6px)',
  },
  '&:active': {
    transform: 'scale(0.98) translateX(6px)',
  }
}));

export const SearchTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(20, 10, 30, 0.6)',
    borderRadius: '16px',
    color: '#fff',
    paddingRight: '8px',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    '& fieldset': { border: 'none' },
    '&:hover': { 
      backgroundColor: 'rgba(30, 15, 45, 0.8)',
      borderColor: 'rgba(255, 255, 255, 0.2)'
    },
    '&.Mui-focused': { 
      backgroundColor: 'rgba(20, 10, 30, 0.9)',
      borderColor: '#a855f7',
      boxShadow: '0 0 0 4px rgba(168, 85, 247, 0.15)' 
    }
  }
});

export const CategoryButtonStyled = styled(Button)(({ active }) => ({
  minWidth: '110px',
  height: '90px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  borderRadius: '20px',
  border: active ? '1px solid #c084fc' : '1px solid rgba(255, 255, 255, 0.05)',
  background: active 
    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(217, 70, 239, 0.25))' 
    : 'rgba(255, 255, 255, 0.02)',
  color: active ? '#fff' : 'rgba(255, 255, 255, 0.6)',
  backdropFilter: 'blur(10px)',
  textTransform: 'none',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  flexShrink: 0,
  '&:hover': {
    transform: 'translateY(-3px)',
    background: active 
      ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(217, 70, 239, 0.4))' 
      : 'rgba(255, 255, 255, 0.08)',
    borderColor: '#a855f7',
    boxShadow: '0 10px 25px -5px rgba(168, 85, 247, 0.3)',
  },
  '&:active': {
    transform: 'scale(0.95)',
  }
}));

export const AnimatedGridItem = styled(Grid)(({ index }) => ({
  animation: `${fadeInUp} 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards`,
  animationDelay: `${index * 0.1}s`,
  opacity: 0,
}));