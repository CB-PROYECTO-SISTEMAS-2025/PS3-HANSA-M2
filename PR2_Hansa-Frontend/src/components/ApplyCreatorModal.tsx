import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white p-8 rounded-3xl max-w-2xl w-full shadow-2xl"
        >
        
        {/* Título */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2 text-[var(--color-primary)] bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primarytwo)] bg-clip-text text-transparent">
            Participar como Cocreador
          </h2>

          <p className="text-sm text-gray-600 leading-relaxed">
            Aporta tus ideas, tiempo y conocimientos para impulsar este proyecto.
            Como Cocreador podrás colaborar directamente con el repositorio,
            proponer mejoras y trabajar junto al equipo.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* SELECTOR VISUAL DE TIPOS */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Selecciona tu rol
            </label>
            <div className="flex gap-3 flex-wrap">
              {creatorOptions.map((opt) => (
                <motion.button
                  key={opt.id}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCreatorType(opt.id)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                    creatorType === opt.id
                      ? "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primarytwo)] text-white shadow-lg shadow-pink-500/30"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
                  }`}
                >
                  {opt.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* CAMPOS */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descripción de tu aporte
            </label>
            <input
              type="text"
              className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all outline-none"
              placeholder="¿Qué puedes aportar al proyecto?"
              value={aporte}
              onChange={(e) => setAporte(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Motivación personal
            </label>
            <textarea
              className="w-full border-2 border-gray-200 rounded-xl p-3 h-24 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all outline-none resize-none"
              placeholder="¿Por qué quieres participar?"
              value={motivacion}
              onChange={(e) => setMotivacion(e.target.value)}
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tipo de aporte
              </label>
              <input
                type="text"
                className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all outline-none"
                placeholder="horas, asesoría, etc."
                value={tipoAporte}
                onChange={(e) => setTipoAporte(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Horas disponibles
              </label>
              <input
                type="number"
                className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all outline-none"
                placeholder="Ej: 10"
                value={disponibilidadHoras}
                onChange={(e) => setDisponibilidadHoras(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Portafolio (opcional)
            </label>
            <input
              type="text"
              className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all outline-none"
              placeholder="https://tu-portafolio.com"
              value={urlPortafolio}
              onChange={(e) => setUrlPortafolio(e.target.value)}
            />
          </div>

          {/* BOTONES */}
          <div className="flex justify-end gap-3 pt-6">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="px-6 py-2.5 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </motion.button>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="px-6 py-2.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primarytwo)] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-pink-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Enviando…
                </span>
              ) : "Enviar Solicitud"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
    </AnimatePresence>
  );
};

export default ApplyCreatorModal;
