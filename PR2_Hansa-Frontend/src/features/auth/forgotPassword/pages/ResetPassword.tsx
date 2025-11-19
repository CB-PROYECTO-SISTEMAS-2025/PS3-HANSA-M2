import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";
import AuthForm from "../../components/AuthForm";
import { resetPassword } from "../../services/authService";
import { Eye, EyeOff } from "lucide-react"; // 👁️ iconos livianos

const strong = (s: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{12,}$/.test(s);

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
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

    if (!token) return setErr("Token inválido. Abre el enlace desde tu correo.");
    if (pwd !== pwd2) return setErr("Las contraseñas no coinciden.");
    if (!strong(pwd))
      return setErr(
        "Contraseña débil. Usa ≥12 caracteres, mayúscula, minúscula, número y símbolo."
      );

    setLoading(true);
    try {
      const r = await resetPassword(token, pwd);
      setMsg(r?.msg || "¡Listo! Tu contraseña fue actualizada.");
      setPwd("");
      setPwd2("");
      setCountdown(3); // redirige luego de 3s
    } catch (e: any) {
      setErr(
        e?.response?.data?.msg || "No se pudo actualizar. Intenta nuevamente."
      );
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

        {/* Campo de nueva contraseña */}
        <div className="relative mb-3">
          <input
            type={showPwd ? "text" : "password"}
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10"
            placeholder="Nueva contraseña"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPwd(!showPwd)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            tabIndex={-1}
          >
            {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Campo repetir contraseña */}
        <div className="relative">
          <input
            type={showPwd2 ? "text" : "password"}
            value={pwd2}
            onChange={(e) => setPwd2(e.target.value)}
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10"
            placeholder="Repite la contraseña"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPwd2(!showPwd2)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            tabIndex={-1}
          >
            {showPwd2 ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <ul className="text-xs text-gray-500 mt-3 list-disc pl-5">
          <li>Al menos 12 caracteres.</li>
          <li>Incluye mayúscula, minúscula, número y símbolo.</li>
        </ul>

        <div className="mt-4 text-center">
          <Link
            to="/"
            className="text-sm text-[var(--color-primary)] hover:underline"
          >
            ← Volver al inicio de sesión
          </Link>
        </div>
      </AuthForm>
    </AuthLayout>
  );
};

export default ResetPassword;
