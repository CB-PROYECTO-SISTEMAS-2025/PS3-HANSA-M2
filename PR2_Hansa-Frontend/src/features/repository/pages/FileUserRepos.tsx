import { useState, useEffect } from "react";
import { FiX, FiUpload} from "react-icons/fi";
import { debounce } from "lodash";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FileCard from "../components/FileCard";
import { File } from "../types/file"; 
import { fetchFilesByRepositoryId } from "../services/filesService";
import ArchivoModal from "../components/FileModal";
import { useParams } from "react-router-dom";


  const FileUserRepos = () => {
    const [showModal, setShowModal] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [allFiles, setAllFiles] = useState<File[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [fileType, setFileType] = useState("todos");
    const [importanceLevel, setImportanceLevel] = useState(0);
    const [loading, setLoading] = useState(false);
    const [repositoryId, setRepositoryId] = useState<string | null>(null);
    const { id } = useParams<{ id: string }>();
    useEffect(() => {
      const handler = debounce((term: string) => {
        setLoading(true);
        const filtered = allFiles.filter(file =>
          file.filename.toLowerCase().includes(term.toLowerCase())
        );
        setFiles(filtered);
        setLoading(false);
      }, 300);

      handler(searchTerm);

      return () => {
        handler.cancel();
      };
    }, [searchTerm, allFiles]);

    const fetchAndSetFiles = async (repoId: string) => {
  setLoading(true);
  const realFiles = await fetchFilesByRepositoryId(repoId);
  setAllFiles(realFiles);
  setFiles(realFiles);
  setLoading(false);
};

    // Obtener el repositoryId
useEffect(() => {
  const fetchRepoAndFiles = async () => {
    if (!id) return;
    try {
      setRepositoryId(id);
      await fetchAndSetFiles(id);
    } catch {
      setLoading(false);
    }
  };
  fetchRepoAndFiles();
}, [id]);
  
    const resetFilters = () => {
      setSearchTerm("");
      setDateRange([null, null]);
      setFileType("todos");
      setImportanceLevel(0);
      setFiles([]);
    };

    const handleUploaded = async () => {
      console.log("Aca se tendria que refrescar la lista de archivos");
    };
  
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-[var(--color-primary)] text-3xl font-bold text-center mb-8">Mis Archivos</h1>
  
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar archivos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 rounded-lg border border-[var(--color-primarytwo)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none focus:border-transparent placeholder-[var(--color-primarytwo)]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
              >
                <FiX className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
  
          <div className="mt-4 flex flex-wrap gap-4">
            <DatePicker
              selectsRange
              startDate={dateRange[0]}
              endDate={dateRange[1]}
              onChange={(update: [Date | null, Date | null] | null) => setDateRange(update || [null, null])}
              className="p-2 border rounded-md placeholder-[var(--color-primarytwo)] border-[var(--color-primarytwo)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none focus:border-transparent"
              placeholderText="Seleccionar fechas"
            />
  
            <select
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              className="p-2 border rounded-md border-[var(--color-primarytwo)] text-[var(--color-primarytwo)]"
            >
              <option value="todos">Todos los tipos</option>
              <option value="documento">Documento</option>
              <option value="carpeta">Carpeta</option>
            </select>
  
            <select
              value={importanceLevel}
              onChange={(e) => setImportanceLevel(Number(e.target.value))}
              className="p-2 border rounded-md border-[var(--color-primarytwo)] text-[var(--color-primarytwo)]"
            >
              <option value={0}>Importancia</option>
              {[1, 2, 3, 4, 5].map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
  
            <button
              onClick={resetFilters}
              className="text-[var(--color-secondarytwo)] px-4 py-2 bg-white-200 border border-[var(--color-secondarytwo)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] rounded-md transition-colors"
            >
              Resetear filtros
            </button>
            <div className="ml-auto">
              <button
                onClick={() => setShowModal(true)}
                className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FiUpload className="text-xl" />
                Subir Archivo
              </button>

            </div>

            

          </div>
        </div>

        {showModal && repositoryId && (
          <ArchivoModal
            onClose={() => setShowModal(false)}
            repositoryId={repositoryId}
            onUploaded={handleUploaded}
          />
        )}
  
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : files.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {files.map(file => (
              <FileCard key={file._id} file={file} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No se encontraron archivos</p>
          </div>
        )}
      </div>
    );
  };
  
  export default FileUserRepos;
  