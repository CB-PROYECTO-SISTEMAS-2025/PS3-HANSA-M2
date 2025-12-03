import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FolderPlus, Upload, Folder as FolderIcon, File as FileIcon, MoreVertical, Download, Trash2, Edit3 } from "lucide-react";
// import { toast } from "sonner"; // TODO: Instalar sonner o usar alert
import { getRepositoryById } from "../services/repositoryService";
import FileModal from "../components/FileModal";
import ParticipantModal from "../components/ParticipantModal";
import ApplyCreatorModal from "../../../components/ApplyCreatorModal";
import ApplyMemberModal from "../../../components/ApplyMemberModal";
import { FolderTree } from "../components/FolderTree";
import { Breadcrumb } from "../components/Breadcrumb";
import { CreateFolderModal } from "../components/CreateFolderModal";
import { RenameFolderModal } from "../components/RenameFolderModal";
import { DeleteFolderModal } from "../components/DeleteFolderModal";
import {
  Folder,
  File as FileType,
  createFolder,
  getFolderContents,
  renameFolder,
  deleteFolder,
  getFolderPath,
} from "../../../services/folderService";
import { downloadFileById, deleteFileById } from "../services/filesService";

const RepositoryDetailPage: React.FC = () => {
  const { id } = useParams();

  const [repo, setRepo] = useState<any>(null);
  const [showFileModal, setShowFileModal] = useState(false);
  const [showParticipantModal, setShowParticipantModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("files");

  // Folder system state
  const [allFolders, setAllFolders] = useState<Folder[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  const [subfolders, setSubfolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<FileType[]>([]);
  const [breadcrumbPath, setBreadcrumbPath] = useState<Folder[]>([]);
  const [loadingContents, setLoadingContents] = useState(false);

  // Modal states
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [showRenameFolderModal, setShowRenameFolderModal] = useState(false);
  const [showDeleteFolderModal, setShowDeleteFolderModal] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [showCreatorModal, setShowCreatorModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);

  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  const currentUserId = storedUser ? JSON.parse(storedUser).id : null;

  const fetchRepo = async () => {
    try {
      const data = await getRepositoryById(id!, token!);
      setRepo(data);
    } catch (err) {
      console.error("Error cargando repositorio:", err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchRepo();
  }, [id]);

  // Load all folders for tree view
  useEffect(() => {
    if (!id || activeTab !== "files") return;
    
    const loadAllFolders = async () => {
      try {
        const response = await getFolderContents(undefined, id);
        setAllFolders(response.subfolders);
      } catch (err) {
        console.error("Error loading folders:", err);
      }
    };

    loadAllFolders();
  }, [id, activeTab]);

  // Load current folder contents
  useEffect(() => {
    if (!id || activeTab !== "files") return;

    const loadContents = async () => {
      setLoadingContents(true);
      try {
        const contents = await getFolderContents(currentFolderId || undefined, id);
        setCurrentFolder(contents.currentFolder);
        setSubfolders(contents.subfolders);
        setFiles(contents.files);

        // Load breadcrumb path
        if (currentFolderId) {
          const path = await getFolderPath(currentFolderId);
          setBreadcrumbPath(path);
        } else {
          setBreadcrumbPath([]);
        }
      } catch (err) {
        console.error("Error loading folder contents:", err);
        alert("Error al cargar el contenido");
      } finally {
        setLoadingContents(false);
      }
    };

    loadContents();
  }, [currentFolderId, id, activeTab]);

  // Handle folder creation
  const handleCreateFolder = async (folderName: string) => {
    if (!id) return;

    try {
      await createFolder(id, folderName, currentFolderId || undefined);
      alert("Carpeta creada exitosamente");
      
      // Refresh contents and all folders
      const contents = await getFolderContents(currentFolderId || undefined, id);
      setSubfolders(contents.subfolders);
      
      const allContents = await getFolderContents(undefined, id);
      setAllFolders(allContents.subfolders);
    } catch (err: any) {
      throw err;
    }
  };

  // Handle folder navigation
  const handleNavigateToFolder = (folderId: string | null) => {
    setCurrentFolderId(folderId);
  };

  // Handle folder rename
  const handleRenameFolder = async (newName: string) => {
    if (!selectedFolder) return;

    try {
      await renameFolder(selectedFolder._id, newName);
      alert("Carpeta renombrada exitosamente");
      
      // Refresh contents
      if (!id) return;
      const contents = await getFolderContents(currentFolderId || undefined, id);
      setSubfolders(contents.subfolders);
      
      const allContents = await getFolderContents(undefined, id);
      setAllFolders(allContents.subfolders);
    } catch (err: any) {
      throw err;
    }
  };

  // Handle folder delete
  const handleDeleteFolder = async () => {
    if (!selectedFolder) return;

    try {
      await deleteFolder(selectedFolder._id);
      alert("Carpeta eliminada exitosamente");
      
      // Refresh contents
      if (!id) return;
      const contents = await getFolderContents(currentFolderId || undefined, id);
      setSubfolders(contents.subfolders);
      
      const allContents = await getFolderContents(undefined, id);
      setAllFolders(allContents.subfolders);
    } catch (err: any) {
      throw err;
    }
  };

  if (loading) return <p className="text-center mt-10">Cargando...</p>;
  if (!repo) return <p className="text-center text-red-500 mt-10">No se encontró el repositorio.</p>;

  const isOwner = repo.owner?._id === currentUserId;
  const isParticipant = repo.participants?.some(
    (p: any) => p.user?._id === currentUserId && p.status === "active"
  );
  const hasAccess = isOwner || isParticipant;

  const handleLeave = () => alert("🚪 Abandonar repositorio aún no implementado");

  // If user doesn't have access to this repository, show application message
  if (!hasAccess && repo.privacy === "public") {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-2">{repo.name}</h1>
            <p className="text-gray-600 mb-6">{repo.description || "Sin descripción disponible."}</p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700">
                Este es un repositorio público de tipo <strong>Simple</strong>.
                Para acceder a los archivos y participar, aplica como creador o miembro.
              </p>
            </div>

            <div className="text-sm text-gray-600 space-y-2 mb-6">
              <p><strong>Dueño:</strong> {repo.owner?.username || "N/A"}</p>
              <p><strong>Tipo:</strong> {repo.typeRepo === "simple" ? "Simple" : "Cocreador"}</p>
              <p><strong>Privacidad:</strong> {repo.privacy === "public" ? "Público" : "Privado"}</p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-4">Aplicar</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Creador */}
            <div className="bg-white border rounded-xl p-6 hover:border-blue-400 transition shadow-md">
              <h3 className="text-xl font-semibold mb-1">Creador</h3>
              <p className="text-3xl font-bold text-gray-800 mb-2">Free</p>
              <p className="text-sm text-gray-600 mb-4">
                Aporta tus ideas, tiempo y conocimientos para impulsar este proyecto. 
                Podrás colaborar directamente con el repositorio y proponer mejoras.
              </p>
              <button
                onClick={() => setShowCreatorModal(true)}
                className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
              >
                Aplicar
              </button>
            </div>

            {/* Miembro */}
            <div className="bg-white border rounded-xl p-6 hover:border-blue-400 transition shadow-md">
              <h3 className="text-xl font-semibold mb-1">Miembro</h3>
              <p className="text-3xl font-bold text-gray-800 mb-2">
                $5<span className="text-base text-gray-500">/mo</span>
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Apoya el crecimiento del proyecto aportando económicamente. Obtén acceso a archivos, descargas y avances exclusivos.
              </p>
              <button
                onClick={() => setShowMemberModal(true)}
                className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
              >
                Aplicar
              </button>
            </div>
          </div>

          {/* Modales */}
          {showCreatorModal && (
            <ApplyCreatorModal repoId={id as string} onClose={() => setShowCreatorModal(false)} />
          )}
          {showMemberModal && (
            <ApplyMemberModal repoId={id as string} onClose={() => setShowMemberModal(false)} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-1">{repo.name}</h1>
            <p className="text-gray-600">{repo.description}</p>
          </div>

          <div className="flex gap-2">
            {!isOwner && (
              <button
                onClick={handleLeave}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Abandonar
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-6 border-b">
          {["files", "participants", "info"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === tab
                  ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab === "files" && "Archivos"}
              {tab === "participants" && "Participantes"}
              {tab === "info" && "Información"}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "files" && (
        <div className="flex h-[calc(100vh-260px)]">
          {/* Sidebar - Folder Tree */}
          <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto p-4">
            <div className="mb-4 space-y-2">
              {isOwner && (
                <>
                  <button
                    onClick={() => setShowCreateFolderModal(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#9D0045] text-white rounded-lg hover:bg-[#7d0037] transition-colors"
                  >
                    <FolderPlus className="w-5 h-5" />
                    <span className="font-medium">Nueva Carpeta</span>
                  </button>

                  <button
                    onClick={() => setShowFileModal(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Upload className="w-5 h-5" />
                    <span className="font-medium">Subir Archivo</span>
                  </button>
                </>
              )}
            </div>

            <FolderTree
              folders={allFolders}
              currentFolderId={currentFolderId}
              onFolderClick={handleNavigateToFolder}
            />
          </div>

          {/* Main Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Breadcrumb */}
            <Breadcrumb path={breadcrumbPath} onNavigate={handleNavigateToFolder} />

            {/* Content Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              {loadingContents ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9D0045]"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {/* Subfolders */}
                  {subfolders.map((folder) => (
                    <motion.div
                      key={folder._id}
                      className="group relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onDoubleClick={() => handleNavigateToFolder(folder._id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <FolderIcon className="w-8 h-8 text-[#9D0045]" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{folder.name}</p>
                            <p className="text-xs text-gray-500">Carpeta</p>
                          </div>
                        </div>

                        {/* Actions */}
                        {isOwner && (
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedFolder(folder);
                              }}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <MoreVertical className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Action Menu */}
                      {selectedFolder?._id === folder._id && isOwner && (
                        <motion.div
                          className="absolute top-12 right-2 bg-white border border-gray-200 rounded-lg shadow-xl z-10 py-1"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <button
                            onClick={() => {
                              setShowRenameFolderModal(true);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Edit3 className="w-4 h-4" />
                            Renombrar
                          </button>
                          <button
                            onClick={() => {
                              setShowDeleteFolderModal(true);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Eliminar
                          </button>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}

                  {/* Files */}
                  {files.map((file) => (
                    <motion.div
                      key={file._id}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <FileIcon className="w-8 h-8 text-blue-500 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">{file.title}</p>
                              <p className="text-xs text-gray-500 truncate">{file.originalname}</p>
                            </div>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <button
                              onClick={() => downloadFileById(file._id, file.originalname)}
                              className="p-1 hover:bg-gray-100 rounded"
                              title="Descargar"
                            >
                              <Download className="w-4 h-4 text-gray-600" />
                            </button>
                            {isOwner && (
                              <button
                                onClick={async () => {
                                  if (window.confirm(`¿Eliminar "${file.originalname}"?`)) {
                                    try {
                                      await deleteFileById(file._id);
                                      alert("Archivo eliminado");
                                      // Refresh files
                                      if (!id) return;
                                      const contents = await getFolderContents(currentFolderId || undefined, id);
                                      setFiles(contents.files);
                                      await fetchRepo();
                                    } catch (err) {
                                      console.error(err);
                                      alert("Error al eliminar archivo");
                                    }
                                  }
                                }}
                                className="p-1 hover:bg-red-100 rounded"
                                title="Eliminar"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {file.description && (
                          <p className="text-xs text-gray-600 line-clamp-2">{file.description}</p>
                        )}
                        
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">{(file.size / 1024).toFixed(2)} KB</span>
                            {file.importance > 0 && (
                              <span className={`px-2 py-0.5 rounded-full ${
                                file.importance === 3 ? 'bg-red-100 text-red-700' :
                                file.importance === 2 ? 'bg-orange-100 text-orange-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                Importancia: {file.importance}
                              </span>
                            )}
                            {file.sensitive && (
                              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                                Sensible
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {file.tags && file.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {file.tags.map((tag, idx) => (
                              <span key={idx} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {/* Empty State */}
                  {subfolders.length === 0 && files.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <FolderIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Esta carpeta está vacía</p>
                      <p className="text-sm text-gray-400 mt-1">Crea una carpeta o sube archivos para comenzar</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "participants" && (
        <div className="p-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold text-lg">
                Participantes ({repo.participants?.length || 0})
              </h3>
              {isOwner && (
                <button
                  onClick={() => setShowParticipantModal(true)}
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
                    className="flex justify-between items-center py-3"
                  >
                    <div>
                      <p className="font-medium">{p.user?.username}</p>
                      <p className="text-sm text-gray-500">{p.user?.email}</p>
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
        </div>
      )}

      {activeTab === "info" && (
        <div className="p-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-lg mb-4">Detalles del Repositorio</h3>
            <div className="space-y-2">
              <p className="text-gray-700"><span className="font-medium">Tipo:</span> {repo.typeRepo}</p>
              <p className="text-gray-700"><span className="font-medium">Privacidad:</span> {repo.privacy}</p>
              <p className="text-gray-700"><span className="font-medium">Modo:</span> {repo.mode}</p>
              <p className="text-gray-700"><span className="font-medium">Creador:</span> {repo.owner?.username}</p>
            </div>
          </div>
        </div>
      )}

      {/* Modales */}
      {showFileModal && (
        <FileModal
          repoId={repo._id}
          folderId={currentFolderId}
          onClose={() => setShowFileModal(false)}
          onSuccess={async () => {
            if (!id) return;
            const contents = await getFolderContents(currentFolderId || undefined, id);
            setFiles(contents.files);
            await fetchRepo();
          }}
        />
      )}

      {showParticipantModal && (
        <ParticipantModal
          repoId={repo._id}
          onClose={() => setShowParticipantModal(false)}
          onSuccess={fetchRepo}
        />
      )}

      <CreateFolderModal
        isOpen={showCreateFolderModal}
        onClose={() => setShowCreateFolderModal(false)}
        onSubmit={handleCreateFolder}
        parentFolderName={currentFolder?.name}
      />

      {selectedFolder && (
        <>
          <RenameFolderModal
            isOpen={showRenameFolderModal}
            onClose={() => {
              setShowRenameFolderModal(false);
              setSelectedFolder(null);
            }}
            onSubmit={handleRenameFolder}
            currentName={selectedFolder.name}
          />

          <DeleteFolderModal
            isOpen={showDeleteFolderModal}
            onClose={() => {
              setShowDeleteFolderModal(false);
              setSelectedFolder(null);
            }}
            onConfirm={handleDeleteFolder}
            folderName={selectedFolder.name}
            hasContents={true}
          />
        </>
      )}
    </div>
  );
};

export default RepositoryDetailPage;
