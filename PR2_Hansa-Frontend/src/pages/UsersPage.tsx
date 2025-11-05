import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getPublicUsers } from "../services/userService";

interface User {
  _id: string;
  username: string;
  bio?: string;
  profileImage?: string;
  repoCount?: number;
  userType?: string;
  hobbies?: string[];
  isPublic?: boolean;
  createdAt?: string;
}

const UsersPage: React.FC = () => {
  const [filter, setFilter] = useState<"all" | "repos" | "antiguos" | "recientes">("all");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🔹 Cargar usuarios desde el backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const sortBy =
        filter === "repos"
          ? "repos"
          : filter === "antiguos"
          ? "antiguedad"
          : filter === "recientes"
          ? "reciente"
          : undefined;

      const data = await getPublicUsers({
        search: search.trim(),
        sortBy,
      });
      setUsers(data);
    } catch (err) {
      console.error("❌ Error al cargar usuarios:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filter, search]);

  // 🔹 Agrupar usuarios (por tipo)
  const groupedUsers = {
    Creadores: users.filter((u) => u.userType === "Investigador" || u.userType === "Académico"),
    Miembros: users.filter((u) => u.userType === "Administrador" || u.userType === "Estudiante"),
    Generales: users.filter(
      (u) => !["Investigador", "Académico", "Administrador", "Estudiante"].includes(u.userType || "")
    ),
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Filtros y buscador */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
        {/* Filtros */}
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "all", label: "Todos" },
            { key: "repos", label: "Más repositorios" },
            { key: "recientes", label: "Más recientes" },
            { key: "antiguos", label: "Más antiguos" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as any)}
              className={`px-3 py-1 rounded-full border text-sm transition ${
                filter === f.key
                  ? "bg-pink-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Buscador */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-3 pr-8 py-1.5 border rounded-md text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
          />
          <FiSearch className="absolute right-2 top-2 text-gray-500" />
        </div>
      </div>

      {/* Cargando */}
      {loading ? (
        <p className="text-center text-gray-500">Cargando usuarios...</p>
      ) : (
        <>
          {Object.entries(groupedUsers).map(([title, group]) => (
            <div key={title} className="mb-8">
              <h2 className="text-lg font-semibold text-pink-600 mb-4">
                {title}
              </h2>

              {group.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No hay usuarios en esta categoría.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {group.map((user) => (
                    <div
                      key={user._id}
                      onClick={() =>
                        user.isPublic
                          ? navigate(`/usuarios/${user._id}`)
                          : alert("Este perfil es privado.")
                      }
                      className={`bg-white rounded-lg shadow-sm hover:shadow-md transition p-4 cursor-pointer ${
                        !user.isPublic ? "opacity-70" : ""
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <img
                          src={
                            user.profileImage ||
                            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                          }
                          alt="Avatar"
                          className="w-12 h-12 rounded-full border"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-800 text-sm">
                            {user.username}
                          </h3>
                          <p className="text-gray-500 text-xs">
                            {user.bio || "Sin descripción"}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 flex justify-between">
                        <span>Repos: {user.repoCount ?? 0}</span>
                        <span>{user.userType || "General"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default UsersPage;
