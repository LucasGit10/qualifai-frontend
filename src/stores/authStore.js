import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';
import { USE_MOCKS } from '../config/env';
import userPreferencesService from '../services/userPreferencesService';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: async (email, password) => {
        if (USE_MOCKS) {
          const mockUser = {
            _id: 'mock-admin-id',
            name: 'Dev Admin (Mock)',
            email: email || 'admin@qualifai.tech',
            role: 'admin',
            plan: 'pro'
          };
          const mockToken = 'mock-jwt-token-for-development';
          
          set({ user: mockUser, token: mockToken, isAuthenticated: true });
          api.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
          return { success: true };
        }

        try {
          const response = await api.post('/auth/login', { email, password });
          const { user, token } = response.data;
          
          set({ user, token, isAuthenticated: true });
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          try {
            await userPreferencesService.createDefaultPreferences(user._id);
          } catch (error) {
            console.log('⚠️ Preferências já existem ou erro ao criar:', error);
          }
          
          return { success: true };
        } catch (error) {
          return { 
            success: false, 
            error: error.response?.data?.message || 'Erro ao fazer login' 
          };
        }
      },

      register: async (userData) => {
        try {
          const response = await api.post('/auth/register', userData);
          const { user, token } = response.data;
          
          set({ user, token, isAuthenticated: true });
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          try {
            await userPreferencesService.createDefaultPreferences(user._id);
          } catch (error) {
            console.log('⚠️ Preferências já existem ou erro ao criar:', error);
          }
          
          return { success: true };
        } catch (error) {
          return { 
            success: false, 
            error: error.response?.data?.message || 'Erro ao criar conta' 
          };
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        delete api.defaults.headers.common['Authorization'];
      },

      updateUser: (userData) => {
        set((state) => ({ user: { ...state.user, ...userData } }));
      }
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
      onRehydrateStorage: () => (hydratedState, error) => {
        if (USE_MOCKS && !error) {
          const mockUser = {
            _id: 'mock-admin-id',
            name: 'Dev Admin (Mock)',
            email: 'admin@qualifai.tech',
            role: 'admin',
            plan: 'pro',
          };
          const mockToken = 'mock-jwt-token-for-development';
          useAuthStore.setState({
            user: mockUser,
            token: mockToken,
            isAuthenticated: true,
          });
          api.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
        }
      },
    }
  )
);

const token = USE_MOCKS
  ? 'mock-jwt-token-for-development'
  : useAuthStore.getState().token;

if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

if (USE_MOCKS) {
  useAuthStore.setState({
    user: {
      _id: 'mock-admin-id',
      name: 'Dev Admin (Mock)',
      email: 'admin@qualifai.tech',
      role: 'admin',
      plan: 'pro',
    },
    token: 'mock-jwt-token-for-development',
    isAuthenticated: true,
  });
}