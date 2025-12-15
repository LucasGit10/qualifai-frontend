import React from 'react';
import { Button } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';

function FacebookLoginButton({ onSuccess, onFailure }) {
  const handleFacebookLogin = () => {
    if (!window.FB) {
      console.error('Facebook SDK não carregado');
      return;
    }

    window.FB.login(
      (response) => {
        if (response.authResponse) {
          window.FB.api('/me', { fields: 'id,name,email' }, function (userData) {
            onSuccess?.(userData);
          });
        } else {
          onFailure?.('Usuário cancelou ou negou permissão');
        }
      },
      { scope: 'email,public_profile' }
    );
  };

  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<FacebookIcon />}
      onClick={handleFacebookLogin}
      sx={{
        backgroundColor: '#1877F2',
        '&:hover': { backgroundColor: '#145dbf' }
      }}
    >
      Entrar com Facebook
    </Button>
  );
}

export default FacebookLoginButton;
