import api from '../utils/api';

export interface Folder {
  _id: string;
  name: string;
  repository: string;
  parentFolder: string | null;
  path: string;
  level: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface File {
  _id: string;
  filename: string;
  originalname: string;
  contentType: string;
  size: number;
  title: string;
  description?: string;
  tags: string[];
  importance: 0 | 1 | 2 | 3;
  sensitive: boolean;
  repository: string;
  folder: string | null;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface FolderContents {
  currentFolder: Folder | null;
  subfolders: Folder[];
  files: File[];
}

/**
 * Create a new folder
 */
export const createFolder = async (
  repositoryId: string,
  name: string,
  parentFolderId?: string
): Promise<Folder> => {
  const response = await api.post(`/api/repositories/${repositoryId}/folders`, {
    name,
    parentFolderId,
  });
  return response.data;
};

/**
 * Get folder contents (subfolders and files)
 */
export const getFolderContents = async (
  folderId?: string,
  repositoryId?: string
): Promise<FolderContents> => {
  const params: any = {};
  if (folderId) params.folderId = folderId;
  if (repositoryId) params.repositoryId = repositoryId;

  const response = await api.get('/api/folders/contents', { params });
  return response.data;
};

/**
 * Rename a folder
 */
export const renameFolder = async (
  folderId: string,
  newName: string
): Promise<Folder> => {
  const response = await api.put(`/api/folders/${folderId}`, { name: newName });
  return response.data;
};

/**
 * Delete a folder (and all its contents recursively)
 */
export const deleteFolder = async (folderId: string): Promise<void> => {
  await api.delete(`/api/folders/${folderId}`);
};

/**
 * Move a folder to a different parent
 */
export const moveFolder = async (
  folderId: string,
  newParentFolderId: string | null
): Promise<Folder> => {
  const response = await api.patch(`/api/folders/${folderId}/move`, {
    newParentFolderId,
  });
  return response.data;
};

/**
 * Get folder path (breadcrumb navigation)
 */
export const getFolderPath = async (folderId: string): Promise<Folder[]> => {
  const response = await api.get(`/api/folders/${folderId}/path`);
  return response.data;
};
