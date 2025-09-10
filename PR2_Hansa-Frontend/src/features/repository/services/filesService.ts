import api from '../../../utils/api';
import { File } from '../types/file';

export const fetchPersonalRepositoryId = async (): Promise<string> => {
  const response = await api.get("api/repositorios/personal");
  return response.data.personalRepoId;
};

export const fetchPersonalFiles = async (): Promise<File[]> => {
  const response = await api.get("api/files/personal");
  return response.data;
};

export const uploadFile = async (formData: FormData): Promise<void> => {
  await api.post("api/files/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const fetchFilesByRepositoryId = async (repositoryId: string): Promise<File[]> => {
  const response = await api.get(`api/files/myfiles/${repositoryId}`);
  return response.data;
};