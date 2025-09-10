import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SidebarNavigation from './Sidebar';
import { FiMenu } from 'react-icons/fi';

const Layout: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(prev => !prev);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <SidebarNavigation isOpen={isOpen} toggleSidebar={toggleSidebar} />

      {/* Contenido principal */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isOpen ? 'lg:ml-64' : ''
        }`}
      >
        {/* Botón de menú (siempre visible) */}
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white text-[var(--color-primary)] hover:text-white hover:bg-[var(--color-primary)] transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-600"
        >
          <FiMenu className="w-6 h-6" />
        </button>

        {/* Rutas hijas */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
