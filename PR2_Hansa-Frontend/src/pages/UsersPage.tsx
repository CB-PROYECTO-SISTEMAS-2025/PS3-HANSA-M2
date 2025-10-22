import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";

interface User {
  id: number;
  name: string;
  role: "General" | "Creador" | "Miembro";
  description: string;
  repositories: number;
}

const UsersPage: React.FC = () => {
  const [filter, setFilter] = useState<"all" | "repos" | "antiguos">("all");
  const [search, setSearch] = useState("");

  const users: User[] = [
    { id: 1, name: "María López", role: "General", description: "Investigadora de datos", repositories: 3 },
    { id: 2, name: "Juan Torres", role: "Creador", description: "Desarrollador backend", repositories: 5 },
    { id: 3, name: "Laura Pérez", role: "Miembro", description: "Diseñadora UI/UX", repositories: 2 },
    { id: 4, name: "Andrés Vargas", role: "Creador", description: "Analista de sistemas", repositories: 6 },
    { id: 5, name: "Camila Soto", role: "General", description: "QA Tester", repositories: 1 },
    { id: 6, name: "Diego Morales", role: "Miembro", description: "Frontend Developer", repositories: 4 },
  ];

  const filteredUsers = users
    .filter(u => u.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (filter === "repos") return b.repositories - a.repositories;
      return 0;
    });

  const groupedUsers = {
    General: filteredUsers.filter(u => u.role === "General"),
    Creador: filteredUsers.filter(u => u.role === "Creador"),
    Miembro: filteredUsers.filter(u => u.role === "Miembro"),
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        {/* Filtros */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-full border text-sm ${
              filter === "all"
                ? "bg-pink-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Todos los tipos
          </button>
          <button
            onClick={() => setFilter("repos")}
            className={`px-3 py-1 rounded-full border text-sm ${
              filter === "repos"
                ? "bg-pink-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Más repositorios
          </button>
          <button
            onClick={() => setFilter("antiguos")}
            className={`px-3 py-1 rounded-full border text-sm ${
              filter === "antiguos"
                ? "bg-pink-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Antigüedad
          </button>
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

      {/* Secciones */}
      {Object.entries(groupedUsers).map(([role, users]) => (
        <div key={role} className="mb-8">
          <h2 className="text-lg font-semibold text-pink-600 mb-4">
            Usuarios {role === "General" ? "Generales" : role === "Creador" ? "Creadores" : "Miembros"}
          </h2>
          {users.length === 0 ? (
            <p className="text-gray-500 text-sm">No hay usuarios en esta categoría.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition p-4 flex flex-col"
                >
                  <p className="text-lg font-medium mb-2 text-center">“Quote”</p>
                  <div className="flex items-center space-x-3">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      alt="User avatar"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm">{user.name}</h3>
                      <p className="text-gray-500 text-xs">{user.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UsersPage;
