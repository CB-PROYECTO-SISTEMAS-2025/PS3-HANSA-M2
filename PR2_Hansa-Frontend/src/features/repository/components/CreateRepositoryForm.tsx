import React, { useState } from 'react';

interface Props {
  onSuccess: () => void;
}

const CreateRepositoryForm: React.FC<Props> = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'private' | 'public'>('private');
  const [emailInput, setEmailInput] = useState('');
  const [memberEmails, setMemberEmails] = useState<string[]>([]);

  const handleAddEmail = () => {
    const email = emailInput.trim().toLowerCase();
    if (email && !memberEmails.includes(email)) {
      setMemberEmails([...memberEmails, email]);
      setEmailInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (memberEmails.length === 0) {
      alert('❌ Debes agregar al menos un participante.');
      return;
    }
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/repositorios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description, type, memberEmails }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      alert('✅ Repositorio creado correctamente.');
      onSuccess();
    } catch (err: unknown) {
      console.error(err);
      alert('❌ Error al crear repositorio.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Crear nuevo repositorio</h2>

      <label className="block mb-2 font-medium">Nombre</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full mb-4 px-4 py-2 border rounded"
        required
      />

      <label className="block mb-2 font-medium">Descripción</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full mb-4 px-4 py-2 border rounded"
        rows={3}
      />

      <label className="block mb-2 font-medium">Tipo</label>
      <select
        value={type}
        onChange={(e) => setType(e.target.value as 'private' | 'public')}
        className="w-full mb-4 px-4 py-2 border rounded"
      >
        <option value="private">Privado</option>
        <option value="public">Público</option>
      </select>

      <label className="block mb-2 font-medium">Invitar participantes (correos electrónicos)</label>
      <div className="flex gap-2 mb-2">
        <input
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          className="flex-1 px-4 py-2 border rounded"
          placeholder="correo@ejemplo.com"
        />
        {/* Deshabilitamos el botón si el input está vacío o solo espacios */}
        <button
          type="button"
          onClick={handleAddEmail}
          disabled={emailInput.trim() === ''}
          className={`px-4 rounded text-white ${emailInput.trim() === '' ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            }`}
        >
          +
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {memberEmails.map((email) => (
          <span key={email} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
            {email}
          </span>
        ))}
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
      >
        Crear repositorio
      </button>
    </form>
  );
};

export default CreateRepositoryForm;
