import React, { useEffect, useState } from "react";
import { getNotifications, markNotificationAsSeen } from "../services/notificationService";
import { acceptInvitation } from "../features/repository/services/invitationService";

interface Notification {
  _id: string;
  type: string;
  title: string;
  message?: string;
  seen: boolean;
  createdAt: string;
  actor?: { username?: string; email?: string };
  repo?: { name?: string };
  payload?: { invitationToken?: string };
}

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // 🔄 Obtener notificaciones del backend
  const fetchNotifications = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await getNotifications(token);
      setNotifications(data);
    } catch (err: any) {
      console.error("❌ Error al cargar notificaciones:", err);
      alert("No se pudieron cargar las notificaciones.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Aceptar invitación desde la notificación
  const handleAcceptInvitation = async (n: Notification) => {
    if (!n.payload?.invitationToken) {
      alert("Esta notificación no contiene token de invitación.");
      return;
    }

    try {
      await acceptInvitation(n.payload.invitationToken, token!);
      alert("Invitación aceptada correctamente.");
      await markNotificationAsSeen(n._id, token!);
      fetchNotifications();
    } catch (err: any) {
      console.error("❌ Error al aceptar invitación:", err);
      alert(err?.response?.data?.message || "Error al aceptar la invitación.");
    }
  };

  // 🔖 Marcar como leídas todas
  const handleMarkAllAsRead = async () => {
    for (const n of notifications) {
      if (!n.seen) await markNotificationAsSeen(n._id, token!);
    }
    fetchNotifications();
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // 🔍 Filtrar por tipo
  const filtered =
    filter === "all" ? notifications : notifications.filter((n) => n.type === filter);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold flex items-center mb-4">🔔 Notificaciones</h1>

      <div className="flex items-center justify-between mb-4">
        <div className="space-x-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-md border ${filter === "all" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter("simple_invite")}
            className={`px-3 py-1 rounded-md border ${filter === "simple_invite" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
          >
            Invitaciones
          </button>
          <button
            onClick={() => setFilter("simple_join_accepted")}
            className={`px-3 py-1 rounded-md border ${filter === "simple_join_accepted" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
          >
            Aceptadas
          </button>
        </div>

        <button
          onClick={handleMarkAllAsRead}
          className="text-sm text-pink-600 hover:underline"
        >
          Marcar todas como leídas
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando notificaciones...</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((n) => (
            <div
              key={n._id}
              className={`border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition ${
                n.seen ? "opacity-80" : "border-blue-400"
              }`}
            >
              <h3 className="font-semibold">{n.title}</h3>
              <p className="text-gray-600">{n.message}</p>

              <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                <span>
                  {n.actor?.username
                    ? `${n.actor.username} (${n.actor.email})`
                    : "Sistema"}
                </span>
                <span>{new Date(n.createdAt).toLocaleString()}</span>
              </div>

              {n.type === "simple_invite" && (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleAcceptInvitation(n)}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                  >
                    Aceptar
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">
                    Rechazar
                  </button>
                </div>
              )}

              {n.type === "simple_join_accepted" && (
                <div className="mt-3">
                  <button
                    onClick={() => markNotificationAsSeen(n._id, token!)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                  >
                    Ver detalles
                  </button>
                </div>
              )}
            </div>
          ))}

          {!filtered.length && (
            <p className="text-gray-500 italic">No hay notificaciones.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
