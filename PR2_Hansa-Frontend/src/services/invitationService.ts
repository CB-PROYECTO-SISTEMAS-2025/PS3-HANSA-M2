import api from "../utils/api";

export const sendInvitation = async (repoId: string, email: string, role: string, token: string) => {
  const res = await api.post(
    `/api/invitaciones/${repoId}/invite`,
    { email, role },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const acceptInvitation = async (token: string, authToken: string) => {
  return api.post(
    "/api/invitaciones/accept",
    { token },
    {
      headers: { Authorization: `Bearer ${authToken}` }
    }
  );
};


export const rejectInvitation = async (invitationId: string, token: string) => {
  const res = await api.post(
    `/api/invitaciones/reject`,
    { invitationId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};
