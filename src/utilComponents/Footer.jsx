import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../timeTrack/context/AuthContext";

export const Footer = () => {
    const { auth } = useContext(AuthContext);
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-gray-800 bg-gray-900 text-gray-400 ">
            <div className="max-w-6xl mx-auto px-6 py-12">

                <div className="grid md:grid-cols-3 gap-10">

                    {/* BRAND */}
                    <div>
                        <h3 className="text-lg font-semibold text-white">
                            WorkSchedFlow
                        </h3>
                        <p className="text-sm text-indigo-400 mt-1">
                            Gestión de turnos y fichajes
                        </p>

                        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-3">
                            <span>
                                © {currentYear} WorkSchedFlow
                            </span>

                            {/* Nota ligera, sin el rollo largo */}
                            <span className="text-gray-600">
                                Sistema de gestión de jornada laboral
                            </span>
                        </div>
                    </div>

                    {/* NAVEGACIÓN */}
                    <div>
                        <h4 className="text-white font-medium mb-3 text-sm">
                            Navegación
                        </h4>
                        <ul className="space-y-2 text-sm">

                            {(auth.role === "ADMIN" || auth.role === "DEMO") && (
                                <>
                                    <li>
                                        <Link to="/" className="hover:text-white transition">
                                            Cuadrantes
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/schedules" className="hover:text-white transition">
                                            Mensual
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/admin" className="hover:text-white transition">
                                            Admin
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/generic-roster" className="hover:text-white transition">
                                            Generic Roster
                                        </Link>
                                    </li>
                                </>
                            )}

                            {auth.role === "USER" && (
                                <>
                                    <li>
                                        <Link to="/schedules" className="hover:text-white transition">
                                            Mensual
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/revisar" className="hover:text-white transition">
                                            Fichajes
                                        </Link>
                                    </li>
                                </>
                            )}

                            <li>
                                <Link to="/fichar" className="hover:text-white transition">
                                    Fichar
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* INFO / EXTERNO */}
                    <div>
                        <h4 className="text-white font-medium mb-3 text-sm">
                            Proyecto
                        </h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/info" className="hover:text-white transition">
                                    Sobre el proyecto
                                </Link>
                            </li>
                            <li>
                                <a
                                    href="https://sergiomsrs.github.io/wsf-landing/guia/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-white transition"
                                >
                                    Guia de uso
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.linkedin.com/in/sergio-mendez-soler-03902aa5/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-white transition"
                                >
                                    Sobre el desarrollador
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};