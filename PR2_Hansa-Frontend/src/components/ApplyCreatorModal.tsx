import React, { useState } from "react";
import { applyAsCreator } from "../services/applicationService";

interface Props {
  repoId: string;
  onClose: () => void;
}

const creatorOptions = [
  { id: "técnico", label: "Cocreador Técnico" },
  { id: "administrador", label: "Cocreador Administrador" },
  { id: "visual", label: "Cocreador Visual" },
  { id: "experto", label: "Cocreador Especialista" },
];

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

      await applyAsCreator(
        repoId,
        {
          creatorType, // Mantiene backend correcto
          aporte,
          motivacion,
          tipoAporte,
          disponibilidadHoras: parseInt(disponibilidadHoras),
          urlPortafolio,
        },
        token
      );

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
      <div className="bg-white p-6 rounded-2xl max-w-2xl w-full shadow-xl">
        
        {/* Título */}
        <h2 className="text-2xl font-semibold mb-2 text-[var(--color-primary)]">
          Participar como Cocreador
        </h2>

        <p className="text-sm text-gray-600 mb-6">
          Aporta tus ideas, tiempo y conocimientos para impulsar este proyecto.
          Como Cocreador podrás colaborar directamente con el repositorio,
          proponer mejoras y trabajar junto al equipo.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* SELECTOR VISUAL DE TIPOS */}
          <div className="flex gap-3 flex-wrap">
            {creatorOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setCreatorType(opt.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  creatorType === opt.id
                    ? "bg-pink-600 text-white shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* CAMPOS */}
          <input
            type="text"
            className="w-full border rounded-lg p-3"
            placeholder="Descripción de tu aporte"
            value={aporte}
            onChange={(e) => setAporte(e.target.value)}
          />

          <textarea
            className="w-full border rounded-lg p-3 h-20"
            placeholder="Motivación personal"
            value={motivacion}
            onChange={(e) => setMotivacion(e.target.value)}
          ></textarea>

          <input
            type="text"
            className="w-full border rounded-lg p-3"
            placeholder="Tipo de aporte (horas, asesoría, etc.)"
            value={tipoAporte}
            onChange={(e) => setTipoAporte(e.target.value)}
          />

          <input
            type="number"
            className="w-full border rounded-lg p-3"
            placeholder="Disponibilidad de horas"
            value={disponibilidadHoras}
            onChange={(e) => setDisponibilidadHoras(e.target.value)}
          />

          <input
            type="text"
            className="w-full border rounded-lg p-3"
            placeholder="Portafolio (opcional)"
            value={urlPortafolio}
            onChange={(e) => setUrlPortafolio(e.target.value)}
          />

          {/* BOTONES */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
            >
              {loading ? "Enviando…" : "Aceptar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyCreatorModal;
