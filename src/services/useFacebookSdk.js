import React, { useState, useEffect } from 'react';

const FacebookLoginButton = () => {
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);

  useEffect(() => {
    // Se o SDK já foi carregado, não faz nada
    if (document.getElementById('facebook-jssdk')) {
      setIsSdkLoaded(true);
      return;
    }

    // Define a função que o SDK chamará quando estiver pronto
    window.fbAsyncInit = function() {
      window.FB.init({
        appId      : '1720465665330010', // Substitua pelo ID do seu App
        cookie     : true,
        xfbml      : true,
        version    : 'v20.0' // Use a versão mais recente
      });
      
      // Atualiza o estado para indicar que o SDK está pronto
      setIsSdkLoaded(true); 
    };

    // Injeta o script do SDK na página
    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "https://connect.facebook.net/pt_BR/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));

  }, []); // Garante que o efeito rode apenas uma vez

  const handleLoginClick = () => {
    if (!isSdkLoaded) return; // Segurança extra

    window.FB.login(function(response) {
      if (response.authResponse) {
        console.log('Login bem-sucedido!', response);
        // Aqui você pode usar a resposta, ex: response.authResponse.accessToken
      } else {
        console.log('Login cancelado ou falhou.');
      }
    }, {scope: 'email,public_profile'}); // Permissões que você precisa
  };

  return (
    <button onClick={handleLoginClick} disabled={!isSdkLoaded}>
      {isSdkLoaded ? 'Entrar com Facebook' : 'Carregando...'}
    </button>
  );
};

export default FacebookLoginButton;