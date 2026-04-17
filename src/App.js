import React, { useState, useMemo, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { lightTheme, darkTheme } from './utils/theme';
import api from 'services/api'; 
import { useAuthStore } from 'stores/authStore';
import useFacebookSdk from 'services/useFacebookSdk';
import useOneSignal from 'hooks/useOneSignal';
import NotificationPrompt from 'components/NotificationPrompt';
import { createRouter } from 'routes';
import { USE_MOCKS } from 'config/env';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';

import { SocketProvider } from 'contexts/SocketContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  const { isAuthenticated } = useAuthStore();
  useFacebookSdk();
  const { requestPermission } = useOneSignal();

  const [mode, setMode] = useState(() => localStorage.getItem('themeMode') || 'dark');
  
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  useEffect(() => {
    if (isAuthenticated && !USE_MOCKS) {
      const fetchAndSetTheme = async () => {
        try {
          const response = await api.get('/auth/theme');
          const dbTheme = response.data.theme;
          if (dbTheme && dbTheme !== mode) {
            setMode(dbTheme);
          }
        } catch (error) {
          console.error("Falha ao buscar tema do usuário:", error);
        }
      };
      fetchAndSetTheme();
    }
  }, [isAuthenticated, mode]);

  const toggleColorMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      if (isAuthenticated && !USE_MOCKS) {
        api.patch('/auth/theme', { theme: newMode })
           .catch(err => console.error("Falha ao salvar tema no BD:", err));
      }
      return newMode;
    });
  };

  const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);
  
  const router = createRouter(isAuthenticated, toggleColorMode);

  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
        <ThemeProvider theme={theme}>
          <SocketProvider>
            <CssBaseline />
            <RouterProvider router={router} />
            <ToastContainer 
              theme={mode}
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
            {isAuthenticated && (
              <NotificationPrompt onAllow={requestPermission} />
            )}
          </SocketProvider>
        </ThemeProvider>
      </LocalizationProvider>
    </QueryClientProvider>
  );
}

export default App;