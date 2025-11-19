import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthLogin } from "../hooks/loginHook";
import AuthForm from "../../components/AuthForm";
import AuthLayout from "../../components/AuthLayout";
import { Link } from "react-router-dom";
import { FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error, handleLogin } = useAuthLogin();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleLogin(username, password, () => navigate("/account/verify-code"));
  };

  return (
    <AuthLayout>
      {/* Panel derecho */}
      <AuthForm title="Inicio de Sesión" subtitle="Accede a tu cuenta" onSubmit={handleSubmit} loading={loading} buttonText="Iniciar sesión">
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg border border-red-200"
          >
            {error}
          </motion.p>
        )}
        <div>
          <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
            Nombre de usuario
          </label>
          <div className="relative group">
            <FiUser className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[var(--color-primary)] transition-colors" />
            <input
              type="text"
              id="username"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all outline-none"
              placeholder="Ingrese su nombre de usuario"
            />
          </div>
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
            Contraseña
          </label>
          <div className="relative group">
            <FiLock className="absolute top-3.5 left-4 text-gray-400 group-focus-within:text-[var(--color-primary)] transition-colors" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all outline-none"
              placeholder="Ingrese su contraseña"
            />
            <motion.button
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-3 right-3 text-gray-400 hover:text-[var(--color-primary)] transition-colors"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </motion.button>
          </div>
        </div>
        <div className="flex">
          <Link to="/account/reset" className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] hover:underline ml-auto transition-colors">
            ¿Olvidaste tu contraseña?
          </Link>

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
          ¿No tienes una cuenta?{" "}
          <Link to="/account/register" className="text-[var(--color-primary)] hover:underline">
            Cree una cuenta
          </Link>
        </p>
      </div>

    </AuthLayout>
  );
};

export default Login;