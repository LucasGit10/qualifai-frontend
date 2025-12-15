import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';
import userPreferencesService from '../services/userPreferencesService';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: async (email, password) => {
        try {
          const response = await api.post('/auth/login', { email, password });
          const { user, token } = response.data;
          
          set({ user, token, isAuthenticated: true });
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // ✅ ADICIONAR: Criar preferências padrão (sem alterar lógica existente)
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
          
          // ✅ ADICIONAR: Criar preferências padrão (sem alterar lógica existente)
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
    }
  )
);

// Configurar token no axios se existir
const token = useAuthStore.getState().token;
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}