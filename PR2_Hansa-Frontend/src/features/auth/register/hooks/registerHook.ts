import { useState } from 'react';
import { register } from '../../services/authService';

export const useAuthRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRegister = async (
    email: string,
    username: string,
    password: string,
    onSuccess: () => void
  ) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      await register(email, username, password);
      setSuccess("¡Usuario registrado con éxito!");
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al registrar.");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, handleRegister };
};