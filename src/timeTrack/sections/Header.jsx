import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { saludo } from '../utilities/timeManagement';

// Componente para los enlaces de navegación
const NavLinks = ({ auth, onClick }) => (
  <>
    <Link to="/" className="nav-link" onClick={onClick}>Inicio</Link>
    {auth.role === 'ADMIN' && (
      <Link to="/usuarios" className="nav-link" onClick={onClick}>Empleados</Link>
    )}
    <Link to="/fichajes" className="nav-link" onClick={onClick}>Registros</Link>
    {auth.role === 'ADMIN' && (
      <Link to="/log" className="nav-link" onClick={onClick}>Notificaciones</Link>
    )}
  </>
);

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirigir a la página de login después de cerrar sesión
  };

  return (
    <header className="bg-[#f9fafb] border-b border-gray-200 shadow-sm mb-8 relative z-50">
      <nav className="flex items-center justify-between p-4 mx-6" aria-label="Global">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src="/Logo.svg" alt="Logo" className="h-10 w-auto" />
          <span className="text-xl font-bold text-indigo-700">TimeTrack</span>
        </Link>

        {/* Navegación principal (escritorio) */}
        {auth.isAuthenticated && (
          <div className="hidden lg:flex items-center gap-x-8">
            <NavLinks auth={auth} />
          </div>
        )}

        {/* Usuario y acciones (escritorio) */}
        <div className="hidden lg:flex items-center gap-x-4">
          {auth.isAuthenticated ? (
            <>
              <span className="text-sm text-gray-700 font-bold bg-gray-200 px-3 py-1 rounded">
                <strong>{saludo()},</strong> {auth.user?.name} {auth.user?.lastName}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-white bg-indigo-600 hover: bg-indigo-500 px-4 py-1.5 rounded transition"
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
              className="flex items-center gap-2 text-sm font-medium text-white bg-indigo-600 hover: bg-indigo-500 px-4 py-1.5 rounded transition"
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

        {/* Botón menú hamburguesa (móvil) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="inline-flex items-center justify-center p-2 text-indigo-700 rounded hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 lg:hidden"
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {/* Menú móvil */}
      {menuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-md px-6 py-4 space-y-4">
          {auth.isAuthenticated ? (
            <>
              <NavLinks auth={auth} onClick={() => setMenuOpen(false)} />
              <span className="block text-base text-gray-700 mt-2">{saludo()}, {auth.user?.name} {auth.user?.lastName}</span>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="block w-full text-left text-base font-medium text-indigo-700 hover:underline cursor-pointer mt-2"
              >
                Log out
              </button>
            </>
          ) : (
            <Link to="/login" className="block text-base font-medium text-indigo-700" onClick={() => setMenuOpen(false)}>Log in</Link>
          )}
        </div>
      )}

      {/* Estilos para los enlaces */}
      <style>{`
        .nav-link {
          @apply text-sm font-medium text-gray-700 hover:text-indigo-600 transition block lg:inline;
        }
      `}</style>
    </header>
  );
};