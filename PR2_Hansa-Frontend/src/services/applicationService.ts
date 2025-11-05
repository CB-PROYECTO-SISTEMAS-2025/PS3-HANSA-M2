import api from "../utils/api";

// Aplicar como Creador
export const applyAsCreator = async (repoId: string, data: any, token: string) => {
  const res = await api.post(`/api/applications/creator/${repoId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Aplicar como Miembro
export const applyAsMember = async (repoId: string, data: any, token: string) => {
  const res = await api.post(`/api/applications/member/${repoId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
