import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyCode, resendVerifyCode } from "../../services/authService";

import CodeInput from "../components/CodeInput";
import ErrorMessage from "../components/ErrorMessage";
import VerificationForm from "../components/VerificationForm";
import AuthLayout from "../../components/AuthLayout";

const RESEND_SECONDS = 60; // puedes subir a 90/120 si prefieres

const VerifyCode: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 1) username desde state o localStorage (compat: 'pending_username' o 'username')
  const stateUsername = (location.state as any)?.username;
  const username: string =
    stateUsername ||
    localStorage.getItem("pending_username") ||
    localStorage.getItem("username") ||
    "";

  // Si viene en state, persiste para soportar refresh
  useEffect(() => {
    if (stateUsername) {
      localStorage.setItem("pending_username", stateUsername);
    }
  }, [stateUsername]);

  // 2) estados de código/UX
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 3) contador y reenvío
  const [seconds, setSeconds] = useState<number>(RESEND_SECONDS);
  const canResend = useMemo(() => seconds <= 0, [seconds]);
  const [resentMsg, setResentMsg] = useState<string | null>(null);

  // tick del contador
  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  // 4) enviar código para verificación
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setResentMsg(null);

    if (!username) {
      setError("Usuario no identificado.");
      return;
    }

    try {
      setLoading(true);
      const fullCode = code.join("");
      const { token, user } = await verifyCode(username, fullCode);

      // Guarda sesión (igual que tu versión original)
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Navega a tu página post-login original
      navigate("/file-repository", { replace: true });
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.msg ||
          err?.message ||
          "Error al verificar el código."
      );
    } finally {
      setLoading(false);
    }
  };

  // 5) reenviar código (respeta cooldown front y server)
  const handleResend = async () => {
    if (!canResend) return;
    setError(null);
    setResentMsg(null);

    if (!username) {
      setError("Usuario no identificado.");
      return;
    }

    try {
      await resendVerifyCode(username);
      // reinicia cooldown local y limpia inputs
      setSeconds(RESEND_SECONDS);
      setCode(Array(6).fill(""));
      setResentMsg("Te enviamos un nuevo código. Revisa tu correo (y spam).");
    } catch (err: any) {
      // si el backend aplica rate-limit, puede devolver 429 con retryAfter
      const retry = Number(err?.response?.data?.retryAfter);
      if (!Number.isNaN(retry) && retry > 0) {
        setSeconds(retry); // sincroniza el contador con el valor del servidor
      }
      setError(
        err?.response?.data?.msg ||
          "No pudimos reenviar el código. Intenta más tarde."
      );
    }
  };

  return (
    <AuthLayout>
      {/* Panel Derecho (UI original) */}
      <div className="bg-gray-50 p-5 sm:p-10 flex flex-col justify-center relative mb-20">
        {/* Botón volver (tu SVG original) */}
        <div>
          <button
            onClick={() => navigate("/")}
            className="absolute top-0 left-0 rounded-full border border-gray-600 hover:bg-gray-200 transition p-2 w-10 h-10 flex items-center justify-center"
            aria-label="Volver"
            type="button"
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2 mt-12 md:mt-0">
            Verificación en dos pasos
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Te hemos enviado un código a tu correo electrónico registrado.
          </p>

          {/* Mensaje de error */}
          <ErrorMessage message={error} />

          {/* Mensaje de reenvío OK */}
          {resentMsg && (
            <div className="mb-3 text-sm text-green-600 bg-green-50 rounded px-3 py-2">
              {resentMsg}
            </div>
          )}

          {/* Formulario de verificación (tu componente) */}
          <VerificationForm loading={loading} onSubmit={handleSubmit}>
            <CodeInput code={code} setCode={setCode} />
          </VerificationForm>

          {/* Bloque reenvío / contador */}
          <div className="mt-4 text-center text-sm">
            {canResend ? (
              <button
                onClick={handleResend}
                className="text-[var(--color-primary)] hover:underline font-medium"
                type="button"
              >
                Reenviar código
              </button>
            ) : (
              <span className="text-gray-500">
                Puedes reenviar en {seconds}s…
              </span>
            )}
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default VerifyCode;
