import React, { useEffect, useState } from "react";
import {
  getNotifications,
  markAsSeen,
  decideApplication,
} from "../services/notificationService";

interface Notification {
  _id: string;
  type:
    | "simple_invite"
    | "simple_join_accepted"
    | "creator_new_application"
    | "creator_creator_accepted"
    | "creator_member_joined";
  title: string;
  message?: string;
  seen: boolean;
  createdAt: string;
  repo?: { name: string };
  application?: string;
  actor?: { username: string };
}

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const data = await getNotifications(token);
      setNotifications(data);
    } catch (err) {
      console.error("Error cargando notificaciones:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleDecision = async (appId: string, action: "accept" | "reject") => {
    if (!token) return;
    try {
      await decideApplication(appId, action, token);
      alert(`Aplicación ${action === "accept" ? "aceptada" : "rechazada"} con éxito.`);
      fetchNotifications();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Error al procesar la solicitud");
    }
  };

  const handleMarkAsRead = async (id: string) => {
    if (!token) return;
    await markAsSeen(id, token);
    fetchNotifications();
  };

  if (loading) return <p className="text-center mt-10">Cargando notificaciones...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🔔 Notificaciones</h1>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No tienes notificaciones aún.</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition ${
                !n.seen ? "border-pink-400" : "border-gray-200"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{n.title}</h3>
                  <p className="text-sm text-gray-600">{n.message || "Sin mensaje adicional"}</p>
                  {n.repo && (
                    <p className="text-xs text-gray-500 mt-1">Repo: {n.repo.name}</p>
                  )}
                  {n.actor && (
                    <p className="text-xs text-gray-500">
                      De: {n.actor.username}
                    </p>
                  )}
                </div>
                {!n.seen && (
                  <button
                    onClick={() => handleMarkAsRead(n._id)}
                    className="text-xs text-pink-600 hover:underline"
                  >
                    Marcar como leída
                  </button>
                )}
              </div>

              {/* Botones dinámicos según tipo */}
              {n.type === "creator_new_application" && n.application && (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleDecision(n.application!, "accept")}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                  >
                    Aceptar
                  </button>
                  <button
                    onClick={() => handleDecision(n.application!, "reject")}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                  >
                    Rechazar
                  </button>
                </div>
              )}

              {n.type === "simple_invite" && (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => alert("Aceptar invitación (por implementar)")}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                  >
                    Aceptar
                  </button>
                  <button
                    onClick={() => alert("Rechazar invitación (por implementar)")}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                  >
                    Rechazar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
