import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProfile } from "../services/userProfileService";

interface User {
  _id: string;
  nombre?: string;
  apellido?: string;
  username: string;
  bio?: string;
  profileImage?: string;
  hobbies?: string[];
  userType?: string;
  student?: { institucion?: string; carrera?: string; nivel?: string };
  repoCount?: number;
  fileCount?: number;
  profileStyles?: string[];
}

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        alert("Debes iniciar sesión para ver tu perfil.");
        navigate("/login");
        return;
      }
      try {
        setLoading(true);
        const data = await getMyProfile(token);
        setUser(data);
      } catch (err) {
        console.error("❌ Error al cargar perfil:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <p className="text-center mt-10">Cargando perfil...</p>;
  if (!user) return <p className="text-center mt-10">No se encontró tu perfil</p>;

  // Determinar color/tema visual si tiene estilos
  const tema =
    user.profileStyles?.[0] || "from-indigo-500 to-purple-500"; // fallback

  return (
    <div className={`min-h-screen bg-gradient-to-r ${tema} p-6`}>
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          {/* Avatar */}
          <img
            src={
              user.profileImage ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="Perfil"
            className="w-32 h-32 rounded-full object-cover border-4 border-pink-500"
          />

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800">
              {user.nombre} {user.apellido}
            </h1>
            <p className="text-pink-600 text-sm">@{user.username}</p>
            <p className="mt-2 text-gray-600">{user.bio || "Sin biografía"}</p>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-pink-600">
                  {user.repoCount ?? 0}
                </p>
                <p className="text-xs text-gray-500">Repositorios</p>
              </div>
              <div>
                <p className="text-lg font-bold text-pink-600">
                  {user.fileCount ?? 0}
                </p>
                <p className="text-xs text-gray-500">Archivos</p>
              </div>
              <div>
                <p className="text-lg font-bold text-pink-600">4</p>
                <p className="text-xs text-gray-500">Colaboraciones</p>
              </div>
              <div>
                <p className="text-lg font-bold text-pink-600">85%</p>
                <p className="text-xs text-gray-500">Progreso</p>
              </div>
            </div>

            {/* Info académica */}
            {user.student && (
              <div className="mt-4 text-sm text-gray-600">
                <p>
                  🎓 {user.student.carrera} — {user.student.institucion}
                </p>
                <p>Nivel: {user.student.nivel}</p>
              </div>
            )}

            {/* Hobbies */}
            {user.hobbies && user.hobbies.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  🎯 Hobbies:
                </p>
                <div className="flex flex-wrap gap-2">
                  {user.hobbies.map((hobby) => (
                    <span
                      key={hobby}
                      className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-xs"
                    >
                      {hobby}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Botón editar */}
            <div className="mt-6">
              <button
                onClick={() => navigate("/editProfile")}
                className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
              >
                ✏️ Editar Perfil
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
