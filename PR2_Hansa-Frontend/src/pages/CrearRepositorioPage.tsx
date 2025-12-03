import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRepository } from "../features/repository/services/repositoryService";

const CrearRepositorioPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "Simple",
    privacy: "Público",
    areaInteres: [] as string[],
    areaGeografica: [] as string[],
    sectorAporte: [] as string[],
  });

  const opciones = {
    areaInteres: ["Ciencia", "Biología", "Tecnología", "Educación"],
    areaGeografica: ["Cochabamba/Bolivia", "La Paz/Bolivia", "Lima/Perú"],
    sectorAporte: ["Académico", "Privado", "Gubernamental", "ONG"],
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTag = (field: keyof typeof formData, tag: string) => {
    if (Array.isArray(formData[field]) && !formData[field].includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...(prev[field] as string[]), tag],
      }));
    }
  };

  const handleRemoveTag = (field: keyof typeof formData, tag: string) => {
    if (Array.isArray(formData[field])) {
      setFormData((prev) => ({
        ...prev,
        [field]: (prev[field] as string[]).filter((t) => t !== tag),
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token") || undefined;
      await createRepository(formData, token || "");
      alert("Repositorio creado correctamente");
      navigate("/mis-repositorios");
    } catch (err) {
      console.error(err);
      alert("Error al crear el repositorio");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white shadow rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Crear Repositorio</h1>

        {/* Repositorio */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">Repositorio</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium">Título</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Ej. Proyecto EcoFriendly"
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Describe el propósito del repositorio..."
                rows={3}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>
        </section>

        {/* Configuración */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">Configuración</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium">Tipo</label>
              <select
                value={formData.type}
                onChange={(e) => handleChange("type", e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-500"
              >
                <option value="Simple">Simple</option>
                <option value="Creador">Creador</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Privacidad</label>
              <select
                value={formData.privacy}
                onChange={(e) => handleChange("privacy", e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-500"
              >
                <option value="Público">Público</option>
                <option value="Privado">Privado</option>
              </select>
            </div>
          </div>

          {/* Solo si es tipo Creador */}
          {formData.type === "Creador" && (
            <div className="grid md:grid-cols-3 gap-6 mt-6">
              {(["areaInteres", "areaGeografica", "sectorAporte"] as const).map((field) => (
                <div key={field}>
                  <label className="block text-gray-700 font-medium mb-2 capitalize">
                    {field.replace(/([A-Z])/g, " $1")}
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(formData[field] as string[]).map((tag) => (
                      <span
                        key={tag}
                        className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(field, tag)}
                          className="ml-1 font-bold text-pink-600 hover:text-pink-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <select
                    onChange={(e) => {
                      handleAddTag(field, e.target.value);
                      e.target.value = "";
                    }}
                    className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500"
                    defaultValue=""
                  >
                    <option value="">Seleccionar...</option>
                    {opciones[field].map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Escribir otro y presionar Enter"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag(field, e.currentTarget.value);
                        e.currentTarget.value = "";
                      }
                    }}
                    className="w-full border rounded-md px-3 py-2 mt-2 text-sm focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Botones */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => navigate("/mis-repositorios")}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
          >
            Crear Repositorio
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrearRepositorioPage;
