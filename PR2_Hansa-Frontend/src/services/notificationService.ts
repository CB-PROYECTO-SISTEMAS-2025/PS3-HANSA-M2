import api from "../utils/api";

// Obtener todas las notificaciones del usuario autenticado
export const getNotifications = async (token: string) => {
  const res = await api.get("/api/notificaciones", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Marcar una notificación como vista
export const markNotificationAsSeen = async (id: string, token: string) => {
  const res = await api.put(`/api/notificaciones/${id}/seen`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
