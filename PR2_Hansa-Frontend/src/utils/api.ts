import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

console.log('🚀 API_BASE_URL:', API_BASE_URL); // Debug log
console.log('🚀 Configuración de API cargada');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Aumentado a 30 segundos para Render
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
    (response) => {
      console.log('Respuesta de API:', response);
      return response;
    },
    (error) => {
      console.error('Error de API:', error);
      if (error.response?.status === 401) {
        console.error("No autorizado. Redirigiendo al login...");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
);

export default api;