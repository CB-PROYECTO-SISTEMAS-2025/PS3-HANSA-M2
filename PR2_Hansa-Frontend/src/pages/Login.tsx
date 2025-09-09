const Home = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">

                {/* Panel izquierdo */}
                <div className="w-full md:w-1/2 p-6 md:p-8 bg-red-600 rounded-t-lg md:rounded-t-none md:rounded-l-lg flex flex-col justify-center items-center text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">UNIVALLE</h1>
                    <p className="text-white">
                        Tu plataforma académica para organizar, compartir y colaborar en tus archivos de estudio. Accede a todos tus documentos desde cualquier lugar.
                    </p>
                </div>

                {/* Panel derecho (formulario) */}
                <div className="w-full md:w-1/2 p-6 md:p-8 bg-gray-50 rounded-b-lg md:rounded-b-none md:rounded-r-lg">
                    <h2 className="text-2xl font-semibold mb-6">Inicio de sesión</h2>
                    <form>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-bold text-gray-700 text-left">EMAIL</label>
                            <input
                                type="email"
                                id="email"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-bold text-gray-700 text-left">CONTRASEÑA</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    id="password"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                                <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                                    <i className="fas fa-eye"></i>
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mb-6">
                            <a href="#" className="text-sm text-blue-600 hover:underline">¿Olvidaste tu contraseña?</a>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Iniciar sesión
                            </button>
                        </div>
                    </form>
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            ¿No tienes una cuenta? <a href="/Register" className="text-blue-600 hover:underline">Crear cuenta</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>

    );
};
export default Home;