import api from '../../../utils/api';

export const verifyCode = async (username: string, code: string) => {
  const response = await api.post("api/auth/verifyCode", { username, code });
  return response.data;
};

export const login = async (username: string, password: string) => {
  const response = await api.post("api/auth/login", { username, password });
  return response.data;
};

export const register = async (email: string, username: string, password: string) => {
  const response = await api.post("api/auth/register", { email, username, password });
  return response.data;
};