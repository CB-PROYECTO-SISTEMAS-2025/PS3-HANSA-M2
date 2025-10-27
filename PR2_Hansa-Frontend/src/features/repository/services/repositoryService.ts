import api from "../../../utils/api";

export const createRepository = async (data: any, token: string) => {
  const res = await api.post("/api/repositorios", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getRepositoryById = async (id: string, token: string) => {
  const res = await api.get(`/api/repositorios/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateRepository = async (id: string, data: any, token: string) => {
  const res = await api.put(`/api/repositorios/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
