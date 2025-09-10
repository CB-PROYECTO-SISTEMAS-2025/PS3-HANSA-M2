import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const HomeBitacoraPage: React.FC = () => {
  const [entry, setEntry] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedEntry = localStorage.getItem("bitacoraEntry");
    if (savedEntry) setEntry(savedEntry);
  }, []);

  const handleSave = () => {
    localStorage.setItem("bitacoraEntry", entry);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  const navigate = useNavigate();

  return (
    
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => navigate("/mis-repositorios")}
            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-6 py-2 rounded-lg transition"
          >
            Ver Repositorios
          </button>
        </div>
        <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-4 text-center">
          Mi Bitácora Diaria
        </h1>
        
        <p className="text-gray-600 text-center mb-6">
          Escribe lo que sientes, ideas, reflexiones o notas importantes del día.
        </p>

        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="Hoy me sentí..."
          rows={12}
          className="w-full p-4 border border-[var(--color-primarytwo)] rounded-lg resize-none focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
        />

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSave}
            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-6 py-2 rounded-lg transition"
          >
            Guardar Entrada
          </button>
        </div>

        {saved && (
          <p className="text-green-600 text-sm mt-2 text-right">Entrada guardada correctamente ✅</p>
        )}
      </div>
  );
};

export default HomeBitacoraPage;
