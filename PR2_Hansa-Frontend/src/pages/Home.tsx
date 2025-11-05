import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import img from "../assets/user.png";

interface Repo {
  _id: string;
  name: string;
  description?: string;
  typeRepo: string; // "creator" o "simple"
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
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Repos públicos (prioriza tipo Creador y RX.UNO)
        const repoRes = await api.get("/api/repositorios/publicos");
        let allRepos = repoRes.data as Repo[];

        // orden: RX.UNO → Creador → Simple
        allRepos = allRepos.sort((a, b) => {
          if (a.isRxUno) return -1;
          if (b.isRxUno) return 1;
          if (a.typeRepo === "creator" && b.typeRepo !== "creator") return -1;
          if (b.typeRepo === "creator" && a.typeRepo !== "creator") return 1;
          return 0;
        });

        setRepos(allRepos);

        // 2️⃣ Usuarios destacados
        const usersRes = await api.get("/api/users");
        setUsers(usersRes.data);

        // 3️⃣ Mis archivos (si está logueado)
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

  // 🔍 Filtro de repos
  const filteredRepos = repos.filter((r) =>
    r.name.toLowerCase().includes(filter.toLowerCase())
  );

  // 🚀 Navegación condicional según tipo de repo
  const handleOpenRepo = (repo: Repo) => {
    if (repo.typeRepo === "creator") navigate(`/repositorio/creador/${repo._id}`);
    else navigate(`/repositorio/${repo._id}`);
  };

  if (loading) return <p className="text-center mt-10">Cargando datos...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 🔍 Barra de búsqueda */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[var(--color-primary)]">Inicio</h1>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Buscar repositorios..."
          className="border border-gray-300 rounded-md px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
      </div>

      {/* 🧑‍💻 Usuarios destacados */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Usuarios destacados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {users.slice(0, 8).map((user) => (
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

      {/* 📁 Repositorios públicos */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Repositorios públicos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredRepos.map((repo) => (
            <div
              key={repo._id}
              onClick={() => handleOpenRepo(repo)}
              className={`bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer border-t-4 ${
                repo.typeRepo === "creator"
                  ? "border-blue-500"
                  : "border-[var(--color-primary)]"
              }`}
            >
              <h3
                className={`font-semibold text-lg mb-2 ${
                  repo.typeRepo === "creator"
                    ? "text-blue-600"
                    : "text-[var(--color-primary)]"
                }`}
              >
                {repo.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {repo.description || "Sin descripción"}
              </p>
              <p className="text-xs text-gray-500">
                Tipo: {repo.typeRepo === "creator" ? "Creador" : "Simple"}
              </p>
              <p className="text-xs text-gray-500">
                Dueño: {repo.owner?.username || "N/A"}
              </p>
              {repo.isRxUno && (
                <p className="text-xs font-semibold text-blue-500 mt-1">★ Proyecto RX.UNO</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 📂 Mis archivos (solo si logueado) */}
      {token && (
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Mis archivos</h2>
          {myFiles.length === 0 ? (
            <p className="text-gray-600">No tienes archivos aún.</p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {myFiles.map((file) => (
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
          )}
        </section>
      )}
    </div>
  );
};

export default Home;
