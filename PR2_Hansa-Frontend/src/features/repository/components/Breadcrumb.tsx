import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';
import { Folder } from '../../../services/folderService';

interface BreadcrumbProps {
  path: Folder[];
  onNavigate: (folderId: string | null) => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ path, onNavigate }) => {
  return (
    <nav className="flex items-center gap-2 px-4 py-3 bg-white border-b border-gray-200">
      {/* Home/Root */}
      <motion.button
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        onClick={() => onNavigate(null)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Home className="w-4 h-4" />
        <span>Repositorio</span>
      </motion.button>

      {/* Folder path */}
      {path.map((folder, index) => (
        <div key={folder._id} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <motion.button
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              index === path.length - 1
                ? 'text-[#9D0045] bg-[#f8dee8]'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => onNavigate(folder._id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {folder.name}
          </motion.button>
        </div>
      ))}
    </nav>
  );
};
