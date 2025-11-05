import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProfile, updateMyProfile } from "../services/userProfileService";

const universidades = [
  "UMMS (Universidad Mayor de San Simón)",
  "Univalle",
  "Universidad Católica",
  "EMI (Escuela Militar de Ingeniería)",
];

const temas = [
  { id: "from-indigo-500 to-purple-500", label: "Azul-Morado" },
  { id: "from-pink-500 to-orange-400", label: "Rosa-Naranja" },
  { id: "from-blue-500 to-cyan-400", label: "Azul-Celeste" },
  { id: "from-emerald-400 to-teal-500", label: "Verde-Agua" },
  { id: "from-gray-800 to-gray-600", label: "Gris-Oscuro" },
  { id: "from-rose-500 to-red-500", label: "Rosa-Rojo" },
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
  const [temaSeleccionado, setTemaSeleccionado] = useState(temas[0].id);
  const [isPublic, setIsPublic] = useState(true);

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
        setTemaSeleccionado(data.profileStyles?.[0] || temas[0].id);
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

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        {/* Izquierda */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-pink-600 text-white flex items-center justify-center text-3xl font-bold">
            {nombre.charAt(0) || "?"}
          </div>
          <h2 className="mt-4 text-lg font-semibold">
            {nombre} {apellido}
          </h2>
          <p className="text-sm text-gray-500">{carrera}</p>

          <div className="mt-6 w-full">
            <label className="flex items-center justify-between text-sm mb-2">
              <span>Perfil público</span>
              <input
                type="checkbox"
                checked={isPublic}
                onChange={() => setIsPublic(!isPublic)}
              />
            </label>
          </div>
        </div>

        {/* Derecha */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-4">✨ Editar Perfil</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              className="border rounded-lg p-2"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <input
              className="border rounded-lg p-2"
              placeholder="Apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
            />
            <input
              className="border rounded-lg p-2"
              placeholder="Usuario"
              value={username}
              disabled
            />
            <textarea
              className="border rounded-lg p-2 md:col-span-2"
              rows={3}
              placeholder="Biografía"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          {/* Académico */}
          <h2 className="font-semibold text-lg mb-2">🎓 Información Académica</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <select
              className="border rounded-lg p-2"
              value={universidad}
              onChange={(e) => setUniversidad(e.target.value)}
            >
              {universidades.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
            <input
              className="border rounded-lg p-2"
              placeholder="Carrera"
              value={carrera}
              onChange={(e) => setCarrera(e.target.value)}
            />
            <input
              className="border rounded-lg p-2 md:col-span-2"
              placeholder="Nivel/Semestre"
              value={nivel}
              onChange={(e) => setNivel(e.target.value)}
            />
          </div>

          {/* Hobbies */}
          <h2 className="font-semibold text-lg mb-2">🎯 Hobbies</h2>
          <div className="flex mb-3 gap-2">
            <input
              className="border rounded-lg p-2 flex-grow"
              value={nuevoHobby}
              onChange={(e) => setNuevoHobby(e.target.value)}
              placeholder="Ej: Programación, Fotografía..."
            />
            <button
              onClick={agregarHobby}
              className="bg-pink-600 text-white px-3 py-2 rounded-lg"
            >
              + Agregar
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {hobbies.map((h) => (
              <span
                key={h}
                className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {h}
                <button onClick={() => eliminarHobby(h)} className="font-bold">
                  ×
                </button>
              </span>
            ))}
          </div>

          {/* Tema */}
          <h2 className="font-semibold text-lg mb-2">🎨 Tema Visual</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
            {temas.map((t) => (
              <div
                key={t.id}
                onClick={() => setTemaSeleccionado(t.id)}
                className={`h-16 rounded-xl cursor-pointer bg-gradient-to-r ${t.id} ${
                  temaSeleccionado === t.id ? "ring-4 ring-pink-500" : ""
                }`}
              ></div>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 border rounded-lg"
              onClick={() => navigate("/profile")}
            >
              Cancelar
            </button>
            <button
              onClick={guardarCambios}
              className="px-4 py-2 bg-pink-600 text-white rounded-lg"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
