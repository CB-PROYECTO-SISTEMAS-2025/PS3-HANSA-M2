import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder } from '../../../services/folderService';
import { ChevronRight, ChevronDown, Folder as FolderIcon, FolderOpen } from 'lucide-react';

interface FolderTreeProps {
  folders: Folder[];
  currentFolderId: string | null;
  onFolderClick: (folderId: string | null) => void;
  level?: number;
}

interface FolderNode extends Folder {
  children: FolderNode[];
}

/**
 * Build a tree structure from flat folder array
 */
const buildFolderTree = (folders: Folder[], parentId: string | null = null): FolderNode[] => {
  return folders
    .filter(folder => folder.parentFolder === parentId)
    .map(folder => ({
      ...folder,
      children: buildFolderTree(folders, folder._id),
    }));
};

const FolderTreeItem: React.FC<{
  node: FolderNode;
  currentFolderId: string | null;
  onFolderClick: (folderId: string | null) => void;
  level: number;
}> = ({ node, currentFolderId, onFolderClick, level }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = node.children.length > 0;
  const isActive = currentFolderId === node._id;

  return (
    <div>
      <motion.div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
          isActive
            ? 'bg-[#9D0045] text-white'
            : 'hover:bg-gray-100 text-gray-700'
        }`}
        style={{ paddingLeft: `${level * 16 + 12}px` }}
        onClick={() => {
          onFolderClick(node._id);
          if (hasChildren) setIsExpanded(!isExpanded);
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-0.5 hover:bg-gray-200 rounded transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        ) : (
          <div className="w-5" />
        )}
        
        {isExpanded ? (
          <FolderOpen className="w-5 h-5" />
        ) : (
          <FolderIcon className="w-5 h-5" />
        )}
        
        <span className="text-sm font-medium truncate">{node.name}</span>
      </motion.div>

      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            {node.children.map(child => (
              <FolderTreeItem
                key={child._id}
                node={child}
                currentFolderId={currentFolderId}
                onFolderClick={onFolderClick}
                level={level + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FolderTree: React.FC<FolderTreeProps> = ({
  folders,
  currentFolderId,
  onFolderClick,
  level = 0,
}) => {
  const tree = buildFolderTree(folders);

  return (
    <div className="space-y-1">
      {/* Root level - show all files */}
      <motion.div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
          currentFolderId === null
            ? 'bg-[#9D0045] text-white'
            : 'hover:bg-gray-100 text-gray-700'
        }`}
        onClick={() => onFolderClick(null)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="w-5" />
        <FolderIcon className="w-5 h-5" />
        <span className="text-sm font-medium">Todos los archivos</span>
      </motion.div>

      {/* Folder tree */}
      {tree.map(node => (
        <FolderTreeItem
          key={node._id}
          node={node}
          currentFolderId={currentFolderId}
          onFolderClick={onFolderClick}
          level={level}
        />
      ))}
    </div>
  );
};
