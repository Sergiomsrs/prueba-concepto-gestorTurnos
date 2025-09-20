import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../timeTrack/context/AuthContext";
import { saludo } from '../timeTrack/utilities/timeManagement';

export const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center">
        {/* Bloque Izquierdo: Branding (clicable) */}
        <div className="w-1/3 flex items-center">
          <Link to="/admin" className="group cursor-pointer">
            <h1 className="text-2xl lg:text-3xl font-bold text-indigo-400 leading-tight group-hover:text-indigo-300 transition">WorkSchedFlow</h1>
            <h2 className="text-sm lg:text-base font-light text-gray-400 leading-tight group-hover:text-indigo-200 transition">Gestión de equipos de trabajo</h2>
          </Link>
        </div>

        {/* Bloque Central: Navegación */}
        <div className="w-1/3 flex justify-center">
          <div className="hidden md:flex items-center">
            <div className="flex divide-x divide-indigo-700 bg-gray-800 rounded-lg overflow-hidden shadow">
              <Link
                to="/"
                className="px-6 py-2.5 text-lg text-gray-200 hover:bg-indigo-600 hover:text-white font-semibold transition"
              >
                Cuadrantes
              </Link>
              <Link
                to="/schedules"
                className="px-6 py-2.5 text-lg text-gray-200 hover:bg-indigo-600 hover:text-white font-semibold transition"
              >
                Mensual
              </Link>
              <Link
                to="/admin"
                className="px-6 py-2.5 text-lg text-gray-200 hover:bg-indigo-600 hover:text-white font-semibold transition"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>

        {/* Bloque Derecho: Usuario/Login */}
        <div className="w-1/3 flex justify-end items-center">
          <div className="hidden md:flex items-center gap-4">
            {auth.isAuthenticated ? (
              <>
                <span className="text-base text-gray-200 font-bold bg-gray-700 px-3 py-1 rounded">
                  <strong>{saludo()},</strong> {auth.user?.name} {auth.user?.lastName}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 rounded transition"
                >
                  Log out
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-current">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                    <path d="M9 12h12l-3 -3" />
                    <path d="M18 15l3 -3" />
                  </svg>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 rounded transition"
              >
                Log in
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-current">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M15 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                  <path d="M21 12h-13l3 -3" />
                  <path d="M11 15l-3 -3" />
                </svg>
              </Link>
            )}
          </div>
          {/* Menú hamburguesa (móvil) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden ml-2 p-2 rounded text-indigo-400 hover:bg-gray-800 focus:outline-none"
            aria-label="Abrir menú"
          >
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-gray-900 border-t border-gray-800 shadow-lg px-6 py-4 space-y-4 z-50">
          <div className="flex flex-col gap-3">
            <Link to="/" className="text-gray-300 hover:text-indigo-400 transition font-medium" onClick={() => setMenuOpen(false)}>Cuadrantes</Link>
            <Link to="/schedules" className="text-gray-300 hover:text-indigo-400 transition font-medium" onClick={() => setMenuOpen(false)}>Mensual</Link>
            <Link to="/admin" className="text-gray-300 hover:text-indigo-400 transition font-medium" onClick={() => setMenuOpen(false)}>Admin</Link>
          </div>
          <div className="mt-4 border-t border-gray-700 pt-4 flex flex-col gap-2">
            {auth.isAuthenticated ? (
              <>
                <span className="text-sm text-gray-200 font-bold bg-gray-700 px-3 py-1 rounded">
                  <strong>{saludo()},</strong> {auth.user?.name} {auth.user?.lastName}
                </span>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 rounded transition"
                >
                  Log out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 rounded transition"
                onClick={() => setMenuOpen(false)}
              >
                Log in
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

