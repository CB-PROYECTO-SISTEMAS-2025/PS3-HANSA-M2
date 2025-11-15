import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "../../../utils/api";
import { FiSearch } from "react-icons/fi";

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

  // Filtros
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "simple" | "creator">("all");
  const [roleFilter, setRoleFilter] = useState<"all" | "owner" | "member">("all");
  const [orderFilter, setOrderFilter] = useState<"recent" | "oldest">("recent");

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

  // 🔍 Aplicar filtros en memoria
  const filteredRepos = useMemo(() => {
    let combined: Repository[] = [];

    // Determinar conjuntos según filtro de rol
    if (roleFilter === "all" || roleFilter === "owner") combined = combined.concat(reposOwner);
    if (roleFilter === "all" || roleFilter === "member") combined = combined.concat(reposMember);

    // Filtro de búsqueda
    if (search.trim()) {
      combined = combined.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filtro de tipo
    if (typeFilter !== "all") {
      combined = combined.filter((r) => r.typeRepo === typeFilter);
    }

    // Orden
    combined = combined.sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return orderFilter === "recent" ? db - da : da - db;
    });

    return combined;
  }, [reposOwner, reposMember, search, typeFilter, roleFilter, orderFilter]);

  if (loading) return <p className="text-center mt-10">Cargando repositorios...</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-50 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-primary)]">
          Mis Repositorios
        </h1>
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
          <h3 className="text-sm text-gray-500">Total Repositorios</h3>
          <p className="text-2xl font-bold text-[var(--color-primary)]">
            {summary.total}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <h3 className="text-sm text-gray-500">Como Propietario</h3>
          <p className="text-2xl font-bold text-[var(--color-primary)]">
            {summary.owner}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <h3 className="text-sm text-gray-500">Como Colaborador</h3>
          <p className="text-2xl font-bold text-[var(--color-primary)]">
            {summary.member}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <h3 className="text-sm text-gray-500">Archivos Totales</h3>
          <p className="text-2xl font-bold text-[var(--color-primary)]">
            {summary.files}
          </p>
        </div>
      </div>

      {/* FILTROS */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        {/* Buscar */}
        <div className="flex items-center border rounded-md bg-white px-3 py-1.5 shadow-sm">
          <FiSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Nombre del repositorio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="outline-none text-sm w-48"
          />
        </div>

        {/* Tipo */}
        <div className="flex items-center text-sm">
          <span className="text-gray-600 mr-2">Tipo:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="border rounded-md px-2 py-1 bg-white shadow-sm"
          >
            <option value="all">Todos los tipos</option>
            <option value="simple">Simple</option>
            <option value="creator">Creador</option>
          </select>
        </div>

        {/* Rol */}
        <div className="flex items-center text-sm">
          <span className="text-gray-600 mr-2">Rol:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="border rounded-md px-2 py-1 bg-white shadow-sm"
          >
            <option value="all">Todos los roles</option>
            <option value="owner">Propietario</option>
            <option value="member">Colaborador</option>
          </select>
        </div>

        {/* Ordenar */}
        <div className="flex items-center text-sm">
          <span className="text-gray-600 mr-2">Ordenar:</span>
          <select
            value={orderFilter}
            onChange={(e) => setOrderFilter(e.target.value as any)}
            className="border rounded-md px-2 py-1 bg-white shadow-sm"
          >
            <option value="recent">Más recientes</option>
            <option value="oldest">Más antiguos</option>
          </select>
        </div>
      </div>

      {/* LISTA FILTRADA */}
      {filteredRepos.length === 0 ? (
        <p className="text-gray-600">
          No se encontraron repositorios con los filtros seleccionados.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRepos.map((repo) => (
            <Link to={`/repositorio/${repo._id}`} key={repo._id}>
              <div
                className={`bg-white rounded-xl p-5 shadow hover:shadow-lg transition border-t-4 
                  ${
                    repo.mode === "personal"
                      ? "border-blue-500"
                      : "border-[var(--color-primary)]"
                  }`}
              >
                <h3
                  className={`font-semibold text-lg mb-1 
                    ${
                      repo.mode === "personal"
                        ? "text-blue-600"
                        : "text-[var(--color-primary)]"
                    }`}
                >
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
    </div>
  );
};

export default MyRepositoriesPage;
