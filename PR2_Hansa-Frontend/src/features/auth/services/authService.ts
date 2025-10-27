import api from '../../../utils/api';

/** 🔹 LOGIN */
export const login = async (username: string, password: string) => {
  const { data } = await api.post("/api/auth/login", { username, password });
  return data;
};

/** 🔹 REGISTRO */
export const register = async (email: string, username: string, password: string) => {
  const { data } = await api.post("/api/auth/register", { email, username, password });
  return data;
};

/** 🔹 VERIFICAR CÓDIGO 2FA */
export const verifyCode = async (username: string, code: string) => {
  const { data } = await api.post("/api/auth/verify-code", { username, code });
  return data;
};

/** 🔹 REENVIAR CÓDIGO 2FA */

export const resendVerifyCode = async (username: string) => {
  const { data } = await api.post("/api/auth/verifyCode/resend", { username });
  return data;
};


/** 🔹 SOLICITAR RESTABLECIMIENTO DE CONTRASEÑA */
export const requestPasswordReset = async (email: string) => {
  const { data } = await api.post("/api/auth/request-reset", { email });
  return data;
};

/** 🔹 RESTABLECER CONTRASEÑA CON TOKEN */
export const resetPassword = async (token: string, password: string) => {
  const { data } = await api.post("/api/auth/reset-password", { token, password });
  return data;
};
