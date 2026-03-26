import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../timeTrack/context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { AppContext } from "@/context/AppContext";

export const Navbar = () => {
  const queryClient = useQueryClient();
  const { auth, logout } = useContext(AuthContext);
  const { setFilters } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    navigate('/login');
    queryClient.clear();
    setFilters({ startDate: "", endDate: "", selectedTeams: [], employeeName: "", hideZeroHours: false });
    setUserMenuOpen(false);
    setMenuOpen(false);
    logout();
  };

  const initials = `${auth.user?.name?.charAt(0) ?? ''}${auth.user?.lastName?.charAt(0) ?? ''}`.toUpperCase();

  return (
    <nav className="bg-gray-900 border-b border-gray-800 shadow-sm relative z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

        {/* 1. Branding */}
        <div className="flex-shrink-0">
          <a href="https://sergiomsrs.github.io/wsf-landing/" target="_blank" className="group cursor-pointer">
            <h1 className="text-2xl lg:text-3xl font-bold text-indigo-400 leading-tight group-hover:text-indigo-300 transition">WorkSchedFlow</h1>
            <h2 className="text-sm lg:text-base font-light text-gray-400 leading-tight group-hover:text-indigo-200 transition">Gestión de equipos de trabajo</h2>
          </a>
        </div>

        {/* 2. Navegación Central */}
        <div className="hidden lg:flex flex-grow justify-center px-4">
          {auth.isAuthenticated && (
            <div className="flex divide-x divide-indigo-700 bg-gray-800 rounded-lg overflow-hidden shadow">
              {(auth.role === "ADMIN" || auth.role === "DEMO") && (
                <>
                  <Link to="/" className="px-6 py-2.5 text-lg text-gray-200 hover:bg-indigo-600 hover:text-white font-semibold transition">Cuadrantes</Link>
                  <Link to="/schedules" className="px-6 py-2.5 text-lg text-gray-200 hover:bg-indigo-600 hover:text-white font-semibold transition">Mensual</Link>
                  <Link to="/admin" className="px-6 py-2.5 text-lg text-gray-200 hover:bg-indigo-600 hover:text-white font-semibold transition">Admin</Link>
                </>
              )}
              {auth.role === "USER" && (
                <>
                  <Link to="/schedules" className="px-6 py-2.5 text-lg text-gray-200 hover:bg-indigo-600 hover:text-white font-semibold transition">Mensual</Link>
                  <Link to="/revisar" className="px-6 py-2.5 text-lg text-gray-200 hover:bg-indigo-600 hover:text-white font-semibold transition">Fichajes</Link>
                </>
              )}
            </div>
          )}
        </div>

        {/* 3. Bloque Derecho */}
        <div className="flex items-center gap-4">
          {auth.isAuthenticated ? (
            <div className="relative flex items-center gap-3" ref={userMenuRef}>

              {/* Badge usuario — estilo integrado */}
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded transition-colors ${userMenuOpen ? 'bg-gray-700' : 'hover:bg-gray-800'
                  }`}
              >
                <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold bg-indigo-600 text-white">
                  {initials}
                </div>
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-base text-gray-200 font-bold whitespace-nowrap">
                    {auth.user?.name} {auth.user?.lastName}
                  </span>
                  {auth.companyName && (
                    <span className="text-xs text-indigo-400 whitespace-nowrap">
                      {auth.companyName}
                    </span>
                  )}
                </div>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${userMenuOpen ? 'rotate-180 text-gray-300' : 'text-gray-500'}`}
                  fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown */}
              {userMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl py-1 z-[60]">
                  <div className="px-4 py-2 border-b border-gray-700 mb-1">
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Sesión activa</p>
                    <p className="text-xs font-semibold text-indigo-300 truncate mt-0.5">
                      {auth.user?.email || auth.user?.dni}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors font-semibold"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M14 8v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-2" />
                      <path d="M9 12h12" /><path d="M18 9l3 3-3 3" />
                    </svg>
                    Cerrar sesión
                  </button>
                </div>
              )}

              {/* Hamburguesa */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 rounded text-indigo-400 hover:bg-gray-800 focus:outline-none"
              >
                <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  {menuOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  }
                </svg>
              </button>
            </div>
          ) : ((
            location.pathname === '/fichar' && (
              <Link to="/login" className="flex items-center gap-2 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 rounded transition">
                Acceso
              </Link>
            )))}
        </div>
      </div>

      {/* Menú móvil */}
      {auth.isAuthenticated && menuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-gray-900 border-t border-gray-800 shadow-lg px-6 py-4 space-y-4 z-50">
          <div className="flex flex-col gap-3">
            {(auth.role === "ADMIN" || auth.role === "DEMO") && (
              <>
                <Link to="/" className="text-gray-300 hover:text-indigo-400 transition font-medium" onClick={() => setMenuOpen(false)}>Cuadrantes</Link>
                <Link to="/schedules" className="text-gray-300 hover:text-indigo-400 transition font-medium" onClick={() => setMenuOpen(false)}>Mensual</Link>
                <Link to="/admin" className="text-gray-300 hover:text-indigo-400 transition font-medium" onClick={() => setMenuOpen(false)}>Admin</Link>
              </>
            )}
            {auth.role === "USER" && (
              <>
                <Link to="/schedules" className="text-gray-300 hover:text-indigo-400 transition font-medium" onClick={() => setMenuOpen(false)}>Mensual</Link>
                <Link to="/revisar" className="text-gray-300 hover:text-indigo-400 transition font-medium" onClick={() => setMenuOpen(false)}>Fichajes</Link>
              </>
            )}
          </div>
          <div className="mt-4 border-t border-gray-700 pt-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {initials}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm text-gray-200 font-bold truncate">
                  {auth.user?.name}
                </span>
                {auth.companyName && (
                  <span className="text-xs text-indigo-400 truncate">{auth.companyName}</span>
                )}
              </div>
            </div>
            <button
              onClick={() => { handleLogout(); setMenuOpen(false); }}
              className="flex-shrink-0 flex items-center gap-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded transition"
            >
              Log out
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 8v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-2" />
                <path d="M9 12h12" /><path d="M18 9l3 3-3 3" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};