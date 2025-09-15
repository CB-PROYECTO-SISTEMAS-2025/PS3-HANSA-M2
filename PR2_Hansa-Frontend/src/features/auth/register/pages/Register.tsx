import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthRegister } from "../hooks/registerHook";
import AuthForm from "../../components/AuthForm";
import Notification from "../../components/Notification";
import AuthLayout from "../../components/AuthLayout";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error, success, handleRegister } = useAuthRegister();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // === US-03: helpers de fortaleza ===
  const hasLower = (s: string) => /[a-z]/.test(s);
  const hasUpper = (s: string) => /[A-Z]/.test(s);
  const hasDigit = (s: string) => /\d/.test(s);
  const hasSymbol = (s: string) => /[^\w\s]/.test(s);
  const hasLen = (s: string) => s.length >= 12;

  function strengthInfo(pwd: string) {
    const rules = [hasLen(pwd), hasUpper(pwd), hasLower(pwd), hasDigit(pwd), hasSymbol(pwd)];
    const score = rules.filter(Boolean).length; // 0..5
    const label =
      score <= 1 ? "Muy débil" :
      score === 2 ? "Débil" :
      score === 3 ? "Media" :
      score === 4 ? "Fuerte" :
      "Muy fuerte";
    const pct = (score / 5) * 100;
    const barColor =
      score <= 2 ? "bg-red-500" :
      score === 3 ? "bg-yellow-500" :
      "bg-green-600";
    return { rules, score, label, pct, barColor };
  }

  const isStrong = useMemo(
    () => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{12,}$/.test(formData.password),
    [formData.password]
  );
  const passwordsMatch = useMemo(
    () => formData.password === formData.confirmPassword,
    [formData.password, formData.confirmPassword]
  );

  const { rules, label, pct, barColor } = strengthInfo(formData.password);
  const [lenOK, upperOK, lowerOK, digitOK, symbolOK] = rules;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isStrong) {
      alert("Contraseña débil. Usa ≥12 caracteres, mayúscula, minúscula, número y símbolo.");
      return;
    }
    if (!passwordsMatch) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    handleRegister(formData.email, formData.username, formData.password, () =>
      setTimeout(() => navigate("/"), 2000)
    );
  };

  return (
    <AuthLayout>
      <Notification message={error || success || ""} type={error ? "error" : "success"} />   
      {/* Panel derecho */}
      <AuthForm
        title="Crear tu cuenta"
        subtitle="Crea una cuenta nueva"
        onSubmit={handleSubmit}
        loading={loading}
        buttonText="Crear Cuenta"
      >
        <div>
          <label htmlFor="email" className="sr-only">Email</label>
          <div className="relative">
            <FiMail className="absolute top-3 left-3 text-gray-400" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors`}
              placeholder="Correo electrónico"
            />
          </div>
        </div>

        <div>
          <label htmlFor="username" className="sr-only">Username</label>
          <div className="relative">
            <FiUser className="absolute top-3 left-3 text-gray-400" />
            <input
              id="username"
              name="username"
              type="username"
              required
              value={formData.username}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors`}
              placeholder="Nombre de usuario"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="sr-only">Contraseña</label>
          <div className="relative">
            <FiLock className="absolute top-3 left-3 text-gray-400" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              className={`block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors`}
              placeholder="Contraseña"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>

          {/* Medidor + checklist (solo si hay texto) */}
          {formData.password && (
            <div className="mt-2">
              <div className="h-2 w-full bg-gray-200 rounded">
                <div
                  className={`h-2 ${barColor} rounded transition-all`}
                  style={{ width: `${pct}%` }}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={pct}
                />
              </div>
              <div className="mt-1 text-xs text-gray-600">
                Fortaleza: <span className="font-medium">{label}</span>
              </div>

              <ul className="mt-2 text-xs space-y-1">
                <li className={`flex items-center gap-2 ${lenOK ? "text-green-600" : "text-red-600"}`}>
                  <span className="w-4 text-center">{lenOK ? "✓" : "✗"}</span>
                  Al menos 12 caracteres
                </li>
                <li className={`flex items-center gap-2 ${upperOK ? "text-green-600" : "text-red-600"}`}>
                  <span className="w-4 text-center">{upperOK ? "✓" : "✗"}</span>
                  Una mayúscula (A-Z)
                </li>
                <li className={`flex items-center gap-2 ${lowerOK ? "text-green-600" : "text-red-600"}`}>
                  <span className="w-4 text-center">{lowerOK ? "✓" : "✗"}</span>
                  Una minúscula (a-z)
                </li>
                <li className={`flex items-center gap-2 ${digitOK ? "text-green-600" : "text-red-600"}`}>
                  <span className="w-4 text-center">{digitOK ? "✓" : "✗"}</span>
                  Un número (0-9)
                </li>
                <li className={`flex items-center gap-2 ${symbolOK ? "text-green-600" : "text-red-600"}`}>
                  <span className="w-4 text-center">{symbolOK ? "✓" : "✗"}</span>
                  Un símbolo (!@#$%^&*)
                </li>
              </ul>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="sr-only">ConfirmarContraseña</label>
          <div className="relative">
            <FiLock className="absolute top-3 left-3 text-gray-400" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors`}
              placeholder="Confirmar contraseña"
            />
          </div>

          {formData.confirmPassword && !passwordsMatch && (
            <div className="mt-2 text-xs text-red-600">
              Las contraseñas no coinciden.
            </div>
          )}
        </div>
      </AuthForm>

      <div className="relative mt-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-gray-50 text-gray-500">O</span>
        </div>
      </div>
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/" className="text-[var(--color-primary)] hover:underline">
            Inicie sesión
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;
