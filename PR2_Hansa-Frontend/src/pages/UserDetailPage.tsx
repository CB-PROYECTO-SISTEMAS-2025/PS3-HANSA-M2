import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserProfile } from "../services/userService";

const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await getUserProfile(id!);
        setUser(data);
      } catch (err) {
        console.error("❌ Error al obtener usuario:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Cargando perfil...</p>;
  if (!user) return <p className="text-center mt-10">Usuario no encontrado</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-white p-6 rounded-lg shadow">
        <img
          src={
            user.profileImage ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt={user.username}
          className="w-32 h-32 rounded-full object-cover border"
        />
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-primary)]">
            {user.username}
          </h1>
          <p className="text-gray-600">{user.bio || "Sin biografía"}</p>
          <p className="text-sm text-gray-500 mt-2">
            Tipo de usuario: {user.userType || "General"}
          </p>
          <p className="text-sm text-gray-500">
            Repositorios: {user.repoCount ?? 0}
          </p>

          {user.hobbies?.length > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              <strong>Hobbies:</strong> {user.hobbies.join(", ")}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Detalles</h2>
        {user.userType === "Estudiante" && user.student && (
          <p className="text-sm text-gray-700">
            {user.student.carrera} - {user.student.institucion}
          </p>
        )}
        {user.userType === "Investigador" && user.researcher && (
          <p className="text-sm text-gray-700">
            {user.researcher.enfoque} ({user.researcher.institucion})
          </p>
        )}
        {user.userType === "Académico" && user.academic && (
          <p className="text-sm text-gray-700">
            {user.academic.departamento} - {user.academic.grado}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserDetailPage;
