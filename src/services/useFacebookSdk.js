import React, { useState, useEffect } from 'react';

const FacebookLoginButton = () => {
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);

  useEffect(() => {
    if (document.getElementById('facebook-jssdk')) {
      setIsSdkLoaded(true);
      return;
    }

    window.fbAsyncInit = function() {
      window.FB.init({
        appId      : '1720465665330010',
        cookie     : true,
        xfbml      : true,
        version    : 'v20.0'
      });

      setIsSdkLoaded(true); 
    };

    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "https://connect.facebook.net/pt_BR/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));

  }, []);

  const handleLoginClick = () => {
    if (!isSdkLoaded) return;

    window.FB.login(function(response) {
      if (response.authResponse) {
        console.log('Login bem-sucedido!', response);
      } else {
        console.log('Login cancelado ou falhou.');
      }
    }, {scope: 'email,public_profile'});
  };

  return (
    <button onClick={handleLoginClick} disabled={!isSdkLoaded}>
      {isSdkLoaded ? 'Entrar com Facebook' : 'Carregando...'}
    </button>
  );
};

export default FacebookLoginButton;