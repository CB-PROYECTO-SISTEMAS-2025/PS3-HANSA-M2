import React, { useState } from "react";
import { requestPasswordReset } from "../../services/authService";
import AuthForm from "../../components/AuthForm";
import AuthLayout from "../../components/AuthLayout";
import Notification from "../../components/Notification";
import { FiMail } from "react-icons/fi";

const RequestReset = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage(null);
      const res = await requestPasswordReset(email);
      setMessage({ text: res.message || "Correo enviado con instrucciones.", type: "success" });
    } catch (err: any) {
      setMessage({ text: err.response?.data?.message || "Error al enviar el correo.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Notification message={message?.text || ""} type={message?.type || "success"} />
      <AuthForm
        title="Recuperar contraseña"
        subtitle="Te enviaremos un correo para restablecer tu contraseña"
        onSubmit={handleSubmit}
        loading={loading}
        buttonText="Enviar enlace"
      >
        <div className="relative">
          <FiMail className="absolute left-3 top-3 text-gray-400" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </AuthForm>
    </AuthLayout>
  );
};

export default RequestReset;
