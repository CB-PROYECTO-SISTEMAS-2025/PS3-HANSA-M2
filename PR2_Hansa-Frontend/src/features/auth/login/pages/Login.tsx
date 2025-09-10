import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div>
            <label htmlFor="username" className="sr-only">
              Nombre de usuario
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                id="username"
                name="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                placeholder="Ingrese su nombre de usuario"
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
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors`}
                    placeholder="Ingrese su contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
              </div>
            <div className="flex">
              <Link to="#" className="text-sm text-[var(--color-primary)] hover:underline ml-auto">
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