/**
 * src/pages/account/VerifyCode.jsx
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const VALIDITY_DURATION_MS = 2 * 60 * 1000;

const VerifyCode = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState(Array(6).fill(""));
  const [validCode, setValidCode] = useState(generateCode());
  const [codeGeneratedAt, setCodeGeneratedAt] = useState(Date.now());
  const [errorMessage, setErrorMessage] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(30); // segundos
  const codeFilled = code.every((digit) => digit !== "");

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (!/^[0-9]?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setErrorMessage(null);

    if (value.length === 1 && index < 5) {
      setTimeout(() => {
      document.getElementById(`code-${index + 1}`)?.focus();
      }, 50);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullCode = code.join("");
    if (Date.now() - codeGeneratedAt > VALIDITY_DURATION_MS) {
      setErrorMessage("⚠️ El código ha expirado. Solicita uno nuevo.");
    } else if (fullCode !== validCode) {
      setErrorMessage("❌ El código ingresado es inválido.");
      //alert("Por favor, completa los 6 dígitos.");
    } else {
      alert("✅ Código verificado correctamente.");
      setErrorMessage(null);
    }
  };

  const handleResend = () => {
    if (resendCooldown === 0) {
      const newCode = generateCode();
      setValidCode(newGenerated);
      setCode(Array(6).fill(""));
      setErrorMessage(null);
      setCodeGeneratedAt(Date.now());
      setResendCooldown(30);
      alert(`📩 Se ha reenviado el código a tu correo: ${newGenerated}`);
      console.log("Nuevo código válido generado:", newGenerated);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-2 sm:px-4 py-6">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Panel Izquierdo */}
        <div className="hidden sm:hidden md:flex bg-gradient-to-br from-[#0056d6] to-[#007bff] text-white p-8 flex-col justify-center">
          <h1 className="text-4xl font-extrabold mb-6">UNIVALLE</h1>
          <p className="text-sm leading-relaxed whitespace-pre-line tracking-wide">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incid idunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </div>

        {/* Panel Derecho */}
        <div className="bg-[#eaf5ff] p-6 sm:p-8 flex flex-col justify-center">
          <button onClick={() => navigate(-1) || navigate('/login')} className="mb-6 self-start rounded-full border border-[#0c3c60] hover:bg-[#0c3c60]/10 transition p-2 w-10 h-10 flex items-center justify-center group" aria-label="Volver">
            <svg className="w-5 h-5 text-[#0c3c60] group-hover:text-[#0a2f4a] transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Verificación de código</h2>
          <p className="text-sm text-gray-600 mb-4">
            Te hemos enviado un código a tu correo electrónico registrado.
            Para completar el proceso por favor introduce el código de 6 dígitos.
          </p>

          {/* Mensaje de error */}
          {errorMessage && (
            <div className="text-red-600 font-semibold text-sm mb-4 text-center bg-red-100 border border-red-300 px-3 py-2 rounded">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md mx-auto">
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-4 sm:gap-x-4 sm:gap-y-6">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  autoComplete="one-time-code"
                  autoFocus={index === 0}
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace") {
                      if (!code[index] && index > 0) {
                        document.getElementById(`code-${index - 1}`)?.focus();
                      }
                    } else if (e.key === "ArrowRight" && index < 5) {
                      document.getElementById(`code-${index + 1}`)?.focus();
                    } else if (e.key === "ArrowLeft" && index > 0) {
                      document.getElementById(`code-${index - 1}`)?.focus();
                    }
                  }}
                  onPaste={(e) => {
                    const paste = e.clipboardData.getData("text").slice(0, 6).split("");
                    if (paste.length === 6 && paste.every((char) => /^[0-9]$/.test(char))) {
                      setCode(paste);
                      setTimeout(() => document.getElementById("code-5")?.focus(), 10);
                    }
                  }}
                  aria-label={`Dígito ${index + 1}`}
                  className="w-10 h-12 sm:w-12 sm:h-14 text-center border border-gray-300 rounded-md text-xl sm:text-2xl font-bold bg-white focus:outline-none focus:ring-2 focus:ring-[#0c3c60] transition-all duration-150 ease-in-out transform focus:scale-110 shadow-sm"
                />
              ))}
            </div>

            <button type="submit" disabled={!codeFilled} className={`w-full py-2 rounded transition text-white font-semibold ${codeFilled ? "bg-[#0c3c60] hover:bg-[#092d49]" : "bg-[#b0c4d6] cursor-not-allowed"}`}>
              Confirmar
            </button>
          </form>

          <div className="text-sm mt-6 text-center text-gray-600">
            ¿No recibiste el código?{" "}
            <button onClick={handleResend} disabled={resendCooldown > 0} className={`font-semibold ${resendCooldown > 0 ? "text-gray-400 cursor-not-allowed" : "text-[#0c3c60] hover:underline"}`}>
              {resendCooldown > 0 ? `Reenviar en ${resendCooldown}s` : "Volver a enviar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function generateCode() {
  return Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 10).toString()
  ).join("");
}

export default VerifyCode;
