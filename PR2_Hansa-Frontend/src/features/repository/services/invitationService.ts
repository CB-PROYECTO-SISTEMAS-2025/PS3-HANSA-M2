import api from "../../../utils/api";

// Invitar a un usuario a un repo simple
export const inviteToRepo = async (repoId: string, email: string, role: string, token: string) => {
  try {
    const res = await api.post(
      `/api/invitaciones/${repoId}/invite`,
      { email, role },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Error al invitar al usuario." };
  }
};

// Aceptar invitación con token
export const acceptInvitation = async (token: string, authToken: string) => {
  try {
    const res = await api.post(
      "/api/invitaciones/accept",
      { token },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Error al aceptar invitación." };
  }
};
