import api from '../../../utils/api';

export const verifyCode = async (username: string, code: string) => {
  const response = await api.post("api/auth/verifyCode", { username, code });
  return response.data;
};

export const login = async (username: string, password: string) => {
  const url = 'api/auth/login';
  console.log('🌐 Enviando petición de login a:', url);
  console.log('🌐 URL completa:', `${import.meta.env.VITE_API_BASE_URL}/${url}`);
  console.log('🌐 Datos enviados:', { username, password: '***' });
  
  const response = await api.post(url, { username, password });
  console.log('✅ Respuesta completa:', response);
  return response.data;
};

export const register = async (email: string, username: string, password: string) => {
  const response = await api.post("api/auth/register", { email, username, password });
  return response.data;
};