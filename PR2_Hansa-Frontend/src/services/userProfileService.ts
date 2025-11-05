import api from "../utils/api";

// Obtener perfil del usuario autenticado
export const getMyProfile = async (token: string) => {
  const res = await api.get("/api/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Actualizar perfil (solo el propio usuario)
export const updateMyProfile = async (id: string, data: any, token: string) => {
  const res = await api.put(`/api/users/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
