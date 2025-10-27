// src/features/auth/services/authService.ts
import api from '../../../utils/api';

export const login = async (username: string, password: string) => {
  const { data } = await api.post("/api/auth/login", { username, password });
  return data;
};

export const register = async (email: string, username: string, password: string) => {
  const { data } = await api.post("/api/auth/register", { email, username, password });
  return data;
};

export const verifyCode = async (username: string, code: string) => {
  const { data } = await api.post("/api/auth/verify-code", { username, code });
  return data;
};

// 🔹 NUEVO: Solicitar enlace o código de reseteo
export const requestPasswordReset = async (email: string) => {
  const { data } = await api.post("/api/auth/request-reset", { email });
  return data;
};

export const resetPassword = async (token: string, password: string) => {
  const { data } = await api.post("/api/auth/reset-password", { token, password });
  return data;
};
