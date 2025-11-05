import api from "../../../utils/api";
import { File } from "../types/file";

export const fetchFilesByRepositoryId = async (repositoryId: string): Promise<File[]> => {
  const response = await api.get(`api/files/repo/${repositoryId}`);
  return response.data;
};

// 🔽 NUEVA FUNCIÓN: descarga un archivo
export const downloadFileById = async (fileId: string, filename?: string) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`http://localhost:5000/api/files/${fileId}/download`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Error al descargar archivo");

  // Convierte la respuesta a blob (binario)
  const blob = await response.blob();

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
