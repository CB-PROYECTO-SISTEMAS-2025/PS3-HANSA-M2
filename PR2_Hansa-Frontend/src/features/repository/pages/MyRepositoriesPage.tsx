import React, { useEffect, useState } from "react";
import CreateRepositoryForm from "../components/CreateRepositoryForm"; // Ajusta la ruta según tu proyecto
import { Link } from "react-router-dom";

interface Repository {
  _id: string;
  name: string;
  description?: string;
  type: string;
  owner: string;
  members: string[];
  createdAt: string;
}

const MyRepositoriesPage: React.FC = () => {
  const [repositorios, setRepositorios] = useState<Repository[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchRepositorios = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/repositorios/mis-repositorios", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setRepositorios(data);
    } catch (err) {
      console.error(err);
      alert("Error al cargar los repositorios.");
    }
  };

  useEffect(() => {
    fetchRepositorios();
  }, []);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Callback que pasa CreateRepositoryForm para cuando se crea un repo:
  const onCreateSuccess = () => {
    fetchRepositorios();
    handleCloseModal();
  };

  return (
    <div className="min-h-screen p-6 bg-white max-w-5xl mx-auto">
      <div className="flex items-center mb-6 relative">
        <h1 className="text-3xl font-bold ">Mis Repositorios</h1>
        <div className="ml-auto">
          <button
            onClick={handleOpenModal}
            className="bg-[var(--color-primary)] text-white px-6 py-2 rounded hover:bg-opacity-30 transition"
          >
            Crear Repositorio
          </button>
        </div>
      </div>


      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.3)] backdrop-blur-sm">
          <div className="relative max-w-xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {/* Botón cerrar */}
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl font-bold"
              aria-label="Cerrar modal"
            >
              ×
            </button>

            {/* Formulario dentro del modal */}
            <CreateRepositoryForm onSuccess={onCreateSuccess} />
          </div>
        </div>
      )}

      {/* Lista de repositorios */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Repositorios existentes</h2>
        <div className="grid gap-4">
          {repositorios.map((repo) => (
            <Link to={`/repositorio/${repo._id}`} key={repo._id}>
              <div className="bg-white p-4 rounded shadow hover:bg-gray-50 cursor-pointer transition">
                <h3 className="text-xl font-bold text-gray-800">{repo.name}</h3>
                <p className="text-sm text-gray-600">{repo.description || "Sin descripción"}</p>
                <p className="text-xs text-gray-500">Tipo: {repo.type}</p>
                <p className="text-xs text-gray-500">Participantes: {repo.members.length}</p>
              </div>
            </Link>
          ))}

          {repositorios.length === 0 && (
            <p className="text-gray-500">No estás en ningún repositorio aún.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRepositoriesPage;
