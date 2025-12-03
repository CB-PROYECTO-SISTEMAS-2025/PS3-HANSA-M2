import React, { useState } from "react";
import { inviteToRepo } from "../services/invitationService";

interface Props {
  repoId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const ParticipantModal: React.FC<Props> = ({ repoId, onClose, onSuccess }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Token no encontrado. Inicia sesión nuevamente.");
      return;
    }

    try {
      setLoading(true);
      const res = await inviteToRepo(repoId, email, role, token);
      console.log("✅ Invitación creada:", res);
      alert(`Invitación enviada a ${email}`);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("❌ Error al invitar:", err);
      alert(err?.response?.data?.message || "Error al enviar la invitación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4 text-[var(--color-primary)]">
          Invitar Usuario al Repositorio
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Correo del usuario</label>
            <input
              type="email"
              placeholder="usuario@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Rol</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-2"
            >
              <option value="viewer">Viewer (Solo lectura)</option>
              <option value="writer">Writer (Lectura y escritura)</option>
              <option value="admin">Admin (Control total)</option>
            </select>
            
            {/* Role descriptions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs space-y-2">
              {role === "viewer" && (
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">👁️</span>
                  <div>
                    <p className="font-semibold text-blue-900">Viewer</p>
                    <p className="text-blue-700">Solo puede ver y descargar archivos. No puede modificar ni subir contenido.</p>
                  </div>
                </div>
              )}
              {role === "writer" && (
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">✏️</span>
                  <div>
                    <p className="font-semibold text-blue-900">Writer</p>
                    <p className="text-blue-700">Puede ver, descargar, subir y modificar archivos. No puede administrar participantes.</p>
                  </div>
                </div>
              )}
              {role === "admin" && (
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">⚡</span>
                  <div>
                    <p className="font-semibold text-blue-900">Admin</p>
                    <p className="text-blue-700">Control total: puede gestionar archivos, participantes y configuración del repositorio.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[var(--color-primary)] text-white rounded hover:bg-opacity-90 disabled:opacity-50"
            >
              {loading ? "Enviando..." : "Enviar Invitación"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ParticipantModal;
