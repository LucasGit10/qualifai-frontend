import { styled, alpha } from '@mui/material/styles';

export const ColumnContainer = styled('div')(({ theme }) => ({
  minWidth: '320px',
  width: '320px',
  backgroundColor: alpha(theme.palette.background.paper, 0.95),
  borderRadius: '16px',
  padding: '16px',
  marginRight: '20px',
  boxShadow: theme.shadows[3], 
  display: 'flex',
  flexDirection: 'column',
  maxHeight: 'calc(100vh - 200px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
  backdropFilter: 'blur(12px)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[6], 
  }
}));

export const ColumnHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '16px',
  padding: '12px 16px',
  backgroundColor: alpha(theme.palette.primary.main, 0.08),
  borderRadius: '12px',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
}));

export const EmptyColumn = styled('div')(({ theme }) => ({
  height: '120px',
  border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: alpha(theme.palette.primary.main, 0.03),
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    borderColor: alpha(theme.palette.primary.main, 0.4)
  }
}));

export const BoardHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '32px',
  padding: '24px',
  borderRadius: '16px',
  backgroundColor: theme.palette.background.paper, 
  boxShadow: theme.shadows[2] 
}));

export const BoardContainer = styled('div')(({ theme }) => ({
  padding: '32px',
  backgroundColor: theme.palette.background.default, 
  minHeight: '100vh',
  backgroundImage: 'radial-gradient(at 40% 20%, hsla(28,100%,74%,0.1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,0.1) 0px, transparent 50%)'
}));