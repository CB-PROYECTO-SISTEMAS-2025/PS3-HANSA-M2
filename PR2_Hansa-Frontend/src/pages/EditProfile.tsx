// src/pages/EditarPerfilPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Listas iniciales
const universidades = [
  "UMMS (Universidad Mayor de San Simón)",
  "Univalle",
  "Universidad Católica",
  "EMI (Escuela Militar de Ingeniería)",
];

/*
const hobbiesDisponibles = [
  "Lectura",
  "Música",
  "Programación",
  "Deportes",
  "Videojuegos",
  "Fotografía",
  "Pintura/Dibujo",
  "Escritura creativa",
  "Viajar",
  "Ciencia/Tecnología",
];
*/

const temas = [
  { id: "azul-morado", label: "Azul-Morado", color: "bg-gradient-to-r from-indigo-500 to-purple-500" },
  { id: "rosa-naranja", label: "Rosa-Naranja", color: "bg-gradient-to-r from-pink-500 to-orange-400" },
  { id: "azul-celeste", label: "Azul-Celeste", color: "bg-gradient-to-r from-blue-500 to-cyan-400" },
  { id: "verde-agua", label: "Verde-Agua", color: "bg-gradient-to-r from-emerald-400 to-teal-500" },
  { id: "gris-oscuro", label: "Gris-Oscuro", color: "bg-gradient-to-r from-gray-800 to-gray-600" },
  { id: "rosa-rojo", label: "Rosa-Rojo", color: "bg-gradient-to-r from-rose-500 to-red-500" },
];

