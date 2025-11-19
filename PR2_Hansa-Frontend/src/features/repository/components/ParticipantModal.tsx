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
              className="w-full border rounded px-3 py-2"
            >
              <option value="viewer">Viewer</option>
              <option value="writer">Writer</option>
              <option value="admin">Admin</option>
            </select>
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
