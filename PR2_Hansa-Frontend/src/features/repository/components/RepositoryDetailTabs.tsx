import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRepositoryById } from "../services/repositoryService";

// Simple local tabs component so the page can pass the loaded `repo` safely.
const RepositoryDetailTabs: React.FC<{ repo: any }> = ({ repo }) => {
  const [active, setActive] = React.useState<string>("files");

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setActive("files")} className={`px-3 py-1 rounded ${active === "files" ? "bg-[var(--color-primary)] text-white" : "bg-gray-100"}`}>
          Archivos
        </button>
        <button onClick={() => setActive("participants")} className={`px-3 py-1 rounded ${active === "participants" ? "bg-[var(--color-primary)] text-white" : "bg-gray-100"}`}>
          Participantes
        </button>
        <button onClick={() => setActive("info")} className={`px-3 py-1 rounded ${active === "info" ? "bg-[var(--color-primary)] text-white" : "bg-gray-100"}`}>
          Información
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        {active === "files" && (
          <div>
            <h3 className="font-semibold mb-2">Archivos ({(repo.files || []).length})</h3>
            <ul className="list-disc pl-5 text-gray-700">
              {(repo.files || []).map((f: any) => (
                <li key={f.id || f.name}>{f.name}</li>
              ))}
            </ul>
          </div>
        )}

        {active === "participants" && (
          <div>
            <h3 className="font-semibold mb-2">Participantes</h3>
            <ul className="list-disc pl-5 text-gray-700">
              {(repo.participants || []).map((p: any) => (
                <li key={p.id || p.email}>{p.name || p.email}</li>
              ))}
            </ul>
          </div>
        )}

        {active === "info" && (
          <div>
            <h3 className="font-semibold mb-2">Detalles</h3>
            <p className="text-gray-700">Tipo: {repo.typeRepo}</p>
            <p className="text-gray-700">Privacidad: {repo.privacy}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const RepositoryDetailPage: React.FC = () => {
  const { id } = useParams();
  const [repo, setRepo] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    getRepositoryById(id!, token!).then(setRepo).catch(console.error);
  }, [id]);

  if (!repo) return <p className="text-center mt-10">Cargando...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-4">{repo.name}</h1>
      <p className="text-gray-600 mb-6">{repo.description}</p>
      <RepositoryDetailTabs repo={repo} />
    </div>
  );
};

export default RepositoryDetailPage;
