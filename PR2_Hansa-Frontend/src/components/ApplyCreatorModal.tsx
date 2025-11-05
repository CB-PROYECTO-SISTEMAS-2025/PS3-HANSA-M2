import React, { useState } from "react";
import { applyAsCreator } from "../services/applicationService";

interface Props {
  repoId: string;
  onClose: () => void;
}

const ApplyCreatorModal: React.FC<Props> = ({ repoId, onClose }) => {
  const [creatorType, setCreatorType] = useState("técnico");
  const [aporte, setAporte] = useState("");
  const [motivacion, setMotivacion] = useState("");
  const [tipoAporte, setTipoAporte] = useState("");
  const [disponibilidadHoras, setDisponibilidadHoras] = useState("");
  const [urlPortafolio, setUrlPortafolio] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Inicia sesión para aplicar.");
      return;
    }

    try {
      setLoading(true);
      await applyAsCreator(repoId, {
        creatorType,
        aporte,
        motivacion,
        tipoAporte,
        disponibilidadHoras: parseInt(disponibilidadHoras),
        urlPortafolio,
      }, token);

      alert("Solicitud enviada correctamente.");
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Error al enviar solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-2 text-[var(--color-primary)]">
          Participar como Creador
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Aporta tus ideas, tiempo y conocimientos para impulsar este proyecto.
          Solo necesitas llenar este formulario para aplicar.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm font-medium">Tipo</label>
            <select
              className="w-full border rounded p-2 mt-1"
              value={creatorType}
              onChange={(e) => setCreatorType(e.target.value)}
            >
              <option value="técnico">Creador Técnico</option>
              <option value="visual">Creador Visual</option>
              <option value="administrador">Creador Administrador</option>
              <option value="experto">Creador Experto</option>
            </select>
          </div>

          <input
            type="text"
            className="w-full border rounded p-2"
            placeholder="Descripción de tu aporte"
            value={aporte}
            onChange={(e) => setAporte(e.target.value)}
          />
          <input
            type="text"
            className="w-full border rounded p-2"
            placeholder="Motivación personal"
            value={motivacion}
            onChange={(e) => setMotivacion(e.target.value)}
          />
          <input
            type="text"
            className="w-full border rounded p-2"
            placeholder="Tipo de aporte (horas, asesoría, etc.)"
            value={tipoAporte}
            onChange={(e) => setTipoAporte(e.target.value)}
          />
          <input
            type="number"
            className="w-full border rounded p-2"
            placeholder="Disponibilidad de horas"
            value={disponibilidadHoras}
            onChange={(e) => setDisponibilidadHoras(e.target.value)}
          />
          <input
            type="text"
            className="w-full border rounded p-2"
            placeholder="Portafolio (opcional)"
            value={urlPortafolio}
            onChange={(e) => setUrlPortafolio(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-3 py-2 border rounded">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-3 py-2 bg-pink-600 text-white rounded"
            >
              {loading ? "Enviando..." : "Aceptar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyCreatorModal;
