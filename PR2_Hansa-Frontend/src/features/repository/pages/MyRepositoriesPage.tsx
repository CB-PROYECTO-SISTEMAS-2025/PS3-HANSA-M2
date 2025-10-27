import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../utils/api";

interface Repository {
  _id: string;
  name: string;
  description?: string;
  typeRepo: "simple" | "creator";
  mode?: "personal" | "grupal";
  privacy?: "public" | "private";
  owner: { _id: string; username: string };
  participants: { user: { _id: string; username: string }; role: string }[];
  fileCount?: number;
  createdAt: string;
}

const MyRepositoriesPage: React.FC = () => {
  const [reposOwner, setReposOwner] = useState<Repository[]>([]);
  const [reposMember, setReposMember] = useState<Repository[]>([]);
  const [summary, setSummary] = useState({ total: 0, owner: 0, member: 0, files: 0 });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/repositorios/mis-repositorios", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const ownerRepos = res.data?.ownerRepos || [];
        const memberRepos = res.data?.memberRepos || [];
        const totals = res.data?.totals || { total: 0, owner: 0, member: 0, files: 0 };

        setReposOwner(ownerRepos);
        setReposMember(memberRepos);
        setSummary(totals);

      } catch (err) {
        console.error("Error cargando repositorios:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);





  if (loading) return <p className="text-center mt-10">Cargando repositorios...</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-50 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-primary)]">Mis Repositorios</h1>
        <Link
  to="/repositorio/nuevo"
  className="bg-[var(--color-primary)] text-white px-6 py-2 rounded hover:bg-opacity-30 transition"
>
  Crear Repositorio
</Link>

      </div>

      {/* DASHBOARD RESUMEN */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <h3 className="text-sm text-gray-500">Total</h3>
          <p className="text-2xl font-bold text-[var(--color-primary)]">{summary.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <h3 className="text-sm text-gray-500">Propietario</h3>
          <p className="text-2xl font-bold text-[var(--color-primary)]">{summary.owner}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <h3 className="text-sm text-gray-500">Miembro</h3>
          <p className="text-2xl font-bold text-[var(--color-primary)]">{summary.member}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <h3 className="text-sm text-gray-500">Archivos</h3>
          <p className="text-2xl font-bold text-[var(--color-primary)]">{summary.files}</p>
        </div>
      </div>

      {/* SECCIÓN: MIS REPOS PROPIOS */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Repositorios Propios</h2>
        {reposOwner.length === 0 ? (
          <p className="text-gray-600">Aún no tienes repositorios propios.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {reposOwner
              .sort((a, b) =>
                a.mode === "personal" && b.mode !== "personal"
                  ? -1
                  : a.mode !== "personal" && b.mode === "personal"
                  ? 1
                  : 0
              )
              .map((repo) => (
                <Link to={`/repositorio/${repo._id}`} key={repo._id}>
                  <div className="bg-white rounded-xl p-5 shadow hover:shadow-lg transition border-t-4 border-[var(--color-primary)]">
                    <h3 className="font-semibold text-[var(--color-primary)] text-lg mb-1">
                      {repo.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {repo.description || "Sin descripción"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Tipo: {repo.typeRepo === "creator" ? "Creador" : "Simple"} •{" "}
                      {repo.mode || "—"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Archivos: {repo.fileCount || 0} • Creado:{" "}
                      {new Date(repo.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        )}
      </section>

      {/* SECCIÓN: DONDE SOY MIEMBRO */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Repositorios donde soy miembro</h2>
        {reposMember.length === 0 ? (
          <p className="text-gray-600">No participas en otros repositorios todavía.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {reposMember
              .sort((a, b) => (a.typeRepo === "creator" ? -1 : b.typeRepo === "creator" ? 1 : 0))
              .map((repo) => (
                <Link to={`/repositorio/${repo._id}`} key={repo._id}>
                  <div className="bg-white rounded-xl p-5 shadow hover:shadow-lg transition border-t-4 border-[var(--color-primarytwo)]">
                    <h3 className="font-semibold text-[var(--color-primary)] text-lg mb-1">
                      {repo.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {repo.description || "Sin descripción"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Tipo: {repo.typeRepo === "creator" ? "Creador" : "Simple"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Dueño: {repo.owner?.username || "Desconocido"}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        )}
      </section>

      
    </div>
  );
};

export default MyRepositoriesPage;
