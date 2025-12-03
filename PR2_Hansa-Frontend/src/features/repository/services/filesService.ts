import api from "../../../utils/api";
import { File } from "../types/file";

export const fetchFilesByRepositoryId = async (repositoryId: string): Promise<File[]> => {
  const response = await api.get(`api/files/repo/${repositoryId}`);
  return response.data;
};

// 🔽 NUEVA FUNCIÓN: descarga un archivo
export const downloadFileById = async (fileId: string, filename?: string) => {
  // Usar la instancia `api` para respetar la `baseURL` y los headers (token)
  const response = await api.get(`/api/files/${fileId}/download`, {
    responseType: "blob",
  });

  if (!response || response.status >= 400) throw new Error("Error al descargar archivo");

  // Convierte la respuesta a blob (binario)
  const blob = response.data;

  // Crea un enlace temporal para descargar
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "archivo";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

// Eliminar archivo
export const deleteFileById = async (fileId: string) => {
  const response = await api.delete(`/api/files/${fileId}`);
  return response.data;
};
