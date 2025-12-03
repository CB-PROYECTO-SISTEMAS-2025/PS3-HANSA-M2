import React, { useState } from "react";
import { createRepository } from "../services/repositoryService";
import { useNavigate } from "react-router-dom";

interface Repo {
  name: string;
  description: string;
  typeRepo: "simple" | "creator";
  mode?: "personal" | "grupal";
  privacy: "public" | "private" | string;
  interestAreas: string[];
  geoAreas: string[];
  sectors: string[];
  [key: string]: any;
}

interface Props {
  mode: "create" | "edit";
  repoData?: Partial<Repo>;
}

const RepositoryForm: React.FC<Props> = ({ mode, repoData }) => {
  const navigate = useNavigate();
  const [repo, setRepo] = useState<Repo>(
    (repoData as Repo) || {
      name: "",
      description: "",
      typeRepo: "simple",
      mode: "personal",
      privacy: "public",
      interestAreas: [],
      geoAreas: [],
      sectors: [],
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setRepo({ ...repo, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (name: keyof Repo, value: string) => {
    if (!value.trim()) return;
    setRepo((prev) => ({
      ...prev,
      [name]: Array.from(new Set([...(prev[name] || []), value.trim()])),
    } as Repo));
  };

  const handleRemoveItem = (name: keyof Repo, value: string) => {
    setRepo((prev) => ({
      ...prev,
      [name]: (prev[name] || []).filter((v: string) => v !== value),
    } as Repo));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

  const payload: Partial<Repo> = { ...repo };

    // 🧠 Lógica de validación dinámica
    if (repo.typeRepo === "creator") {
      payload.privacy = "public"; // Siempre público
      delete payload.mode; // No aplica
    } else if (repo.typeRepo === "simple") {
      delete payload.interestAreas;
      delete payload.geoAreas;
      delete payload.sectors;
    }

    try {
      await createRepository(payload, token!);
      navigate("/mis-repositorios");
    } catch (err) {
      console.error(err);
      alert("Error al crear el repositorio");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow p-6 rounded-lg space-y-6">
      {/* === Datos generales === */}
      <div>
        <label className="block font-semibold">Título</label>
        <input
          name="name"
          value={repo.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Ej. Proyecto Ecofriendly"
          required
        />
      </div>

      <div>
        <label className="block font-semibold">Descripción</label>
        <textarea
          name="description"
          value={repo.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Describe brevemente el propósito del repositorio"
        />
      </div>

      {/* === Tipo y configuración === */}
<div className="grid grid-cols-2 gap-4">
  <div>
    <label className="block font-semibold">Tipo de Repositorio</label>
    <select
      name="typeRepo"
      value={repo.typeRepo}
      onChange={handleChange}
      className="w-full border p-2 rounded"
    >
      <option value="simple">Simple</option>
      <option value="creator">Cocreador</option>
    </select>

    {/* ░░░ EXPLICACIÓN DE CADA TIPO (VISUAL – NO CAMBIA EL BACKEND) ░░░ */}
    <div className="mt-3 text-xs bg-gray-100 p-3 rounded border">
      {repo.typeRepo === "simple" ? (
        <>
          <p className="font-semibold text-pink-600">Repositorio Simple</p>
          <p className="text-gray-600 mt-1">
            Ideal para proyectos personales, compartir ideas,
            colaborar con amigos o trabajar en pequeños proyectos.
            Puede ser público o privado, y puede ser personal o grupal.
          </p>
        </>
      ) : (
        <>
          <p className="font-semibold text-blue-600">Repositorio de Cocreadores</p>
          <p className="text-gray-600 mt-1">
            Diseñado para proyectos serios como investigaciones, 
            desarrollo de software o iniciativas colaborativas formales. 
            Los usuarios deben enviar una solicitud para unirse como cocreadores.
          </p>
        </>
      )}
    </div>
  </div>

  {/* PRIVACIDAD */}
  {repo.typeRepo === "simple" ? (
    <div>
      <label className="block font-semibold">Privacidad</label>
      <select
        name="privacy"
        value={repo.privacy}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      >
        <option value="public">Público</option>
        <option value="private">Privado</option>
      </select>
    </div>
  ) : (
    <div>
      <label className="block font-semibold">Privacidad</label>
      <input
        type="text"
        value="Público (fijo)"
        disabled
        className="w-full border p-2 rounded bg-gray-100 text-gray-500"
      />
    </div>
  )}
</div>


      {/* === Configuración específica === */}
      {repo.typeRepo === "simple" && (
        <div>
          <label className="block font-semibold">Categoría</label>
          <select
            name="mode"
            value={repo.mode}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="personal">Personal</option>
            <option value="grupal">Grupal</option>
          </select>
        </div>
      )}

      {repo.typeRepo === "creator" && (
        <>
          {/* Tags */}
          <div>
            <label className="block font-semibold">Áreas de interés</label>
            <TagInput
              label="interestAreas"
              items={repo.interestAreas}
              onAdd={handleArrayChange}
              onRemove={handleRemoveItem}
            />
          </div>

          <div>
            <label className="block font-semibold">Áreas geográficas</label>
            <TagInput
              label="geoAreas"
              items={repo.geoAreas}
              onAdd={handleArrayChange}
              onRemove={handleRemoveItem}
            />
          </div>

          <div>
            <label className="block font-semibold">Sectores de aporte</label>
            <TagInput
              label="sectors"
              items={repo.sectors}
              onAdd={handleArrayChange}
              onRemove={handleRemoveItem}
            />
          </div>
        </>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-6 py-2 rounded transition"
        >
          {mode === "create" ? "Crear Repositorio" : "Guardar Cambios"}
        </button>
      </div>
    </form>
  );
};

// ✅ Subcomponente TagInput (interno)
const TagInput = ({
  label,
  items,
  onAdd,
  onRemove,
}: {
  label: string;
  items: string[];
  onAdd: (name: string, value: string) => void;
  onRemove: (name: string, value: string) => void;
}) => {
  const [value, setValue] = useState("");

  const handleAdd = () => {
    onAdd(label, value);
    setValue("");
  };

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Agregar..."
          className="border p-2 rounded flex-1"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="bg-[var(--color-primary)] text-white px-3 py-2 rounded"
        >
          +
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-gray-200 rounded-full flex items-center gap-1"
          >
            {tag}
            <button
              type="button"
              onClick={() => onRemove(label, tag)}
              className="text-red-500 font-bold"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default RepositoryForm;
