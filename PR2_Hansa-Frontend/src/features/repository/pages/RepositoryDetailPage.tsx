import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRepositoryById } from "../services/repositoryService";
import RepositoryDetailTabs from "../components/RepositoryDetailTabs";
import FileModal from "../components/FileModal";
import ParticipantModal from "../components/ParticipantModal";

const RepositoryDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [repo, setRepo] = useState<any>(null);
  const [showFileModal, setShowFileModal] = useState(false);
  const [showParticipantModal, setShowParticipantModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  const currentUserId = storedUser ? JSON.parse(storedUser).id : null;

  const fetchRepo = async () => {
    try {
      const data = await getRepositoryById(id!, token!);
      setRepo(data);
    } catch (err) {
      console.error("Error cargando repositorio:", err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchRepo();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Cargando...</p>;
  if (!repo) return <p className="text-center text-red-500 mt-10">No se encontró el repositorio.</p>;

  const isOwner = repo.owner?._id === currentUserId;

  const handleEdit = () => navigate(`/repositorio/${id}/editar`);
  const handleDelete = () => alert("🗑️ Eliminar repositorio aún no implementado");
  const handleLeave = () => alert("🚪 Abandonar repositorio aún no implementado");

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Cabecera */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-1">{repo.name}</h1>
          <p className="text-gray-600">{repo.description}</p>
        </div>

        <div className="flex gap-2">
          {isOwner && (
            <>
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                Editar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                Eliminar
              </button>
            </>
          )}
          {!isOwner && (
            <button
              onClick={handleLeave}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Abandonar
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <RepositoryDetailTabs
        repo={repo}
        currentUserId={currentUserId}
        onAddFile={() => setShowFileModal(true)}
        onAddUser={() => setShowParticipantModal(true)}
        refresh={fetchRepo}
      />

      {/* Modales */}
      {showFileModal && (
        <FileModal
          repoId={repo._id}
          onClose={() => setShowFileModal(false)}
          onSuccess={fetchRepo}
        />
      )}
      {showParticipantModal && (
        <ParticipantModal
          repoId={repo._id}
          onClose={() => setShowParticipantModal(false)}
          onSuccess={fetchRepo}
        />
      )}
    </div>
  );
};

export default RepositoryDetailPage;
