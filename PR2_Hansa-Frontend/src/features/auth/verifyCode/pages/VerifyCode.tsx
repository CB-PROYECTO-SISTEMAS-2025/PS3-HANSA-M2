import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyCode } from "../../services/authService"; 

import CodeInput from "../components/CodeInput"; 
import ErrorMessage from "../components/ErrorMessage"; 
import VerificationForm from "../components/VerificationForm"; 
import AuthLayout from "../../components/AuthLayout";

const VerifyCode: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState<string[]>(Array(6).fill("")); // Estado para el código
  const [loading, setLoading] = useState(false); // Estado para el botón de carga
  const [error, setError] = useState<string | null>(null); // Estado para los errores
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fullCode = code.join(""); // Combina los dígitos del código
    const username = localStorage.getItem("username"); // Obtiene el username del localStorage

    if (!username) {
      setError("Usuario no identificado.");
      return;
    }

    try {
      setLoading(true);
      const { token, user } = await verifyCode(username, fullCode); // Llama al servicio de verificación

      // Guarda el token y el usuario en el localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Actualiza el contexto global con el usuario
      

      // Navega a la página principal
      navigate("/file-repository");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Error al verificar el código.");
      } else {
        setError("Error al verificar el código.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Panel Derecho */}
      <div className="bg-gray-50 p-5 sm:p-10 flex flex-col justify-center relative mb-20">
        <div>
          <button
            onClick={() => navigate("/")}
            className="absolute top-0 left-0 rounded-full border border-gray-600 hover:bg-gray-200 transition p-2 w-10 h-10 flex items-center justify-center"
            aria-label="Volver"
          >
            <svg
              className="w-5 h-5 text-gray-800"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
        <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2 mt-12 md:mt-0">Verificación en dos pasos</h2>
          <p className="text-sm text-gray-600 mb-6">
            Te hemos enviado un código a tu correo electrónico registrado.
          </p>

          {/* Mensaje de error */}
          <ErrorMessage message={error} />

          {/* Formulario de verificación */}
          <VerificationForm loading={loading} onSubmit={handleSubmit}>
            <CodeInput code={code} setCode={setCode} />
          </VerificationForm>
        </div>     
      </div>
    </AuthLayout>


        

  );
};

export default VerifyCode;