import { useCallback, useEffect } from 'react';
import api from 'services/api';

/**
 * Retorna a função que solicita permissão de notificação via OneSignal.
 * Deve ser chamada APÓS o usuário interagir com o banner customizado.
 */
function useOneSignal() {
  // Sincroniza automaticamente se já tiver permissão
  useEffect(() => {
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async function (OneSignal) {
      if (OneSignal.Notifications.permission) {
        console.log('[OneSignal] Permissão já capturada, verificando ID de inscrição...');
        
        // Tenta pegar o ID
        const subscriptionId = OneSignal.User.PushSubscription.id;
        if (subscriptionId) {
          console.log('[OneSignal] ✅ ID encontrado no boot:', subscriptionId);
          try {
            await api.post('/notifications/subscription', { subscriptionId });
          } catch (e) {}
        }
      }
    });
  }, []);

  const requestPermission = useCallback(async () => {
    console.log('[OneSignal] Iniciando solicitação de permissão...');
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async function (OneSignal) {
      try {
        console.log('[OneSignal] Estado atual da permissão:', OneSignal.Notifications.permissionNative);
        
        await OneSignal.Notifications.requestPermission();
        
        // Função para tentar capturar e enviar o ID
        const captureAndSync = async (retryCount = 0) => {
          const subscriptionId = OneSignal.User.PushSubscription.id;
          
          if (subscriptionId) {
            console.log('[OneSignal] ✅ Subscription ID obtido:', subscriptionId);
            try {
              await api.post('/notifications/subscription', { subscriptionId });
              console.log('[OneSignal] ✅ ID sincronizado com o backend.');
            } catch (err) {
              console.error('[OneSignal] ❌ Erro na sincronização:', err.response?.data || err.message);
            }
          } else if (retryCount < 3) {
            console.log(`[OneSignal] ⏳ Aguardando ID... (tentativa ${retryCount + 1})`);
            setTimeout(() => captureAndSync(retryCount + 1), 2000);
          } else {
            console.warn('[OneSignal] ⚠️ Não foi possível obter o ID após 3 tentativas. Verifique se o HTTPS está ativo ou se o Service Worker falhou.');
          }
        };

        captureAndSync();

      } catch (err) {
        console.error('[OneSignal] ❌ Erro no fluxo de permissão:', err);
      }
    });
  }, []);

  return { requestPermission };
}

export default useOneSignal;
