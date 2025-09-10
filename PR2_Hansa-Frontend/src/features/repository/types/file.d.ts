export interface File {
  _id: number;
  filename: string;
  uploadDate: string;
  metadata: {
    title: string;
    author: string;
    description: string;
    tags: string[];
    importance: string;
    privacy: string;
  };
}