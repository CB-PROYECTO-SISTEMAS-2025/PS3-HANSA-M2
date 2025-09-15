import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";
import AuthForm from "../../components/AuthForm";
import { resetPassword } from "../../services/authService";

const strong = (s: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{12,}$/.test(s);

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    setToken(q.get("token") || "");
  }, []);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      navigate("/", { replace: true });
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg(null);
    setErr(null);

    if (!token) { setErr("Token inválido. Abre el enlace desde tu correo."); return; }
    if (pwd !== pwd2) { setErr("Las contraseñas no coinciden."); return; }
    if (!strong(pwd)) { setErr("Contraseña débil. Usa ≥12 caracteres, mayúscula, minúscula, número y símbolo."); return; }

    setLoading(true);
    try {
      const r = await resetPassword(token, pwd);
      setMsg(r?.msg || "¡Listo! Tu contraseña fue actualizada.");
      setPwd(""); setPwd2("");
      setCountdown(3); // ⏳ inicia la cuenta regresiva
    } catch (e: any) {
      setErr(e?.response?.data?.msg || "No se pudo actualizar. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthForm
        title="Restablecer contraseña"
        subtitle="Define una nueva contraseña segura"
        onSubmit={onSubmit}
        loading={loading}
        buttonText="Actualizar contraseña"
      >
        {msg && (
          <p className="text-green-600 text-sm mb-3">
            {msg}{" "}
            {countdown !== null && (
              <span className="block text-gray-500">
                Redirigiendo al inicio de sesión en {countdown}…
              </span>
            )}
          </p>
        )}
        {err && <p className="text-red-500 text-sm mb-3">{err}</p>}

        <label className="block mb-3">
          <span className="sr-only">Nueva contraseña</span>
          <input
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Nueva contraseña"
            autoComplete="new-password"
          />
        </label>

        <label className="block">
          <span className="sr-only">Repetir contraseña</span>
          <input
            type="password"
            value={pwd2}
            onChange={(e) => setPwd2(e.target.value)}
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Repite la contraseña"
            autoComplete="new-password"
          />
        </label>

        <ul className="text-xs text-gray-500 mt-3 list-disc pl-5">
          <li>Al menos 12 caracteres.</li>
          <li>Incluye mayúscula, minúscula, número y símbolo.</li>
        </ul>

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

export default ResetPassword;
