import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit3, Loader2 } from 'lucide-react';

interface RenameFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newName: string) => Promise<void>;
  currentName: string;
}

export const RenameFolderModal: React.FC<RenameFolderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentName,
}) => {
  const [folderName, setFolderName] = useState(currentName);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!folderName.trim()) {
      setError('El nombre de la carpeta no puede estar vacío');
      return;
    }

    if (folderName.trim() === currentName) {
      onClose();
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await onSubmit(folderName.trim());
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al renombrar la carpeta');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFolderName(currentName);
      setError('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#f8dee8] rounded-lg">
                  <Edit3 className="w-5 h-5 text-[#9D0045]" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Renombrar Carpeta</h2>
              </div>
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nuevo nombre
                </label>
                <input
                  type="text"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="Mi Carpeta"
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9D0045] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  autoFocus
                />
              </div>

              {error && (
                <motion.div
                  className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-sm text-red-800">{error}</p>
                </motion.div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !folderName.trim()}
                  className="flex-1 px-4 py-3 bg-[#9D0045] text-white rounded-lg font-medium hover:bg-[#7d0037] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Renombrando...
                    </>
                  ) : (
                    'Renombrar'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
