import React, { useState } from "react";

interface Notification {
  id: number;
  type: "invitation" | "application" | "applicationAccepted" | "invitationAccepted";
  title: string;
  description: string;
  sender: string;
  time: string;
}

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "invitation",
      title: "Invitación a repositorio",
      description: "María López te ha invitado a colaborar en 'Análisis de Datos - Proyecto Final'.",
      sender: "maria.lopez@get.univalle.edu",
      time: "Hace 2 horas",
    },
    {
      id: 2,
      type: "application",
      title: "Nueva solicitud de ingreso",
      description: "Carlos Pérez ha solicitado unirse a tu repositorio 'Química Orgánica - Laboratorio'.",
      sender: "carlos.perez@get.univalle.edu",
      time: "Hace 4 horas",
    },
    {
      id: 3,
      type: "applicationAccepted",
      title: "Solicitud aceptada",
      description: "Tu solicitud para unirte a 'Proyecto Estadístico' ha sido aceptada.",
      sender: "sistema@get.univalle.edu",
      time: "Hace 1 día",
    },
    {
      id: 4,
      type: "invitationAccepted",
      title: "Invitación aceptada",
      description: "Juan Torres ha aceptado tu invitación al repositorio 'Farmacias Bolivia'.",
      sender: "sistema@get.univalle.edu",
      time: "Hace 3 horas",
    },
  ]);

  const [filter, setFilter] = useState<"all" | Notification["type"]>("all");

  const filteredNotifications =
    filter === "all" ? notifications : notifications.filter(n => n.type === filter);

  const handleMarkAllAsRead = () => {
    alert("Todas las notificaciones marcadas como leídas (simulado)");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold flex items-center mb-4">
        🔔 Notificaciones
      </h1>

      <div className="flex items-center justify-between mb-4">
        <div className="space-x-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-md border ${filter === "all" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter("invitation")}
            className={`px-3 py-1 rounded-md border ${filter === "invitation" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
          >
            Invitaciones
          </button>
          <button
            onClick={() => setFilter("application")}
            className={`px-3 py-1 rounded-md border ${filter === "application" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
          >
            Solicitudes
          </button>
          <button
            onClick={() => setFilter("applicationAccepted")}
            className={`px-3 py-1 rounded-md border ${filter === "applicationAccepted" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
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

      <div className="space-y-3">
        {filteredNotifications.map(n => (
          <div
            key={n.id}
            className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition"
          >
            <h3 className="font-semibold">{n.title}</h3>
            <p className="text-gray-600">{n.description}</p>
            <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
              <span>{n.sender}</span>
              <span>{n.time}</span>
            </div>

            {n.type === "invitation" || n.type === "application" ? (
              <div className="mt-3 flex gap-2">
                <button className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600">
                  Aceptar
                </button>
                <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">
                  Rechazar
                </button>
              </div>
            ) : (
              <div className="mt-3">
                <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">
                  Ver detalles
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
