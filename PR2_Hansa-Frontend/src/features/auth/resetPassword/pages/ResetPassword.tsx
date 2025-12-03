import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../services/authService";
import AuthForm from "../../components/AuthForm";
import AuthLayout from "../../components/AuthLayout";
import Notification from "../../components/Notification";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";

const ResetPassword = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return setMessage({ text: "Token inválido o faltante.", type: "error" });

    try {
      setLoading(true);
      const res = await resetPassword(token, password);
      setMessage({ text: res.message || "Contraseña actualizada.", type: "success" });
      setTimeout(() => navigate("/"), 2000);
    } catch (err: any) {
      setMessage({ text: err.response?.data?.message || "Error al actualizar contraseña.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Notification message={message?.text || ""} type={message?.type || "success"} />
      <AuthForm
        title="Restablecer contraseña"
        subtitle="Introduce tu nueva contraseña"
        onSubmit={handleSubmit}
        loading={loading}
        buttonText="Actualizar"
      >
        <div className="relative">
          <FiLock className="absolute top-3 left-3 text-gray-400" />
          <input
            type={show ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nueva contraseña"
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            {show ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        </div>
      </AuthForm>
    </AuthLayout>
  );
};

export default ResetPassword;
