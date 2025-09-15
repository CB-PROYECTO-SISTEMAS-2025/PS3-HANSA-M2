import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";
import AuthForm from "../../components/AuthForm";
import { forgotPassword } from "../../services/authService";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true); // siempre OK para no filtrar si el correo existe
    } catch (e: any) {
      setErr(e?.response?.data?.msg || "No se pudo enviar el correo. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthForm
        title="Recuperar contraseña"
        subtitle="Te enviaremos un enlace para restablecerla"
        onSubmit={onSubmit}
        loading={loading}
        buttonText={sent ? "Reenviar instrucciones" : "Enviar instrucciones"}
      >
        {sent ? (
          <p className="text-sm text-gray-600">
            Si el correo está registrado, ya enviamos las instrucciones a tu bandeja.
            Revisa también tu carpeta de spam.
          </p>
        ) : (
          <>
            {err && <p className="text-red-500 text-sm mb-4">{err}</p>}
            <label className="block">
              <span className="sr-only">Correo</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="tu@correo.com"
                autoComplete="email"
              />
            </label>
          </>
        )}

        {/* Volver al login */}
        <div className="mt-4 text-center">
          <Link to="/" className="text-sm text-[var(--color-primary)] hover:underline">
            ← Volver al inicio de sesión
          </Link>
        </div>
      </AuthForm>
    </AuthLayout>
  );
};

export default ForgotPassword;
