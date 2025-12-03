import api from "../utils/api";

// 🔹 Listar usuarios públicos con filtros (search, sortBy, type)
export const getPublicUsers = async (params: {
  search?: string;
  sortBy?: "repos" | "antiguedad" | "reciente";
  type?: string;
}) => {
  const res = await api.get("/api/users", { params });
  return res.data;
};

// 🔹 Obtener perfil individual
export const getUserProfile = async (id: string) => {
  const res = await api.get(`/api/users/${id}`);
  return res.data;
};
