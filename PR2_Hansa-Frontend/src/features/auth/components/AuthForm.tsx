import React from "react";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <motion.div 
          animate={{ 
            y: [0, -10, 0],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-20 h-20 mx-auto bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primarytwo)] to-[var(--color-accent)] rounded-full shadow-2xl mb-4 mt-4 shadow-pink-500/30"
        ></motion.div>
        <h2 className="mt-6 text-3xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primarytwo)] bg-clip-text text-transparent">{title}</h2>
        <p className="mt-2 mb-4 text-sm text-gray-600">{subtitle}</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-5">
        {children}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className="w-full py-3 px-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primarytwo)] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:shadow-pink-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Cargando...
            </span>
          ) : buttonText}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default AuthForm;