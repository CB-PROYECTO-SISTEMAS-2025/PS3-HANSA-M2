import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSave, FiX, FiUser, FiBook, FiHeart, FiEye, FiEyeOff, FiCamera, FiUpload } from "react-icons/fi";
import { getMyProfile, updateMyProfile, uploadProfileImage } from "../services/userProfileService";

const universidades = [
  "UMMS (Universidad Mayor de San Simón)",
  "Univalle",
  "Universidad Católica",
  "EMI (Escuela Militar de Ingeniería)",
];

const temas = [
  { id: "univalle", label: "Univalle", gradient: "from-[#9D0045] to-[#C73872]" },
  { id: "ocean", label: "Océano", gradient: "from-blue-500 to-cyan-400" },
  { id: "sunset", label: "Atardecer", gradient: "from-pink-500 to-orange-400" },
  { id: "forest", label: "Bosque", gradient: "from-emerald-400 to-teal-500" },
  { id: "night", label: "Noche", gradient: "from-gray-800 to-gray-600" },
  { id: "passion", label: "Pasión", gradient: "from-rose-500 to-red-500" },
  { id: "purple", label: "Púrpura", gradient: "from-purple-500 to-indigo-600" },
  { id: "mint", label: "Menta", gradient: "from-green-400 to-emerald-500" },
];

