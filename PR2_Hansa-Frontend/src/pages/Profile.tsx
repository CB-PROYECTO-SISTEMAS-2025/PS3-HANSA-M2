import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiEdit2, FiMapPin, FiBook, FiAward, FiTrendingUp } from "react-icons/fi";
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

  const temas: Record<string, string> = {
    "univalle": "from-[#9D0045] to-[#C73872]",
    "ocean": "from-blue-500 to-cyan-400",
    "sunset": "from-pink-500 to-orange-400",
    "forest": "from-emerald-400 to-teal-500",
    "night": "from-gray-800 to-gray-600",
    "passion": "from-rose-500 to-red-500",
    "purple": "from-purple-500 to-indigo-600",
    "mint": "from-green-400 to-emerald-500",
  };

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

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--color-primary)] mx-auto"></div>
        <p className="mt-4 text-gray-600 font-medium">Cargando perfil...</p>
      </div>
    </div>
  );
  
  if (!user) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <p className="text-center text-gray-600">No se encontró tu perfil</p>
    </div>
  );

  const temaUsuario = user.profileStyles?.[0] || "univalle";
  const gradienteTema = temas[temaUsuario] || temas["univalle"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header con gradiente personalizado */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative bg-gradient-to-r ${gradienteTema} rounded-3xl shadow-2xl overflow-hidden mb-6`}
        >
          {/* Patrón decorativo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
          </div>

          <div className="relative px-6 sm:px-10 py-8 sm:py-12">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              
              {/* Avatar */}
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 3 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative"
              >
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-white p-1.5 shadow-2xl">
                  <img
                    src={user.profileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    alt="Perfil"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg cursor-pointer"
                  onClick={() => navigate("/editProfile")}
                >
                  <FiEdit2 className="w-4 h-4 text-[var(--color-primary)]" />
                </motion.div>
              </motion.div>

              {/* Info básica */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  {user.nombre} {user.apellido}
                </h1>
                <p className="text-[var(--color-primaryfaint)] text-lg font-medium mb-3">
                  @{user.username}
                </p>
                <p className="text-white/90 text-base max-w-2xl leading-relaxed">
                  {user.bio || "Sin biografía"}
                </p>

                {/* Info académica en el header */}
                {user.student && (
                  <div className="mt-4 flex flex-wrap gap-4 justify-center sm:justify-start text-white/90">
                    <div className="flex items-center gap-2">
                      <FiBook className="w-4 h-4" />
                      <span className="text-sm">{user.student.carrera}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiMapPin className="w-4 h-4" />
                      <span className="text-sm">{user.student.institucion}</span>
                    </div>
                    {user.student.nivel && (
                      <div className="flex items-center gap-2">
                        <FiAward className="w-4 h-4" />
                        <span className="text-sm">{user.student.nivel}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Botón editar (desktop) */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/editProfile")}
                className="hidden sm:block bg-white text-[var(--color-primary)] px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
              >
                <FiEdit2 className="inline mr-2" />
                Editar Perfil
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Estadísticas */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6"
        >
          {[
            { label: "Repositorios", value: user.repoCount ?? 0, icon: "📁", color: "from-blue-500 to-blue-600" },
            { label: "Archivos", value: user.fileCount ?? 0, icon: "📄", color: "from-green-500 to-green-600" },
            { label: "Colaboraciones", value: 4, icon: "🤝", color: "from-purple-500 to-purple-600" },
            { label: "Progreso", value: "85%", icon: "📈", color: "from-orange-500 to-orange-600" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 relative overflow-hidden group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
              <div className="relative">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <p className="text-3xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primarytwo)] bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600 font-medium mt-1">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Hobbies e Intereses */}
        {user.hobbies && user.hobbies.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🎯</span> Intereses y Hobbies
            </h2>
            <div className="flex flex-wrap gap-3">
              {user.hobbies.map((hobby, index) => (
                <motion.span
                  key={hobby}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="bg-gradient-to-r from-[var(--color-primaryfaint)] to-pink-100 text-[var(--color-primary)] px-5 py-2.5 rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition-all cursor-default"
                >
                  {hobby}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Sección adicional - Actividad reciente (placeholder) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-6 sm:p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FiTrendingUp className="text-[var(--color-primary)]" />
            Actividad Reciente
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primarytwo)] rounded-full flex items-center justify-center text-white font-bold">
                📝
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Subiste un nuevo archivo</p>
                <p className="text-sm text-gray-500">Hace 2 horas</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                🤝
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Te uniste a un repositorio</p>
                <p className="text-sm text-gray-500">Hace 1 día</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Botón editar (mobile) */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/editProfile")}
          className="sm:hidden w-full mt-6 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primarytwo)] text-white px-6 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
        >
          <FiEdit2 className="w-5 h-5" />
          Editar Perfil
        </motion.button>

      </div>
    </div>
  );
};

export default ProfilePage;
