import React from "react";

interface VerificationFormProps {
  loading: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
}

const VerificationForm: React.FC<VerificationFormProps> = ({ loading, onSubmit, children }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {children}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[var(--color-primary)] text-white py-2 rounded-md font-semibold hover:bg-[var(--color-primary-hover)] transition disabled:opacity-50"
      >
        {loading ? "Verificando..." : "Confirmar"}
      </button>
    </form>
  );
};

export default VerificationForm;