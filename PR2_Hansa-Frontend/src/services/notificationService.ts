import api from "../utils/api";

// Obtener todas las notificaciones
export const getNotifications = async (token: string) => {
  const res = await api.get("/api/notificaciones", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Marcar una notificación como vista
export const markAsSeen = async (id: string, token: string) => {
  const res = await api.put(`/api/notificaciones/${id}/seen`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Aceptar o rechazar aplicación desde notificación
export const decideApplication = async (appId: string, action: "accept" | "reject", token: string) => {
  const res = await api.put(`/api/applications/${appId}/${action}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
