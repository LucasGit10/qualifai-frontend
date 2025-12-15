import { useState, useEffect, useRef } from 'react';

export const useWebSocket = () => {
  const [lastMessage, setLastMessage] = useState(null);
  const ws = useRef(null);

  useEffect(() => {
    const connectWebSocket = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}`;
      
      ws.current = new WebSocket(wsUrl);
      
      ws.current.onopen = () => {
        console.log('WebSocket connected');
      };

      ws.current.onmessage = (event) => {
        setLastMessage(event);
      };

      ws.current.onclose = () => {
        setTimeout(connectWebSocket, 3000);
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };

    connectWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  return { lastMessage };
};