import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RepositoryForm from "../components/RepositoryForm";
import { getRepositoryById } from "../services/repositoryService";

const EditRepositoryPage: React.FC = () => {
  const { id } = useParams();
  const [repo, setRepo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token")!;
    getRepositoryById(id!, token)
      .then(setRepo)
      .catch((e) => console.error("Error cargando repo:", e))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center mt-10">Cargando…</p>;
  if (!repo) return <p className="text-center mt-10">Repositorio no encontrado</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-4">Editar Repositorio</h1>
      <RepositoryForm mode="edit" repoData={repo} />
    </div>
  );
};

export default EditRepositoryPage;
