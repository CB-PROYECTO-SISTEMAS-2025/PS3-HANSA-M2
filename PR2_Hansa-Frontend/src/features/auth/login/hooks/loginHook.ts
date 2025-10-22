import { useState } from 'react';
import { login } from '../../services/authService';

export const useAuthLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (username: string, password: string, onSuccess: () => void) => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔐 Iniciando login...', { username });
      const data = await login(username, password);
      console.log('✅ Respuesta del login:', data);
      console.log('🔑 Token recibido:', data.token);
      console.log('👤 Usuario recibido:', data.user);
      
      if (!data.token) {
        throw new Error('No se recibió token del servidor');
      }
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user.username);
      console.log('💾 Datos guardados en localStorage');
      console.log('🚀 Login exitoso, redirigiendo...');
      onSuccess();
    } catch (err: unknown) {
      console.error('Error en login:', err);
      if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
        setError((err as { response: { data: { message: string } } }).response.data.message);
      } else {
        setError("Error al iniciar sesión.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, handleLogin};
};