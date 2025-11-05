import React, { useState } from "react";
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl max-w-md w-full">
        <h2 className="text-xl font-semibold mb-2 text-[var(--color-primary)]">
          Unirte como Miembro
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Apoya económicamente este proyecto y obtén acceso al contenido y descargas exclusivas.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm font-medium">Plan</label>
            <select
              className="w-full border rounded p-2 mt-1"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
            >
              <option value="cobre">Cobre (Gratis)</option>
              <option value="plata">Plata ($10)</option>
              <option value="oro">Oro ($20)</option>
              <option value="diamante">Diamante (Custom)</option>
            </select>
          </div>

          {plan === "diamante" && (
            <input
              type="number"
              placeholder="Monto personalizado"
              className="w-full border rounded p-2"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          )}

          <div>
            <label className="text-sm font-medium">Aporte personal</label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {["Compartir enlace", "Animando", "Invitar más gente", "Compartir contenido", "Otro"].map(
                (opt) => (
                  <label key={opt} className="text-sm flex gap-1 items-center">
                    <input
                      type="checkbox"
                      checked={aportePersonal.includes(opt)}
                      onChange={() => toggleAporte(opt)}
                    />
                    {opt}
                  </label>
                )
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-3 py-2 border rounded">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-3 py-2 bg-pink-600 text-white rounded"
            >
              {loading ? "Procesando..." : "Aceptar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyMemberModal;
