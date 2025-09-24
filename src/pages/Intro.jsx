import { Link } from "react-router-dom";

export const Intro = () => {
    return (
        <div
            className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('introImage.webp')" }}
        >
            {/* Overlay violeta tech */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-700 opacity-80"></div>
            {/* Glassmorphism card */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full px-6">
                <div className="text-center text-white max-w-lg mx-auto space-y-8 py-12 px-6 rounded-3xl backdrop-blur-md bg-white bg-opacity-10 border border-white border-opacity-20 shadow-2xl">
                    {/* Icono tech */}
                    {/*    <div className="flex justify-center mb-4">
                        <img src="icono.svg" alt="WorkSchedFlow Logo" className="w-16 h-16 drop-shadow-xl" />
                    </div> */}
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-purple-200 drop-shadow-lg mb-4 font-mono">
                        WorkSchedFlow
                    </h1>
                    <div className="space-y-4 text-lg md:text-xl font-semibold text-purple-100">
                        <p>Gestión integral de equipos de trabajo</p>
                        <p>Diseño y gestión de cuadrantes</p>
                        <p>Control de registro horario y notificación de ausencias</p>
                        <p className="text-base text-purple-300 font-normal">Automatiza, visualiza y optimiza tu equipo con tecnología moderna</p>
                    </div>
                    <Link
                        to="/daily"
                        className="inline-block bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600 hover:scale-105 text-white font-bold py-4 px-10 rounded-full transition-all duration-200 shadow-xl mt-8 text-xl tracking-wide border-2 border-white border-opacity-20"
                    >
                        ¡Entrar y gestionar mi equipo!
                    </Link>
                </div>
            </div>
        </div>
    );
};
