import React from "react";

interface AuthFormProps {
  title: string;
  subtitle: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
  loading: boolean;
  buttonText: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ title, subtitle, onSubmit, children, loading, buttonText }) => {
  return (
    <div>
      <div className="text-center">
        <div className="w-20 h-20 mx-auto bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primarytwo)] rounded-full animate-bounce shadow-lg mb-4 mt-4"></div>
        <h2 className="mt-6 text-3xl font-bold text-gray-900">{title}</h2>
        <p className="mt-2 mb-4 text-sm text-gray-600">{subtitle}</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        {children}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-[var(--color-primary)] text-white font-semibold rounded-md shadow-sm hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
        >
          {loading ? "Cargando..." : buttonText}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;