export default function EditarPerfilPage() {
  const navigate = useNavigate();

  // Estados
  const [nombre, setNombre] = useState("Pablo");
  const [apellidos, setApellidos] = useState("Gutierrez");
  const [username] = useState("Pablito");
  const [bio, setBio] = useState("Estudiante de Ingeniería de Sistemas apasionado por la tecnología y el desarrollo de software. Siempre aprendiendo algo nuevo.");
  const [universidad, setUniversidad] = useState(universidades[1]); // Univalle por defecto
  const [programa, setPrograma] = useState("Ingeniería de Sistemas");
  const [semestre, setSemestre] = useState("6to Semestre");
  const [nuevoHobby, setNuevoHobby] = useState("");
  const [hobbies, setHobbies] = useState(["Programación", "Lectura", "Música", "Deportes"]);
  const [temaSeleccionado, setTemaSeleccionado] = useState("azul-morado");
  const [perfilPublico, setPerfilPublico] = useState(true);
  const [mostrarEmail, setMostrarEmail] = useState(false);
  const [notifRepos, setNotifRepos] = useState(true);
  const [notifInvitaciones, setNotifInvitaciones] = useState(false);

  // Funciones
  const agregarHobby = () => {
    if (nuevoHobby.trim() && !hobbies.includes(nuevoHobby)) {
      setHobbies([...hobbies, nuevoHobby]);
      setNuevoHobby("");
    }
  };

  const eliminarHobby = (hobby: string) => {
    setHobbies(hobbies.filter((h) => h !== hobby));
  };

  const guardarCambios = () => {
    // Aquí harías el fetch/PUT a tu backend
    console.log("Guardado:", {
      nombre,
      apellidos,
      username,
      bio,
      universidad,
      programa,
      semestre,
      hobbies,
      temaSeleccionado,
      perfilPublico,
      mostrarEmail,
      notifRepos,
      notifInvitaciones,
    });
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Columna Izquierda - Tarjeta Perfil */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-pink-600 text-white flex items-center justify-center text-3xl font-bold">
            {nombre.charAt(0)}
          </div>
          <h2 className="mt-4 text-lg font-semibold">{nombre} {apellidos}</h2>
          <p className="text-sm text-gray-500">{programa}</p>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-2 gap-4 text-center w-full">
            <div>
              <p className="text-xl font-bold text-pink-600">6</p>
              <p className="text-xs text-gray-500">Repositorios</p>
            </div>
            <div>
              <p className="text-xl font-bold text-pink-600">24</p>
              <p className="text-xs text-gray-500">Archivos</p>
            </div>
            <div>
              <p className="text-xl font-bold text-pink-600">12</p>
              <p className="text-xs text-gray-500">Colaboraciones</p>
            </div>
            <div>
              <p className="text-xl font-bold text-pink-600">80%</p>
              <p className="text-xs text-gray-500">Almacenamiento</p>
            </div>
          </div>

          {/* Switches */}
          <div className="mt-6 w-full">
            <label className="flex items-center justify-between text-sm mb-2">
              <span>Perfil público</span>
              <input type="checkbox" checked={perfilPublico} onChange={() => setPerfilPublico(!perfilPublico)} />
            </label>
            <label className="flex items-center justify-between text-sm">
              <span>Mostrar email</span>
              <input type="checkbox" checked={mostrarEmail} onChange={() => setMostrarEmail(!mostrarEmail)} />
            </label>
          </div>
        </div>

        {/* Columna Derecha - Formulario */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-1">✨ Personaliza tu Perfil</h1>
          <p className="text-sm text-gray-500 mb-6">Configura tu identidad digital y hazla única</p>

          {/* Información personal */}
          <h2 className="font-semibold text-lg mb-2">👤 Información Personal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input className="border rounded-lg p-2" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" />
            <input className="border rounded-lg p-2" value={apellidos} onChange={(e) => setApellidos(e.target.value)} placeholder="Apellidos" />
            <div className="relative group">
              <input 
                className="border-2 border-amber-300 bg-amber-50 rounded-lg p-2 w-full cursor-not-allowed text-gray-600" 
                value={username} 
                disabled
                placeholder="Nombre de usuario"
                title="No se puede cambiar el username porque se utiliza para login"
              />
              <div className="absolute left-0 -top-14 bg-gray-800 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg z-10">
                ⚠️ No se puede cambiar el username porque se utiliza para login
              </div>
            </div>
            <textarea className="border rounded-lg p-2 md:col-span-2" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Biografía" />
          </div>

          {/* Información académica */}
          <h2 className="font-semibold text-lg mb-2">🎓 Información Académica</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <select className="border rounded-lg p-2" value={universidad} onChange={(e) => setUniversidad(e.target.value)}>
              {universidades.map((u) => <option key={u}>{u}</option>)}
            </select>
            <input className="border rounded-lg p-2" value={programa} onChange={(e) => setPrograma(e.target.value)} placeholder="Programa/Carrera" />
            <input className="border rounded-lg p-2 md:col-span-2" value={semestre} onChange={(e) => setSemestre(e.target.value)} placeholder="Semestre/Nivel" />
          </div>

          {/* Hobbies */}
          <h2 className="font-semibold text-lg mb-2">🎯 Intereses y Hobbies</h2>
          <div className="flex mb-3 gap-2">
            <input className="border rounded-lg p-2 flex-grow" value={nuevoHobby} onChange={(e) => setNuevoHobby(e.target.value)} placeholder="Ej: Programación, Fotografía..." />
            <button onClick={agregarHobby} className="bg-pink-600 text-white px-3 py-2 rounded-lg">+ Agregar</button>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {hobbies.map((h) => (
              <span key={h} className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {h}
                <button onClick={() => eliminarHobby(h)} className="text-pink-600 font-bold">×</button>
              </span>
            ))}
          </div>

          {/* Tema */}
          <h2 className="font-semibold text-lg mb-2">🎨 Tema de la Interfaz</h2>
          <p className="text-sm text-gray-500 mb-2">Elige el tema que más te guste para personalizar tu experiencia</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
            {temas.map((t) => (
              <div
                key={t.id}
                className={`h-16 rounded-xl cursor-pointer ${t.color} ${temaSeleccionado === t.id ? "ring-4 ring-pink-500" : ""}`}
                onClick={() => setTemaSeleccionado(t.id)}
              />
            ))}
          </div>

          {/* Notificaciones */}
          <h2 className="font-semibold text-lg mb-2">⚠️ Preferencias de Notificaciones</h2>
          <label className="flex items-center justify-between text-sm mb-2">
            <span>Invitaciones a repositorios</span>
            <input type="checkbox" checked={notifRepos} onChange={() => setNotifRepos(!notifRepos)} />
          </label>
          <label className="flex items-center justify-between text-sm mb-6">
            <span>Recordatorios de Invitaciones</span>
            <input type="checkbox" checked={notifInvitaciones} onChange={() => setNotifInvitaciones(!notifInvitaciones)} />
          </label>

          {/* Botones */}
          <div className="flex justify-end gap-3">
            <button className="px-4 py-2 border rounded-lg">Restablecer</button>
            <button onClick={guardarCambios} className="px-4 py-2 bg-pink-600 text-white rounded-lg">Guardar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  );
}
