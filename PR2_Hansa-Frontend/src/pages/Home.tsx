import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import img from "../assets/user.png";

interface Repo {
  _id: string;
  name: string;
  description?: string;
  typeRepo: string;
  owner?: { username: string };
  featured?: boolean;
  isRxUno?: boolean;
}

interface User {
  _id: string;
  username: string;
  bio?: string;
  profileImage?: string;
  repoCount?: number;
  hobbies?: string[];
}

const Home: React.FC = () => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [myFiles, setMyFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // 🔘 Filtros activos (acumulativos)
  const [filters, setFilters] = useState({
    all: true,
    users: false,
    repos: false,
    files: false,
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const repoRes = await api.get("/api/repositorios/publicos");
        let allRepos = repoRes.data as Repo[];
        allRepos = allRepos.sort((a, b) => {
          if (a.isRxUno) return -1;
          if (b.isRxUno) return 1;
          if (a.typeRepo === "creator" && b.typeRepo !== "creator") return -1;
          if (b.typeRepo === "creator" && a.typeRepo !== "creator") return 1;
          return 0;
        });
        setRepos(allRepos);

        const usersRes = await api.get("/api/users");
        setUsers(usersRes.data);

        if (token) {
          const filesRes = await api.get("/api/files/my", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setMyFiles(filesRes.data);
        }
      } catch (err) {
        console.error("Error cargando datos del inicio:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ⚙️ Manejo de botones de filtro
  const toggleFilter = (key: "all" | "users" | "repos" | "files") => {
    if (key === "all") {
      // Activa solo "Todos los tipos"
      setFilters({ all: true, users: false, repos: false, files: false });
      return;
    }

    // Si se presiona un filtro individual, desactiva "all"
    const updated = { ...filters, all: false, [key]: !filters[key] };

    // Si todos quedan desmarcados → vuelve a "Todos los tipos"
    if (!updated.users && !updated.repos && !updated.files) {
      updated.all = true;
    }

    setFilters(updated);
  };

  const resetFilters = () => {
    setFilters({ all: true, users: false, repos: false, files: false });
    setSearch("");
  };

  // 🔍 Filtrado dinámico
  const filteredData = useMemo(() => {
    const query = search.toLowerCase();

    const activeUsers = filters.all || filters.users;
    const activeRepos = filters.all || filters.repos;
    const activeFiles = (filters.all || filters.files) && token;

    return {
      users: activeUsers
        ? users.filter((u) => u.username.toLowerCase().includes(query))
        : [],
      repos: activeRepos
        ? repos.filter((r) => r.name.toLowerCase().includes(query))
        : [],
      files: activeFiles
        ? myFiles.filter((f) => f.filename.toLowerCase().includes(query))
        : [],
    };
  }, [filters, search, users, repos, myFiles, token]);

  const handleOpenRepo = (repo: Repo) => {
    if (repo.typeRepo === "creator") navigate(`/repositorio/creador/${repo._id}`);
    else navigate(`/repositorio/${repo._id}`);
  };

  if (loading) return <p className="text-center mt-10">Cargando datos...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 🔘 Barra y botones */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-[var(--color-primary)]">Inicio</h1>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => toggleFilter("all")}
            className={`px-4 py-2 rounded-md border ${
              filters.all
                ? "bg-[var(--color-primary)] text-white"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            Todos los tipos
          </button>

          <button
            onClick={() => toggleFilter("users")}
            className={`px-4 py-2 rounded-md border ${
              filters.users
                ? "bg-[var(--color-primary)] text-white"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            Usuarios
          </button>

          <button
            onClick={() => toggleFilter("repos")}
            className={`px-4 py-2 rounded-md border ${
              filters.repos
                ? "bg-[var(--color-primary)] text-white"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            Repositorios
          </button>

          {token && (
            <button
              onClick={() => toggleFilter("files")}
              className={`px-4 py-2 rounded-md border ${
                filters.files
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              Archivos
            </button>
          )}

          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300"
          >
            Reestablecer filtros
          </button>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="border border-gray-300 rounded-md px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
      </div>

      {/* Usuarios */}
      {filteredData.users.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Usuarios destacados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {filteredData.users.slice(0, 8).map((user) => (
              <div
                key={user._id}
                className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center text-center hover:shadow-lg transition"
              >
                <img
                  src={user.profileImage || img}
                  alt={user.username}
                  className="w-16 h-16 rounded-full mb-3 object-cover"
                />
                <h3 className="font-semibold">{user.username}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {user.bio || "Sin biografía"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {user.repoCount || 0} repositorios
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Repositorios */}
{filteredData.repos.length > 0 && (
  <section className="mb-10">
    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Repositorios públicos</h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {filteredData.repos.map((repo) => (
        <div
          key={repo._id}
          onClick={() => handleOpenRepo(repo)}
          className={`group relative bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer border-t-4
            ${
              repo.typeRepo === "creator"
                ? "border-blue-500" // azul para cocreador
                : "border-pink-500" // rosa para simple
            }
          `}
        >
          {/* TÍTULO */}
          <h3
            className={`font-semibold text-lg mb-2
              ${
                repo.typeRepo === "creator"
                  ? "text-blue-600" // texto azul
                  : "text-pink-600" // texto rosado
              }
            `}
          >
            {repo.name}
          </h3>

          {/* DESCRIPCION */}
          <p className="text-sm text-gray-600 mb-2">
            {repo.description || "Sin descripción"}
          </p>

          {/* TIPO REPO */}
          <p className="text-xs text-gray-700 font-medium">
            Tipo:{" "}
            {repo.typeRepo === "creator" ? "Cocreador" : "Simple"}
          </p>

          {/* DUEÑO */}
          <p className="text-xs text-gray-500">
            Dueño: {repo.owner?.username || "N/A"}
          </p>

          {/* RX.UNO */}
          {repo.isRxUno && (
            <p className="text-xs font-semibold text-blue-600 mt-1">
              ★ Proyecto RX.UNO
            </p>
          )}

          {/* ==============================
                      TOOLTIP
             ============================== */}
          <div
            className="absolute left-0 right-0 top-full mt-2 opacity-0 invisible 
                       group-hover:opacity-100 group-hover:visible
                       transition-all duration-200 bg-white border border-gray-300
                       shadow-xl rounded-lg p-3 text-xs text-gray-700 z-50"
          >
            {repo.typeRepo === "creator" ? (
              <>
                <p className="font-semibold text-blue-600 mb-1">
                  Repositorio de Cocreadores
                </p>
                <p>
                  Espacio para investigación avanzada, creación de software y desarrollo serio.
                  Para unirte debes aplicar y ser aceptado.
                </p>
              </>
            ) : (
              <>
                <p className="font-semibold text-pink-600 mb-1">
                  Repositorio Simple
                </p>
                <p>
                  Ideal para proyectos personales, compartir ideas, colaborar con amigos y
                  experimentar libremente.
                </p>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  </section>
)}


      {/* Archivos */}
      {token && filteredData.files.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Mis archivos</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredData.files.map((file) => (
              <li
                key={file._id}
                className="bg-gray-100 p-4 rounded-lg shadow-sm flex flex-col justify-between"
              >
                <p className="font-medium text-gray-800">{file.filename}</p>
                <p className="text-xs text-gray-500 mt-1">{file.metadata?.description}</p>
                <button
                  onClick={() =>
                    window.open(`/api/files/download/${file._id}`, "_blank")
                  }
                  className="mt-2 text-[var(--color-primary)] hover:underline text-sm text-right"
                >
                  Descargar
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Sin resultados */}
      {filteredData.users.length === 0 &&
        filteredData.repos.length === 0 &&
        filteredData.files.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No se encontraron resultados para “{search}”.
          </p>
        )}
    </div>
  );
};

export default Home;
