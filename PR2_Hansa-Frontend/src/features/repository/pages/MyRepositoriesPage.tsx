import React, { useEffect, useState } from "react";
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

  return (
    <div className="min-h-screen p-6 bg-white max-w-5xl mx-auto">
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold">Mis Repositorios</h1>
        <div className="ml-auto">
          <Link
            to="/crear-repositorio"
            className="bg-[var(--color-primary)] text-white px-6 py-2 rounded hover:bg-opacity-30 transition"
          >
            Crear Repositorio
          </Link>
        </div>
      </div>

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
