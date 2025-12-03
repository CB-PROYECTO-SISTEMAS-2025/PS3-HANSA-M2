import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiUpload } from "react-icons/fi";

const ArchivoModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [selectedPriority, setSelectedPriority] = useState<string>("");
    const [isPublic, setIsPublic] = useState(true);
    
    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 relative overflow-y-auto max-h-[90vh]"
                >
                    {/* Botón cerrar */}
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 bg-gray-100 hover:bg-red-50 rounded-full p-2 transition-colors"
                    >
                        <FiX size={24} />
                    </motion.button>

                    {/* Título */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primarytwo)] bg-clip-text text-transparent mb-2">
                            Subir Nuevo Archivo
                        </h2>
                        <p className="text-gray-600 text-sm">Comparte tus documentos con la comunidad</p>
                    </div>

                    <form className="space-y-6">
                        {/* Nombre */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del archivo</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
                                placeholder="Ej. Informe mensual"
                            />
                        </div>

                        {/* Descripción */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
                            <textarea
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
                                rows={4}
                                placeholder="Breve descripción del archivo"
                            ></textarea>
                        </div>

                        {/* Importancia */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Nivel de importancia</label>
                            <div className="flex items-center gap-3">
                                {[
                                    { color: 'bg-red-500', label: 'Alta', value: 'alta' },
                                    { color: 'bg-yellow-400', label: 'Media', value: 'media' },
                                    { color: 'bg-green-500', label: 'Baja', value: 'baja' },
                                    { color: 'bg-gray-400', label: 'Sin prioridad', value: 'none' }
                                ].map((priority) => (
                                    <motion.div
                                        key={priority.value}
                                        whileHover={{ scale: 1.15 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedPriority(priority.value)}
                                        className={`w-8 h-8 ${priority.color} rounded-full cursor-pointer ring-2 ${
                                            selectedPriority === priority.value ? 'ring-gray-800' : 'ring-transparent'
                                        } transition-all`}
                                        title={priority.label}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Etiquetas</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
                                placeholder="Ej. Ciencia, Salud..."
                            />
                            <div className="flex flex-wrap gap-2 mt-3">
                                {["Salud", "Ciencia", "Bienestar"].map((tag) => (
                                    <motion.span
                                        key={tag}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primarytwo)] text-white px-4 py-1.5 rounded-full text-sm font-semibold cursor-pointer hover:shadow-lg"
                                    >
                                        {tag} <span className="ml-1">×</span>
                                    </motion.span>
                                ))}
                            </div>
                        </div>

                        {/* Privacidad */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Privacidad</label>
                            <div className="flex gap-4">
                                <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setIsPublic(true)}
                                    className={`flex-1 font-semibold py-3 rounded-xl transition-all ${
                                        isPublic
                                            ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primarytwo)] text-white shadow-lg'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    🌍 Público
                                </motion.button>
                                <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setIsPublic(false)}
                                    className={`flex-1 font-semibold py-3 rounded-xl transition-all ${
                                        !isPublic
                                            ? 'bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-lg'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    🔒 Privado
                                </motion.button>
                            </div>
                        </div>

                        {/* Subir archivo */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Seleccionar archivo</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[var(--color-primary)] transition-colors cursor-pointer bg-gray-50">
                                <FiUpload className="mx-auto text-4xl text-gray-400 mb-3" />
                                <p className="text-gray-600 mb-2">Arrastra tu archivo aquí o haz clic para seleccionar</p>
                                <input
                                    type="file"
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label htmlFor="file-upload" className="text-[var(--color-primary)] font-semibold cursor-pointer hover:underline">
                                    Buscar archivo
                                </label>
                            </div>
                        </div>

                        {/* Botón subir */}
                        <div className="flex gap-3 pt-4">
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onClose}
                                className="flex-1 border-2 border-gray-300 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </motion.button>
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primarytwo)] text-white font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-pink-500/30 transition-all"
                            >
                                Subir Archivo
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

const Projects: React.FC = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="min-h-screen p-4 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="grid grid-cols-5 grid-rows-5 gap-6 h-full w-full">
                {/* GRID 1 - Sidebar */}
                <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="row-span-5 bg-gradient-to-b from-amber-100 to-amber-200 rounded-2xl shadow-xl flex flex-col items-center py-6 gap-4"
                >
                    <motion.img 
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        src="https://via.placeholder.com/100" 
                        alt="Usuario" 
                        className="rounded-full w-24 h-24 object-cover shadow-lg ring-4 ring-white" 
                    />
                    <h2 className="text-lg font-bold text-center px-4">Daril Dustin<br />Ledezma Maldonado</h2>
                    <div className="w-3/4 border-t-2 border-amber-400 my-4"></div>

                    <div className="flex flex-col gap-3 w-3/4">
                        <motion.button 
                            whileHover={{ scale: 1.05, x: 5 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
                        >
                            Inicio
                        </motion.button>
                        <motion.button 
                            whileHover={{ scale: 1.05, x: 5 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
                        >
                            Mis Proyectos
                        </motion.button>
                    </div>

                    <div className="flex flex-col items-center mt-8 w-3/4">
                        <h3 className="text-md font-semibold mb-2">Proyectos</h3>
                        <motion.button 
                            whileHover={{ scale: 1.03 }}
                            className="bg-white hover:bg-amber-50 w-full py-2 rounded-xl text-sm font-semibold shadow-md transition-colors"
                        >
                            Campo de Estudio
                        </motion.button>
                    </div>
                </motion.div>

                {/* GRID 2 - Header */}
                <motion.div 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="col-span-4 bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-between px-6 py-4 rounded-2xl shadow-xl"
                >
                    <h1 className="text-white text-3xl font-bold">Campo de Estudio</h1>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowModal(true)}
                        className="bg-white text-amber-600 font-bold px-6 py-2.5 rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                    >
                        <FiUpload />
                        Subir archivo
                    </motion.button>
                </motion.div>

                {/* GRID 3 - Content */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="col-span-4 row-span-4 col-start-2 row-start-2 bg-white p-6 flex flex-col overflow-hidden rounded-2xl shadow-xl"
                >
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center bg-gray-100 rounded-xl px-4 py-3 w-full max-w-xs shadow-inner">
                            <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input type="text" placeholder="Buscar archivos" className="outline-none w-full bg-transparent" />
                        </div>
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="ml-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primarytwo)] text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg transition-all"
                        >
                            Ver Participantes
                        </motion.button>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-6">
                        {['Fecha', 'Importancia', 'Tipo de Archivos'].map((filter) => (
                            <motion.select 
                                key={filter}
                                whileHover={{ scale: 1.02 }}
                                className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer outline-none"
                            >
                                <option>{filter}</option>
                            </motion.select>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pr-2">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <motion.div
                                key={item}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: item * 0.1 }}
                                whileHover={{ scale: 1.03, y: -5 }}
                                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl h-40 flex items-center justify-center text-gray-700 font-semibold shadow-md hover:shadow-xl transition-all cursor-pointer"
                            >
                                Archivo {item}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* MODAL */}
            {showModal && <ArchivoModal onClose={() => setShowModal(false)} />}
        </div>
    );
};

export default Projects;
