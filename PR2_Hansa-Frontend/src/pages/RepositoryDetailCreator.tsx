import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ApplyCreatorModal from "../components/ApplyCreatorModal";
import ApplyMemberModal from "../components/ApplyMemberModal";
import api from "../utils/api";

interface Repo {
  _id: string;
  name: string;
  description?: string;
  typeRepo: string;
}

export default function RepositoryDetailCreator() {
  const { id } = useParams(); // ✅ obtiene el ID real de la URL
  const [repo, setRepo] = useState<Repo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreatorModal, setShowCreatorModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);

  // 🔹 Cargar datos del repo
  useEffect(() => {
    const fetchRepo = async () => {
      try {
        const res = await api.get(`/api/repositorios/${id}`);
        setRepo(res.data);
      } catch (err) {
        console.error("Error al obtener repositorio:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRepo();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Cargando...</p>;
  if (!repo) return <p className="text-center mt-10 text-red-600">Repositorio no encontrado.</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2 text-[var(--color-primary)]">{repo.name}</h1>
      <p className="text-gray-600 mb-8">{repo.description || "Sin descripción disponible."}</p>

      <h2 className="text-2xl font-semibold mb-4">Aplicar</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* 🟦 Creador */}
        <div className="border rounded-xl p-6 hover:border-blue-400 transition">
          <h3 className="text-xl font-semibold mb-1">Creador</h3>
          <p className="text-3xl font-bold text-gray-800 mb-2">Free</p>
          <p className="text-sm text-gray-600 mb-4">
            Aporta tus ideas, tiempo y conocimientos para impulsar este proyecto. 
            Podrás colaborar directamente con el repositorio y proponer mejoras.
          </p>
          <button
            onClick={() => setShowCreatorModal(true)}
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            Aplicar
          </button>
        </div>

        {/* 🟪 Miembro */}
        <div className="border rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-1">Miembro</h3>
          <p className="text-3xl font-bold text-gray-800 mb-2">
            $5<span className="text-base text-gray-500">/mo</span>
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Apoya el crecimiento del proyecto aportando económicamente. Obtén acceso a archivos, descargas y avances exclusivos.
          </p>
          <button
            onClick={() => setShowMemberModal(true)}
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            Aplicar
          </button>
        </div>
      </div>

      {/* 🧩 Modales */}
      {showCreatorModal && (
        <ApplyCreatorModal repoId={id as string} onClose={() => setShowCreatorModal(false)} />
      )}
      {showMemberModal && (
        <ApplyMemberModal repoId={id as string} onClose={() => setShowMemberModal(false)} />
      )}
    </div>
  );
}
