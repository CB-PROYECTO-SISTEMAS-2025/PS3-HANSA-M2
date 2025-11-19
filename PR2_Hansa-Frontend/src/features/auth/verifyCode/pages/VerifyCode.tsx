import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyCode, resendVerifyCode } from "../../services/authService";

import CodeInput from "../components/CodeInput";
import ErrorMessage from "../components/ErrorMessage";
import VerificationForm from "../components/VerificationForm";
import AuthLayout from "../../components/AuthLayout";

const RESEND_COOLDOWN = 60; // segundos entre reenvíos (de tu .env)
const RESEND_WINDOW = 600;  // 10 minutos (ventana máxima)
const RESEND_MAX = 3;       // cantidad máxima por ventana

const VerifyCode: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Reenvío control
  const [cooldown, setCooldown] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [windowTimer, setWindowTimer] = useState<number>(0);

  // ⏳ Temporizador del cooldown
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // ⏳ Temporizador de ventana de bloqueo
  useEffect(() => {
    if (windowTimer <= 0) return;
    const t = setTimeout(() => setWindowTimer((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [windowTimer]);

  // 🧠 Enviar código
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fullCode = code.join("");
    const username = localStorage.getItem("username");

    if (!username) {
      setError("Usuario no identificado.");
      return;
    }

    try {
      setLoading(true);
      const { token, user } = await verifyCode(username, fullCode);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/home");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Código incorrecto o expirado.");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Reenviar código
  const handleResend = async () => {
    const username = localStorage.getItem("username");
    if (!username) {
      setError("Usuario no identificado.");
      return;
    }

    if (attempts >= RESEND_MAX) {
      setError("Límite de reenvíos alcanzado. Espera para volver a intentar.");
      return;
    }

    setResending(true);
    setError(null);
    setSuccessMsg(null);

    try {
      await resendVerifyCode(username);
      setSuccessMsg("Código reenviado correctamente al correo.");
      setAttempts((a) => a + 1);
      setCooldown(RESEND_COOLDOWN);

      // si llegó al máximo, inicia el temporizador de ventana
      if (attempts + 1 >= RESEND_MAX) {
        setWindowTimer(RESEND_WINDOW);
      }
    } catch (err: any) {
      setError("No se pudo reenviar el código. Intenta más tarde.");
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout>
      <div className="bg-gray-50 p-5 sm:p-10 flex flex-col justify-center relative mb-20">
        {/* ← Volver */}
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

        <h2 className="text-2xl font-bold text-gray-800 mb-2 mt-12 md:mt-0">
          Verificación en dos pasos
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Te hemos enviado un código a tu correo electrónico registrado.
        </p>

        <ErrorMessage message={error} />

        <VerificationForm loading={loading} onSubmit={handleSubmit}>
          <CodeInput code={code} setCode={setCode} />
        </VerificationForm>

        {/* 🔁 Reenvío del código */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || cooldown > 0 || attempts >= RESEND_MAX}
            className={`px-4 py-2 rounded-md text-white font-medium transition ${
              resending || cooldown > 0 || attempts >= RESEND_MAX
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } flex items-center gap-2`}
          >
            {resending && (
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            )}
            {cooldown > 0
              ? `Reenviar en ${cooldown}s`
              : attempts >= RESEND_MAX
              ? "Límite alcanzado"
              : "Reenviar código"}
          </button>

          {/* Mensaje de éxito */}
          {successMsg && (
            <p className="text-green-600 text-sm mt-2">{successMsg}</p>
          )}

          {/* Info de intentos y bloqueo */}
          <p className="text-xs text-gray-600 mt-1">
            Intentos: {attempts}/{RESEND_MAX}
            {attempts >= RESEND_MAX && windowTimer > 0 && (
              <>
                {" "}
                — Espera {Math.floor(windowTimer / 60)}m{" "}
                {windowTimer % 60}s para volver a intentar
              </>
            )}
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default VerifyCode;
