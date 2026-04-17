import axios from 'axios';
import { USE_MOCKS } from '../config/env';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://www.qualifai.tech/api',
  timeout: 1000 * 60 * 10,
  withCredentials: true,
});

// Response interceptor: redireciona para /login em caso de token expirado
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!USE_MOCKS && error.response?.status === 401) {
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
