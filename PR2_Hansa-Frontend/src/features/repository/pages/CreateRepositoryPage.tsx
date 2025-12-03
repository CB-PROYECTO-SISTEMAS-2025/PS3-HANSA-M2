import React from "react";
import RepositoryForm from "../components/RepositoryForm";

const CreateRepositoryPage: React.FC = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-4">Crear Repositorio</h1>
      <RepositoryForm mode="create" />
    </div>
  );
};

export default CreateRepositoryPage;
