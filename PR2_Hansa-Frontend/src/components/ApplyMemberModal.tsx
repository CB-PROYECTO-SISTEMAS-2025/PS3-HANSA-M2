import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { applyAsMember } from "../services/applicationService";

interface Props {
  repoId: string;
  onClose: () => void;
}

const ApplyMemberModal: React.FC<Props> = ({ repoId, onClose }) => {
  const [plan, setPlan] = useState("cobre");
  const [amount, setAmount] = useState("");
  const [aportePersonal, setAportePersonal] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleAporte = (val: string) => {
    setAportePersonal((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Inicia sesión para aplicar.");
      return;
    }

    try {
      setLoading(true);
      await applyAsMember(repoId, {
        plan,
        aportePersonal,
        amount: amount ? parseFloat(amount) : 0,
      }, token);

      alert("Te has unido como miembro correctamente.");
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Error al aplicar");
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
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.4, bounce: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white p-8 rounded-3xl max-w-md w-full shadow-2xl"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primarytwo)] bg-clip-text text-transparent">
              Unirte como Miembro
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Apoya económicamente este proyecto y obtén acceso al contenido y descargas exclusivas.
            </p>
          </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Plan de membresía</label>
            <select
              className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all outline-none font-medium"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
            >
              <option value="cobre">🥉 Cobre (Gratis)</option>
              <option value="plata">🥈 Plata ($10)</option>
              <option value="oro">🥇 Oro ($20)</option>
              <option value="diamante">💎 Diamante (Personalizado)</option>
            </select>
          </div>

          {plan === "diamante" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">Monto personalizado</label>
              <input
                type="number"
                placeholder="Ingresa el monto"
                className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all outline-none"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Aporte personal</label>
            <div className="grid grid-cols-2 gap-3">
              {["Compartir enlace", "Animando", "Invitar más gente", "Compartir contenido", "Otro"].map(
                (opt) => (
                  <motion.label 
                    key={opt} 
                    whileHover={{ scale: 1.02 }}
                    className="text-sm flex gap-2 items-center cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={aportePersonal.includes(opt)}
                      onChange={() => toggleAporte(opt)}
                      className="w-4 h-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                    />
                    <span className="text-gray-700">{opt}</span>
                  </motion.label>
                )
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <motion.button 
              type="button" 
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2.5 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </motion.button>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="px-6 py-2.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primarytwo)] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-pink-500/30 transition-all disabled:opacity-50"
            >
              {loading ? "Procesando..." : "Unirme Ahora"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
    </AnimatePresence>
  );
};

export default ApplyMemberModal;
