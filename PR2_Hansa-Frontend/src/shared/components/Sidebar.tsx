import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiFolder, FiLogOut, FiBell, FiUser, FiUsers } from 'react-icons/fi';
import { useNavigate } from "react-router-dom";
import { getMyProfile } from '../../services/userProfileService';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const SidebarNavigation: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const data = await getMyProfile(token);
          setProfileImage(data.profileImage || "");
          setUserName(data.nombre || data.username || "Usuario");
        }
      } catch (error) {
        console.error("Error al cargar perfil:", error);
      }
    };
    fetchProfile();

    // Escuchar evento de actualización de perfil
    const handleProfileUpdate = () => {
      fetchProfile();
    };
    window.addEventListener('profileUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/'; // Cambia si tu login tiene otra ruta
  };

  const handleNavigateProfile = () => {
    navigate("/profile");
  };

  const menuItems = [
    { id: 1, icon: <FiHome className="w-5 h-5" />, label: "Inicio", onClick: () => navigate("/home") },
    { id: 2, icon: <FiFolder className="w-5 h-5" />, label: "Mis Repositorios", onClick: () => navigate("/mis-repositorios") },
    { id: 3, icon: <FiBell className="w-5 h-5" />, label: "Notificaciones", onClick: () => navigate("/notificaciones") },
    { id: 4, icon: <FiUsers className="w-5 h-5" />, label: "Usuarios", onClick: () => navigate("/usuarios") },
    { id: 5, icon: <FiUser className="w-5 h-5" />, label: "Mi Perfil", onClick: handleNavigateProfile },
    { id: 6, icon: <FiLogOut className="w-5 h-5" />, label: "Cerrar sesión", onClick: handleLogout },
  ];

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-sm z-30 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed top-0 left-0 z-40 h-screen w-64 bg-gradient-to-b from-white to-gray-50 dark:bg-gradient-to-b dark:from-gray-800 dark:to-gray-900 shadow-2xl border-r border-gray-200 dark:border-gray-700"
      >
        {/* Perfil */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="flex flex-col items-center py-6 border-b-2 border-gray-100 dark:border-gray-700 mt-16 cursor-pointer transition-all bg-white dark:bg-gray-800/50"
          onClick={handleNavigateProfile}
        >
          <motion.div 
            whileHover={{ scale: 1.08, rotate: 3 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative w-24 h-24 mb-3 overflow-hidden rounded-full shadow-xl"
            style={{
              background: 'linear-gradient(135deg, #9D0045 0%, #C73872 100%)',
              padding: '3px'
            }}
          >
            <div className="w-full h-full rounded-full overflow-hidden bg-white">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#9D0045] to-[#C73872] text-white text-3xl font-bold">
                  {userName.charAt(0).toUpperCase() || "?"}
                </div>
              )}
            </div>
          </motion.div>
          <h2 className="text-lg font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primarytwo)] bg-clip-text text-transparent">
            {user.username || "Usuario"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user.email || "correo@ejemplo.com"}</p>
        </motion.div>

        {/* Navegación */}
        <nav className="px-4 py-6">
          <ul className="space-y-1.5">
            {menuItems.map((item, index) => (
              <motion.li 
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <motion.button
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={item.onClick}
                  className={`
                    flex items-center w-full px-4 py-3 text-left rounded-xl
                    transition-all duration-200 group relative overflow-hidden
                    ${item.id === 6 
                      ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20' 
                      : 'text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700/50'
                    }
                    shadow-sm hover:shadow-md
                  `}
                >
                  {/* Borde gradiente al hover (solo items normales) */}
                  {item.id !== 6 && (
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl"
                      style={{
                        background: 'linear-gradient(90deg, #9D0045 0%, transparent 100%)',
                        width: '3px'
                      }}
                    />
                  )}
                  
                  <span className={`
                    transition-colors duration-200 relative z-10
                    ${item.id === 6 
                      ? 'group-hover:scale-110' 
                      : 'group-hover:text-[var(--color-primary)]'
                    }
                  `}>
                    {item.icon}
                  </span>
                  <span className={`
                    ml-3 font-semibold transition-colors duration-200
                    ${item.id === 6 
                      ? '' 
                      : 'group-hover:text-[var(--color-primary)]'
                    }
                  `}>
                    {item.label}
                  </span>
                  
                  {/* Indicador de hover sutil */}
                  {item.id !== 6 && (
                    <motion.div
                      className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                      initial={{ x: -10 }}
                      whileHover={{ x: 0 }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primarytwo)]" />
                    </motion.div>
                  )}
                </motion.button>
              </motion.li>
            ))}
          </ul>
        </nav>
      </motion.aside>
    </>
  );
};

export default SidebarNavigation;