export default function EditarPerfilPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [userId, setUserId] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [universidad, setUniversidad] = useState(universidades[0]);
  const [carrera, setCarrera] = useState("");
  const [nivel, setNivel] = useState("");
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [nuevoHobby, setNuevoHobby] = useState("");
  const [temaSeleccionado, setTemaSeleccionado] = useState("univalle");
  const [isPublic, setIsPublic] = useState(true);
  const [profileImage, setProfileImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile(token!);
        setUserId(data._id);
        setNombre(data.nombre || "");
        setApellido(data.apellido || "");
        setUsername(data.username || "");
        setBio(data.bio || "");
        setIsPublic(data.isPublic ?? true);
        setHobbies(data.hobbies || []);
        setCarrera(data.student?.carrera || "");
        setNivel(data.student?.nivel || "");
        setUniversidad(data.student?.institucion || universidades[0]);
        setTemaSeleccionado(data.profileStyles?.[0] || "univalle");
        setProfileImage(data.profileImage || "");
      } catch (err) {
        console.error("Error al cargar perfil:", err);
      }
    };
    fetchProfile();
  }, []);

  const guardarCambios = async () => {
    try {
      const payload = {
        nombre,
        apellido,
        bio,
        isPublic,
        hobbies,
        profileStyles: [temaSeleccionado],
        student: {
          institucion: universidad,
          carrera,
          nivel,
        },
      };
      await updateMyProfile(userId, payload, token!);
      alert("✅ Perfil actualizado correctamente");
      navigate("/profile");
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
      alert("❌ Error al actualizar perfil");
    }
  };

  const agregarHobby = () => {
    if (nuevoHobby.trim() && !hobbies.includes(nuevoHobby)) {
      setHobbies([...hobbies, nuevoHobby]);
      setNuevoHobby("");
    }
  };

  const eliminarHobby = (hobby: string) => {
    setHobbies(hobbies.filter((h) => h !== hobby));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("❌ La imagen no puede pesar más de 5MB");
      return;
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      alert("❌ Solo se permiten archivos de imagen");
      return;
    }

    try {
      setUploading(true);
      const result = await uploadProfileImage(file, token!);
      setProfileImage(result.profileImage);
      
      // Disparar evento para actualizar el sidebar
      window.dispatchEvent(new Event('profileUpdated'));
      
      alert("✅ Foto de perfil actualizada");
    } catch (error) {
      console.error("Error al subir imagen:", error);
      alert("❌ Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  const temaActual = temas.find(t => t.id === temaSeleccionado) || temas[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primarytwo)] bg-clip-text text-transparent mb-2">
            Editar Perfil
          </h1>
          <p className="text-gray-600">Personaliza tu información y apariencia</p>
        </motion.div>

        {/* Contenido Principal */}
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Panel Izquierdo - Preview */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              {/* Vista previa con tema */}
              <div className={`bg-gradient-to-r ${temaActual.gradient} rounded-xl p-6 mb-6 relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                </div>
                <div className="relative flex flex-col items-center">
                  {/* Avatar con opción de cambiar foto */}
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-white p-1 shadow-xl">
                      {profileImage ? (
                        <img 
                          src={profileImage} 
                          alt="Perfil" 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className={`w-full h-full rounded-full bg-gradient-to-br ${temaActual.gradient} flex items-center justify-center text-white text-3xl font-bold`}>
                          {nombre.charAt(0).toUpperCase() || "?"}
                        </div>
                      )}
                    </div>
                    
                    {/* Botón de cambiar foto */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="absolute -bottom-1 -right-1 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      {uploading ? (
                        <div className="animate-spin w-4 h-4 border-2 border-[var(--color-primary)] border-t-transparent rounded-full" />
                      ) : (
                        <FiCamera className="w-4 h-4 text-[var(--color-primary)]" />
                      )}
                    </motion.button>
                    
                    {/* Input oculto para seleccionar archivo */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                  
                  <h2 className="text-xl font-bold text-white text-center mt-3">
                    {nombre || "Tu nombre"} {apellido || ""}
                  </h2>
                  <p className="text-white/90 text-sm">@{username || "usuario"}</p>
                </div>
              </div>

              {/* Info adicional */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <FiBook className="w-4 h-4" />
                  <span>{carrera || "Sin carrera"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  {isPublic ? <FiEye className="w-4 h-4" /> : <FiEyeOff className="w-4 h-4" />}
                  <span>{isPublic ? "Perfil público" : "Perfil privado"}</span>
                </div>
              </div>

              {/* Info de imagen */}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-start gap-2">
                  <FiCamera className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-blue-800">
                    <p className="font-semibold mb-1">Foto de perfil</p>
                    <p className="text-blue-600">Haz clic en el ícono de cámara para cambiar tu foto (máx 5MB)</p>
                  </div>
                </div>
              </div>

              {/* Toggle público/privado */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-medium text-gray-700">Perfil público</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={isPublic}
                      onChange={() => setIsPublic(!isPublic)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[var(--color-primary)] peer-checked:to-[var(--color-primarytwo)]"></div>
                  </div>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Panel Derecho - Formulario */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 sm:p-8"
          >
            
            {/* Información Personal */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiUser className="text-[var(--color-primary)]" />
                Información Personal
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                  <input
                    className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                    placeholder="Tu nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                  <input
                    className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                    placeholder="Tu apellido"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
                  <input
                    className="w-full border-2 border-gray-200 rounded-xl p-3 bg-gray-50 cursor-not-allowed"
                    placeholder="Usuario"
                    value={username}
                    disabled
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Biografía</label>
                  <textarea
                    className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-pink-100 outline-none transition-all resize-none"
                    rows={3}
                    placeholder="Cuéntanos sobre ti..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Información Académica */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiBook className="text-[var(--color-primary)]" />
                Información Académica
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Universidad</label>
                  <select
                    className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                    value={universidad}
                    onChange={(e) => setUniversidad(e.target.value)}
                  >
                    {universidades.map((u) => (
                      <option key={u}>{u}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Carrera</label>
                  <input
                    className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                    placeholder="Ej: Ingeniería de Sistemas"
                    value={carrera}
                    onChange={(e) => setCarrera(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nivel/Semestre</label>
                  <input
                    className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                    placeholder="Ej: 5to Semestre"
                    value={nivel}
                    onChange={(e) => setNivel(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Hobbies */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiHeart className="text-[var(--color-primary)]" />
                Hobbies e Intereses
              </h2>
              <div className="flex gap-2 mb-4">
                <input
                  className="flex-1 border-2 border-gray-200 rounded-xl p-3 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                  value={nuevoHobby}
                  onChange={(e) => setNuevoHobby(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && agregarHobby()}
                  placeholder="Ej: Programación, Fotografía..."
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={agregarHobby}
                  className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primarytwo)] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  + Agregar
                </motion.button>
              </div>
              <div className="flex flex-wrap gap-2">
                {hobbies.map((h) => (
                  <motion.span
                    key={h}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="bg-gradient-to-r from-[var(--color-primaryfaint)] to-pink-100 text-[var(--color-primary)] px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-md"
                  >
                    {h}
                    <button 
                      onClick={() => eliminarHobby(h)} 
                      className="hover:bg-white/50 rounded-full w-5 h-5 flex items-center justify-center font-bold transition-colors"
                    >
                      ×
                    </button>
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Tema Visual */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                🎨 Tema Visual
              </h2>
              <p className="text-sm text-gray-600 mb-4">Personaliza los colores de tu perfil</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {temas.map((t) => (
                  <motion.div
                    key={t.id}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTemaSeleccionado(t.id)}
                    className={`relative cursor-pointer rounded-xl overflow-hidden shadow-lg transition-all ${
                      temaSeleccionado === t.id ? "ring-4 ring-[var(--color-primary)] ring-offset-2" : ""
                    }`}
                  >
                    <div className={`h-20 bg-gradient-to-r ${t.gradient}`}></div>
                    <div className="p-2 bg-white">
                      <p className="text-xs font-semibold text-center text-gray-700">{t.label}</p>
                    </div>
                    {temaSeleccionado === t.id && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-lg"
                      >
                        <svg className="w-4 h-4 text-[var(--color-primary)]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end pt-6 border-t">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                onClick={() => navigate("/profile")}
              >
                <FiX className="w-5 h-5" />
                Cancelar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={guardarCambios}
                className="px-6 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primarytwo)] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <FiSave className="w-5 h-5" />
                Guardar Cambios
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
