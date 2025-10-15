import { JSX, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  FiArrowLeft,
  FiEdit,
  FiHardDrive,
  FiStar,
  FiBook,
  FiMusic,
  FiCode,
  FiAward,
} from "react-icons/fi";
import EditarPerfilModal from "./EditProfile";
import api from "../utils/api";

const VistaPerfil = () => {
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id; // o usa contexto o props

    if (userId) {
      api.get(`api/users/${userId}`)
        .then((response) => {
          const data = response.data;
          setPerfil({
            nombre: data.nombre || "",
            apellido: data.apellido || "",
            estado: data.estado || "",
            profesion: data.profesion || "",
            institucion: data.institucion || "",
            ciudad: data.ciudad || "",
            contacto: data.contacto || "",
            hobbies: data.hobbies || [],
            profileImage: data.profileImage || "",
          });
        })
        .catch((err) => {
          console.error("Error al cargar perfil:", err);
        });
    }
  }, []);

  type Perfil = {
    nombre: string;
    apellido: string;
    estado: string;
    profesion: string;
    institucion: string;
    ciudad: string;
    contacto: string;
    hobbies: string[];
    profileImage: string;
  };

  const [perfil, setPerfil] = useState<Perfil>({
    nombre: "",
    apellido: "",
    estado: "",
    profesion: "",
    institucion: "",
    ciudad: "",
    contacto: "",
    hobbies: [],
    profileImage: "",
  });

  return (
    <>
      <div className="max-w-6xl mx-auto rounded-md overflow-hidden shadow-xl border border-gray-200">
        {/* Header */}
        <div className="bg-[var(--color-primary)] text-white px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate("/file-repository")}
            className="flex items-center bg-[var(--color-primary)] bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-md transition"
          >
            <FiArrowLeft className="mr-2" />
            Volver al Inicio
          </button>
          <div className="text-right">
            <p className="text-sm opacity-80">Institución Académica</p>
            <p className="font-semibold">
              {perfil.institucion || "Actualiza tu perfil"}
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row bg-white">
          {/* Perfil */}
          <div className="md:w-1/3 p-6 border-r border-gray-200 flex flex-col items-center">
            <img
              src={perfil.profileImage || "https://via.placeholder.com/150?text=Sin+foto"}
              alt="Perfil"
              className="w-40 h-40 rounded-full object-cover border-4 border-[var(--color-primary)] shadow"
            />
            <h1 className="text-2xl font-bold mt-4 text-gray-800 text-center">
              {perfil.nombre || "Actualiza tu perfil"}
            </h1>
            <h2 className="text-lg text-gray-600 text-center">
              {perfil.apellido || "Actualiza tu perfil"}
            </h2>
            <p className="text-sm mt-2 text-gray-500">
              📍 {perfil.ciudad || "Actualiza tu perfil"}
            </p>
            <p className="text-sm text-gray-500">
              👨‍💻 {perfil.profesion || "Actualiza tu perfil"}
            </p>

            <button
              onClick={() => setShowEditModal(true)}
              className="mt-6 flex items-center bg-[var(--color-primary)] text-white px-5 py-2 rounded-full hover:bg-pink-700 transition"
            >
              <FiEdit className="mr-2" />
              Editar perfil
            </button>
          </div>

          {/* Contenido derecho */}
          <div className="md:w-2/3 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FiStar className="mr-2 text-yellow-500" />
              Gustos / Hobbies
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {(perfil.hobbies?.length ? perfil.hobbies : ["Actualiza tu perfil"]).map((label, i) => {
                const icons: { [key: string]: JSX.Element } = {
                  Lectura: <FiBook />,
                  Música: <FiMusic />,
                  Competencias: <FiAward />,
                  Programación: <FiCode />,
                  "Actualiza tu perfil": <FiStar />,
                };

                return (
                  <div
                    key={i}
                    className="bg-pink-100 hover:bg-pink-200 text-[var(--color-primary)] p-3 rounded-lg flex flex-col items-center shadow transition"
                  >
                    <div className="text-xl mb-1">{icons[label] || <FiStar />}</div>
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                );
              })}
            </div>

            {/* Almacenamiento */}
            <h4 className="text-md font-medium text-gray-700 mb-4 flex items-center">
              <FiHardDrive className="mr-2" />
              Almacenamiento (Plan Gratuito)
            </h4>

            <div className="flex items-center">
              <div className="relative w-24 h-24 mr-6">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#be185d"
                    strokeWidth="3"
                    strokeDasharray="80, 100"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-700">80%</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">80 GB de 100 GB usados</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-[var(--color-primary)] h-2 rounded-full"
                    style={{ width: "80%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showEditModal && (
        <EditarPerfilModal
          onClose={() => setShowEditModal(false)}
          onSave={(data) => setPerfil(data)}
          initialData={perfil}
        />
      )}
    </>
  );
};

export default VistaPerfil;
