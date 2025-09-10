import { FiFile, FiStar } from "react-icons/fi";
import { File } from "../types/file";
import { getImportanceColor } from "../utils/fileHelpers"; // Importa la función getImportanceColor

interface FileCardProps {
  file: File;
}

const FileCard: React.FC<FileCardProps> = ({ file }) => {
  return (
    <div
      className={`relative bg-gradient-to-b ${getImportanceColor(
        Number(file.metadata.importance)
      )} bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden`}
      role="article"
      tabIndex={0}
    >

      <div className="flex items-start justify-between w-full">
        <div className="flex items-center gap-2 w-[calc(100%-80px)] overflow-hidden">
          <FiFile className="w-5 h-5 text-blue-600 shrink-0" />
          <h3 className="font-medium text-gray-900 truncate">{file.filename}</h3>
        </div>
        <div className="flex items-center gap-0.5">
          {[...Array(Number(file.metadata.importance))].map((_, i) => (
            <FiStar key={i} className="w-4 h-4 text-amber-400 fill-current" />
          ))}
        </div>
      </div>


      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
        {file.metadata.description}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {file.metadata.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 text-xs rounded-full bg-gray-50 text-gray-600 border border-gray-100"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        <span
          className={`px-2 py-1 rounded-full ${file.metadata.privacy === "publico"
            ? "bg-emerald-50 text-emerald-700"
            : "bg-rose-50 text-rose-700"
            }`}
        >
          {file.metadata.privacy}
        </span>
        <span className="text-gray-500">
          {new Date(file.uploadDate).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default FileCard;
