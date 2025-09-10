import React, { useState,useCallback } from "react";
import { useUser } from "../../../context/useUser";
import { uploadFile } from "../services/filesService";
import { useDropzone } from "react-dropzone";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { FiX, FiUpload, FiStar } from "react-icons/fi";

interface ArchivoModalProps {
  onClose: () => void;
  repositoryId: string;
  onUploaded: () => void;
}

const ArchivoModal: React.FC<ArchivoModalProps> = ({ onClose, repositoryId, onUploaded }) => {
  const [fileName, setFileName] = useState("");
  const [description, setDescription] = useState("");
  const [importance, setImportance] = useState("none");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [privacy, setPrivacy] = useState("private");
  const [file, setFile] = useState<File | null>(null);
  const [hoverRating, setHoverRating] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useUser();

   const onDrop = useCallback((acceptedFiles: File[]) => {
     if (acceptedFiles.length > 0) {
       const selectedFile = acceptedFiles[0];
       setFile(selectedFile);
       setFileName(selectedFile.name);
     }
   }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxFiles: 1,
  });

  const handleSubmit = async () => {
    if (!file) return alert("Selecciona un archivo.");
    setIsUploading(true);
    const formData = new FormData();
    formData.append("title", fileName);
    formData.append("author", user?.username || "");
    formData.append("description", description);
    formData.append("importance", importance);
    formData.append("tags", tags.join(","));
    formData.append("privacy", privacy);
    formData.append("file", file);
    formData.append("repositoryId", repositoryId);

    try {
      await uploadFile(formData);
      alert("Archivo subido exitosamente.");
      onUploaded();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error al subir el archivo.");
    }
    finally {
      setIsUploading(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() !== "" && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileName("");
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[var(--color-primary)]">Subir nuevo archivo</h2>
                    <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                    <FiX className="text-2xl" />
                    </button>
                </div>
                <div className="mb-6">
                    <label className="block mb-1 text-sm font-medium text-gray-700">Seleccionar archivo</label>
                    <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                        ${isDragActive ? "border-[var(--color-primarytwo)] bg-[var(--color-primaryfaint)]" : "border-gray-300 hover:border-[var(--color-primarytwo)]"}`}
                    >
                    <input {...getInputProps()} />
                    <AiOutlineCloudUpload className="text-4xl mx-auto mb-4 text-[var(--color-primarytwo)]" />
                    <p className="text-gray-600">
                        {isDragActive ? "Suelta el archivo aquí" : "Arrastra un archivo aquí o haz clic para seleccionar"}
                    </p>
                    </div>

                    {file && (
                    <div className="mt-4 flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                            <FiUpload className="text-gray-600" />
                        </div>
                        <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <button
                        onClick={handleRemoveFile}
                        className="text-red-500 hover:text-red-700"
                        >
                        <FiX />
                        </button>
                    </div>
                    )}
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                    </label>
                    <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe tu archivo"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Importancia
                    </label>
                    <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                        key={star}
                        onClick={() => setImportance(star.toString())}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className={`text-2xl ${star <= (hoverRating || Number(importance)) ? "text-yellow-400" : "text-gray-300"}
                            hover:text-yellow-400 transition-colors`}
                        >
                        <FiStar className="fill-current" />
                        </button>
                    ))}
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Etiquetas
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map(tag => (
                        <span
                        key={tag}
                        className="bg-[var(--color-primaryfaint)] text-[var(--color-primary)] px-3 py-1 rounded-full text-sm flex items-center gap-1"
                        >
                        {tag}
                        <button onClick={() => handleRemoveTag(tag)} className="hover:text-[var(--color-primary-hover)]">
                            <FiX />
                        </button>
                        </span>
                    ))}
                    </div>
                    <div className="flex gap-2">
                    <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                        placeholder="Añadir etiqueta"
                        className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                        onClick={handleAddTag}
                        disabled={!tagInput || tags.length >= 5}
                        className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] disabled:opacity-50"
                    >
                        Añadir
                    </button>
                    </div>
                </div>

                <div className="mb-5">
                    <label className="block mb-1 text-sm font-medium text-gray-700">Privacidad</label>
                    <div className="flex gap-4">
                        <button type="button" onClick={() => setPrivacy("public")}
                            className={`w-full py-2 rounded-lg font-semibold border ${privacy === "public" ? "bg-[var(--color-primarytwo)] text-white" : "border-[var(--color-primarytwo)] text-[var(--color-primary)]"}`}>
                            Público
                        </button>
                        <button type="button" onClick={() => setPrivacy("private")}
                            className={`w-full py-2 rounded-lg font-semibold border ${privacy === "private" ? "bg-[var(--color-primarytwo)] text-white" : "border-[var(--color-primarytwo)] text-[var(--color-primary)]"}`}>
                            Privado
                        </button>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-4">
                    <button
                    onClick={onClose}
                    className="px-6 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                    >
                    Cancelar
                    </button>
                    <button
                    onClick={handleSubmit}
                    disabled={isUploading}
                    className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] disabled:opacity-50
                        flex items-center gap-2"
                    >
                    {isUploading ? (
                        <>
                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        Subiendo...
                        </>
                    ) : (
                        <>Subir Archivo</>
                    )}
                    </button>
                </div>

            </div>
        </div>
    </div>
    
  );
};

export default ArchivoModal;