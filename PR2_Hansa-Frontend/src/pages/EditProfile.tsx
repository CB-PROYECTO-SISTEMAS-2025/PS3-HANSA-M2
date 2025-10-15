import { FiX, FiSave } from "react-icons/fi";
import { useState } from "react";
import api from "../utils/api";

interface EditarPerfilModalProps {
    onClose: () => void;
    onSave: (data: {
        nombre: string;
        apellido: string;
        estado: string;
        profesion: string;
        institucion: string;
        ciudad: string;
        contacto: string;
        hobbies: string[];
        profileImage: string;
    }) => void;
    initialData: {
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
}

const EditarPerfilModal: React.FC<EditarPerfilModalProps> = ({
    onClose,
    onSave,
    initialData,
}) => {
    const [nombre, setNombre] = useState(initialData.nombre || "");
    const [apellido, setApellido] = useState(initialData.apellido || "");
    const [estado, setEstado] = useState(initialData.estado || "");
    const [profesion, setProfesion] = useState(initialData.profesion || "");
    const [institucion, setInstitucion] = useState(initialData.institucion || "");
    const [ciudad, setCiudad] = useState(initialData.ciudad || "");
    const [contacto, setContacto] = useState(initialData.contacto || "");
    const [profileImage, setProfileImage] = useState(initialData.profileImage || "");
    const [hobbies, setHobbies] = useState<string[]>(initialData.hobbies || []);

    const availableHobbies = ["Lectura", "Música", "Programación", "Competencias"];

    const handleSubmit = async () => {
        const data = {
            nombre,
            apellido,
            ciudad,
            profesion,
            estado,
            institucion,
            contacto,
            hobbies,
            profileImage,
        };

        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const userId = user.id; // o usa contexto o props
            const response = await api.put(`api/users/${userId}`, data);
            onSave(response.data); // actualiza el estado del perfil
            onClose();
        } catch (err) {
            console.error(err);
            alert("No se pudo guardar el perfil.");
        }
    };
    const handleImageUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await api.post('api/upload/profile-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.url) {
                setProfileImage(response.data.url); // Guardas la URL pública
            }
        } catch (err) {
            console.error('Error al subir imagen:', err);
        }
    };


    const toggleHobby = (hobby: string) => {
        if (hobbies.includes(hobby)) {
            setHobbies(hobbies.filter((h) => h !== hobby));
        } else {
            setHobbies([...hobbies, hobby]);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.3)] backdrop-blur-sm">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-xl relative max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                >
                    <FiX className="text-2xl" />
                </button>
                <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">
                    Editar Perfil
                </h2>

                <div className="space-y-4">
                    {/* Nombre */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Nombre</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md mt-1"
                        />
                    </div>

                    {/* Apellido */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Apellido</label>
                        <input
                            type="text"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md mt-1"
                        />
                    </div>

                    {/* Estado */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Estado</label>
                        <input
                            type="text"
                            value={estado}
                            onChange={(e) => setEstado(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md mt-1"
                        />
                    </div>

                    {/* Profesión */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Profesión</label>
                        <input
                            type="text"
                            value={profesion}
                            onChange={(e) => setProfesion(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md mt-1"
                        />
                    </div>

                    {/* Institución */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Institución</label>
                        <input
                            type="text"
                            value={institucion}
                            onChange={(e) => setInstitucion(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md mt-1"
                        />
                    </div>

                    {/* Ciudad */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Ciudad</label>
                        <input
                            type="text"
                            value={ciudad}
                            onChange={(e) => setCiudad(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md mt-1"
                        />
                    </div>

                    {/* Contacto */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Contacto</label>
                        <input
                            type="text"
                            value={contacto}
                            onChange={(e) => setContacto(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md mt-1"
                        />
                    </div>

                    {/* Foto de perfil */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Foto de perfil</label>

                        {/* Subida desde dispositivo */}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(file);
                            }}
                            className="block mt-1 mb-2"
                        />
                        {/* Vista previa */}
                        {profileImage && (
                            <img
                                src={profileImage}
                                alt="Vista previa"
                                className="w-24 h-24 mt-2 rounded-full border-2 border-gray-300 object-cover"
                            />
                        )}
                    </div>


                    {/* Hobbies */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Hobbies</label>
                        <div className="flex flex-wrap gap-3 mt-2">
                            {availableHobbies.map((hobby) => (
                                <label key={hobby} className="flex items-center space-x-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={hobbies.includes(hobby)}
                                        onChange={() => toggleHobby(hobby)}
                                    />
                                    <span>{hobby}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Botón Guardar */}
                <div className="text-right mt-6">
                    <button
                        onClick={handleSubmit}
                        className="bg-[var(--color-primary)] text-white px-6 py-2 rounded-lg hover:bg-[var(--color-primary-hover)] transition"
                    >
                        <FiSave className="inline mr-2" />
                        Guardar cambios
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditarPerfilModal;
