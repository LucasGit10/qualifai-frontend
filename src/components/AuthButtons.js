import { Button, Box } from '@mui/material';
import { Lock, PersonAdd } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AuthButtons = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 1200,
        display: 'flex',
        gap: 2,
      }}
    >
      <Button
        variant="contained"
        onClick={() => navigate('/login')}
        sx={{
          borderRadius: 50,
          px: 3,
          py: 1,
          textTransform: 'none',
          fontWeight: 700,
          fontSize: '0.95rem',
          border: '2px solid rgba(226, 214, 255, 0.3)',
          background: 'linear-gradient(135deg, #3a1c71 0%, #d76d77 100%)',
          boxShadow: '0 4px 15px rgba(58, 28, 113, 0.4)',
          color: '#fff',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          '&:hover': {
            background: 'linear-gradient(135deg, #3a1c71 0%, #d76d77 70%)',
            boxShadow: '0 6px 20px rgba(58, 28, 113, 0.6)',
            transform: 'translateY(-2px)',
          },
        }}
      >
        <PersonAdd fontSize="small" />
        Entrar
      </Button>
    </Box>
  );
};

export default AuthButtons;