import { useEffect, useState } from 'react';

const FACEBOOK_SDK_ID = 'facebook-jssdk';
const META_APP_ID = process.env.REACT_APP_META_APP_ID;
const META_GRAPH_API_VERSION = process.env.REACT_APP_META_GRAPH_API_VERSION || 'v26.0';

export default function useFacebookSdk() {
  const [isSdkReady, setIsSdkReady] = useState(Boolean(window.FB));

  useEffect(() => {
    if (!META_APP_ID) {
      setIsSdkReady(false);
      return undefined;
    }

    const initializeSdk = () => {
      if (!window.FB) return;

      window.FB.init({
        appId: META_APP_ID,
        autoLogAppEvents: true,
        cookie: true,
        xfbml: true,
        version: META_GRAPH_API_VERSION,
      });
      setIsSdkReady(true);
    };

    if (window.FB) {
      initializeSdk();
      return undefined;
    }

    const previousAsyncInit = window.fbAsyncInit;
    window.fbAsyncInit = () => {
      if (typeof previousAsyncInit === 'function') previousAsyncInit();
      initializeSdk();
    };

    let sdkScript = document.getElementById(FACEBOOK_SDK_ID);
    if (!sdkScript) {
      sdkScript = document.createElement('script');
      sdkScript.id = FACEBOOK_SDK_ID;
      sdkScript.async = true;
      sdkScript.defer = true;
      sdkScript.crossOrigin = 'anonymous';
      sdkScript.src = 'https://connect.facebook.net/pt_BR/sdk.js';
      document.body.appendChild(sdkScript);
    }

    return undefined;
  }, []);

  return isSdkReady;
}
