
const Register = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-lg">
                <div className="w-1/2 p-8 bg-red-600 rounded-l-lg flex flex-col justify-center items-center">
                    <h1 className="text-4xl font-bold text-white mb-4">UNIVALLE</h1>
                    <p className="text-white text-center">
                        Tu plataforma académica para organizar, compartir y colaborar en tus archivos de estudio. Accede a todos tus documentos desde cualquier lugar.
                    </p>
                </div>
                <div className="w-1/2 p-8 bg-gray-50 rounded-r-lg">
                    <h2 className="text-2xl font-semibold mb-6">Crear Cuenta</h2>
                    <form>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-bold text-gray-700 text-left">
                                EMAIL
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-bold text-gray-700 text-left">
                                USUARIO
                            </label>
                            <input
                                type="text"
                                id="usuario"
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
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-bold text-gray-700 text-left">CONFIRMAR CONTRASEÑA</label>
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
                        <div className="mb-4">
                            <label className="inline-flex items-center">
                                <input type="checkbox" className="form-checkbox text-blue-600" />
                                <span className="ml-2 text-sm text-gray-700">Acepto los <a href="/VerifiCode" className="text-blue-600">Términos y Condiciones</a></span>
                            </label>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Crear Cuenta
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default Register;