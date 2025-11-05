import React, { useState } from "react";
import api from "../../../utils/api"; // usa tu instancia axios
import { toast } from "sonner";

interface Props {
  repoId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const FileModal: React.FC<Props> = ({ repoId, onClose, onSuccess }) => {
  const token = localStorage.getItem("token");

  const [fileData, setFileData] = useState({
    title: "",
    description: "",
    importance: 0 as 0 | 1 | 2 | 3,
    sensitive: false,
    tags: [] as string[],
    file: null as File | null,
  });

  const [tagInput, setTagInput] = useState("");

  // 🔹 Agregar tag manualmente
  const handleAddTag = () => {
    if (tagInput.trim() !== "") {
      setFileData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  // 🔹 Eliminar tag
  const handleRemoveTag = (tag: string) => {
    setFileData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  // 🔹 Subir archivo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fileData.file) {
      toast.error("Por favor selecciona un archivo.");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileData.file);
    formData.append("title", fileData.title);
    formData.append("description", fileData.description);
    formData.append("importance", String(fileData.importance));
    formData.append("sensitive", String(fileData.sensitive));
    formData.append("tags", JSON.stringify(fileData.tags));

    try {
      const res = await api.post(`/api/files/upload/${repoId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 201) {
        toast.success("Archivo subido correctamente ✅");
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Error al subir el archivo");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full relative shadow-lg animate-fadeIn">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-black text-xl"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4 text-[var(--color-primary)]">
          Agregar Archivo
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <input
            type="text"
            placeholder="Título del archivo"
            value={fileData.title}
            onChange={(e) =>
              setFileData({ ...fileData, title: e.target.value })
            }
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
            required
          />

          {/* Descripción */}
          <textarea
            placeholder="Descripción (opcional)"
            value={fileData.description}
            onChange={(e) =>
              setFileData({ ...fileData, description: e.target.value })
            }
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
          />

          {/* Importancia */}
          <div>
            <p className="font-medium mb-1">Importancia:</p>
            <div className="flex items-center gap-3">
              {[0, 1, 2, 3].map((lvl) => (
                <div
                  key={lvl}
                  onClick={() =>
                    setFileData({ ...fileData, importance: lvl as 0 | 1 | 2 | 3 })
                  }
                  className={`w-6 h-6 rounded-full cursor-pointer transition-all border-2 ${
                    lvl === 0
                      ? "bg-gray-400"
                      : lvl === 1
                      ? "bg-green-500"
                      : lvl === 2
                      ? "bg-orange-400"
                      : "bg-red-500"
                  } ${fileData.importance === lvl ? "ring-2 ring-black" : ""}`}
                  title={
                    lvl === 0
                      ? "Baja"
                      : lvl === 1
                      ? "Media"
                      : lvl === 2
                      ? "Alta"
                      : "Crítica"
                  }
                />
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <p className="font-medium mb-1">Etiquetas:</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Añadir etiqueta"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="flex-grow border rounded px-3 py-2"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-2 bg-[var(--color-primary)] text-white rounded hover:opacity-90"
              >
                +
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {fileData.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-red-500 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Sensible */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={fileData.sensitive}
              onChange={(e) =>
                setFileData({ ...fileData, sensitive: e.target.checked })
              }
              className="h-4 w-4"
            />
            <label className="text-sm text-gray-700">Archivo sensible</label>
          </div>

          {/* Selector de archivo */}
          <div className="flex flex-col items-start gap-2">
            <label className="font-medium">Archivo:</label>
            <label className="cursor-pointer bg-[var(--color-primary)] text-white px-4 py-2 rounded hover:opacity-90 transition">
              Seleccionar Archivo
              <input
                type="file"
                hidden
                onChange={(e) =>
                  setFileData({
                    ...fileData,
                    file: e.target.files ? e.target.files[0] : null,
                  })
                }
              />
            </label>
            {fileData.file && (
              <p className="text-sm text-gray-600 mt-1">
                📄 {fileData.file.name}
              </p>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[var(--color-primary)] text-white rounded hover:opacity-90"
            >
              Subir Archivo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FileModal;
