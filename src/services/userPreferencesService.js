import api from './api';

class UserPreferencesService {
  
  async createDefaultPreferences(userId) {
    try {
      const response = await api.post('/api/preferences/ensure-default', { userId });
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao criar preferências padrão:', error);
      throw error;
    }
  }
  
  async getUserPreferences() {
    try {
      const response = await api.get('/api/preferences');
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao obter preferências:', error);
      throw error;
    }
  }
  
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