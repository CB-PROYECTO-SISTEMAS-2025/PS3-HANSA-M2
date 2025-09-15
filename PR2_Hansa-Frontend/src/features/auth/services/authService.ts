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

export const forgotPassword = async (email: string) => {
  const r = await api.post("api/auth/forgot", { email });
  return r.data;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const r = await api.post("api/auth/reset", { token, newPassword });
  return r.data;
};

//para el reenvio del codigo 
export const resendVerifyCode = async (username: string) => {
  const response = await api.post("api/auth/verifyCode/resend", { username });
  return response.data;
};