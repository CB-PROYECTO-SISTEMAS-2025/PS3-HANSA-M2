import React, { useEffect, useState } from "react";
import { fetchFilesByRepositoryId, downloadFileById  } from "../services/filesService";
interface Props {
  repo: any;
  currentUserId: string;
  onAddFile: () => void;
  onAddUser: () => void;
  refresh: () => void;
}

const RepositoryDetailTabs: React.FC<Props> = ({
  repo,
  currentUserId,
  onAddFile,
  onAddUser,
}) => {

  const [active, setActive] = React.useState("files");
  const [files, setFiles] = useState<any[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const isOwner = repo.owner?._id === currentUserId;

  useEffect(() => {
    const loadFiles = async () => {
      if (active === "files" && repo?._id) {
        try {
          setLoadingFiles(true);
          const data = await fetchFilesByRepositoryId(repo._id);
          setFiles(data);
        } catch (err) {
          console.error("Error cargando archivos del repositorio:", err);
        } finally {
          setLoadingFiles(false);
        }
      }
    };
    loadFiles();
  }, [active, repo?._id]);

  return (
    <div>
      {/* Tabs Header */}
      <div className="flex gap-2 mb-4 border-b pb-2">
        {["files", "participants", "info"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`px-3 py-1 rounded-t font-medium ${active === tab
                ? "bg-[var(--color-primary)] text-white"
                : "bg-gray-100 text-gray-600"
              }`}
          >
            {tab === "files" && "Archivos"}
            {tab === "participants" && "Participantes"}
            {tab === "info" && "Información"}
          </button>
        ))}
      </div>

      {/* Tabs Content */}
      <div className="bg-white p-4 rounded-lg shadow">
        {active === "files" && (
          <div>
            <div className="flex justify-between mb-3">
              <h3 className="font-semibold">Archivos ({files.length})</h3>
              {isOwner && (
                <button
                  onClick={onAddFile}
                  className="bg-[var(--color-primary)] text-white px-4 py-2 rounded hover:opacity-90"
                >
                  + Agregar Archivo
                </button>
              )}
            </div>

            {loadingFiles ? (
              <p className="text-gray-500">Cargando archivos...</p>
            ) : files.length ? (
              <ul className="divide-y">
                {files.map((f: any) => (
                  <li
                    key={f._id}
                    className="flex justify-between items-center py-2"
                  >
                    <div>
                      <p className="font-medium">{f.title}</p>
                      <p className="text-sm text-gray-500">
                        {f.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => downloadFileById(f._id, f.title)}
                        className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                      >
                        Descargar
                      </button>

                      {isOwner && (
                        <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded">
                          Eliminar
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No hay archivos.</p>
            )}
          </div>
        )}

        {active === "participants" && (
          <div>
            <div className="flex justify-between mb-3">
              <h3 className="font-semibold">
                Participantes ({repo.participants?.length || 0})
              </h3>
              {isOwner && (
                <button
                  onClick={onAddUser}
                  className="bg-[var(--color-primary)] text-white px-4 py-2 rounded hover:opacity-90"
                >
                  + Agregar Usuario
                </button>
              )}
            </div>
            {repo.participants?.length ? (
              <ul className="divide-y">
                {repo.participants.map((p: any) => (
                  <li
                    key={p.user?._id || p._id}
                    className="flex justify-between items-center py-2"
                  >
                    <div>
                      <p className="font-medium">{p.user?.username}</p>
                      <p className="text-sm text-gray-500">
                        {p.user?.email}
                      </p>
                    </div>
                    {isOwner && (
                      <div className="flex gap-2 items-center">
                        <select
                          defaultValue={p.role}
                          className="border rounded px-2 py-1 text-sm"
                        >
                          <option value="admin">Admin</option>
                          <option value="writer">Writer</option>
                          <option value="viewer">Viewer</option>
                        </select>
                        <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded">
                          Eliminar
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No hay participantes aún.</p>
            )}
          </div>
        )}

        {active === "info" && (
          <div>
            <h3 className="font-semibold mb-2">Detalles</h3>
            <p className="text-gray-700">Tipo: {repo.typeRepo}</p>
            <p className="text-gray-700">Privacidad: {repo.privacy}</p>
            <p className="text-gray-700">Modo: {repo.mode}</p>
            <p className="text-gray-700">Creador: {repo.owner?.username}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RepositoryDetailTabs;