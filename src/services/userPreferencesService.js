// services/userPreferencesService.js (FRONTEND)
import api from './api';

class UserPreferencesService {
  
  // ✅ CRIAR PREFERÊNCIAS PADRÃO NO BACKEND
  async createDefaultPreferences(userId) {
    try {
      // Esta chamada vai acionar o backend para criar preferências padrão
      const response = await api.post('/api/preferences/ensure-default', { userId });
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao criar preferências padrão:', error);
      throw error;
    }
  }
  
  // ✅ OBTER PREFERÊNCIAS DO USUÁRIO
  async getUserPreferences() {
    try {
      const response = await api.get('/api/preferences');
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao obter preferências:', error);
      throw error;
    }
  }
  
  // ✅ ATUALIZAR PREFERÊNCIAS
  async updateUserPreferences(updates) {
    try {
      const response = await api.put('/api/preferences', updates);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao atualizar preferências:', error);
      throw error;
    }
  }
}

export default new UserPreferencesService();