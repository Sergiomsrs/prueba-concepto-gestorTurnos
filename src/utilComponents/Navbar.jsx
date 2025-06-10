import { Link } from "react-router-dom";

import { useContext } from "react";
import { AuthContext } from "../timeTrack/context/AuthContext";
import { saludo } from '../timeTrack/utilities/timeManagement';

export const Navbar = () => {
const { auth, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirigir a la página de login después de cerrar sesión
  };

  return (
    <nav className="bg-gray-900 min-h-[4rem]"> {/* Ajusta la altura mínima según sea necesario */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between h-full"> {/* Usa h-full para ocupar la altura completa */}
          <div className="flex flex-wrap items-center space-x-2 sm:space-x-4">
            <Link to="/landing" className="text-gray-300 text-xs sm:text-sm md:text-lg hover:text-white px-2 py-1 sm:px-3 sm:py-2 font-medium">
              Home
            </Link>
            <Link to="/" className="text-gray-300 text-xs sm:text-sm md:text-lg hover:text-white px-2 py-1 sm:px-3 sm:py-2 font-medium">
              Create
            </Link>
            <Link to="/employeeweek" className="text-gray-300 text-xs sm:text-sm md:text-lg hover:text-white px-2 py-1 sm:px-3 sm:py-2 font-medium">
              WbyE
            </Link>
            <Link to="/adduser" className="text-gray-300 text-xs sm:text-sm md:text-lg hover:text-white px-2 py-1 sm:px-3 sm:py-2 font-medium">
             Add
            </Link>
            <Link to="/report" className="text-gray-300 text-xs sm:text-sm md:text-lg hover:text-white px-2 py-1 sm:px-3 sm:py-2 font-medium">
             Report
            </Link>
            <Link to="/fichar" className="text-gray-300 text-xs sm:text-sm md:text-lg hover:text-white px-2 py-1 sm:px-3 sm:py-2 font-medium">
             Fichar
            </Link>
            <Link to="/revisar" className="text-gray-300 text-xs sm:text-sm md:text-lg hover:text-white px-2 py-1 sm:px-3 sm:py-2 font-medium">
             Revisar
            </Link>
            <Link to="/login" className="text-gray-300 text-xs sm:text-sm md:text-lg hover:text-white px-2 py-1 sm:px-3 sm:py-2 font-medium">
             Login
            </Link>
            {/*<Link to="/adduser" className="text-gray-300 text-xs sm:text-sm md:text-base hover:text-white px-2 py-1 sm:px-3 sm:py-2 font-medium">
              AddUser
            </Link>*/}
          </div>
          <div className="flex flex-col items-center sm:items-end text-white px-2 sm:px-3 py-1 sm:py-2">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide text-center sm:text-left">WorkSchedFlow</h1>
            <h2 className="text-xs sm:text-sm md:text-base font-light text-gray-400 text-center sm:text-left">Gestión de equipos de trabajo</h2>
          </div>
        </div>
               <div className='w-1/4 flex justify-end'>
        <div className="hidden lg:flex items-center gap-x-4">
          {auth.isAuthenticated ? (
            <>
              <span className="text-sm text-gray-700 font-bold bg-gray-200 px-3 py-1 rounded">
                <strong>{saludo()},</strong> {auth.user?.name} {auth.user?.lastName} 
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 px-4 py-1.5 rounded transition"
              >
                Log out
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="stroke-current"
                >
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
              className="flex items-center gap-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 px-4 py-1.5 rounded transition"
            >
              Log in
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="stroke-current"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M15 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                <path d="M21 12h-13l3 -3" />
                <path d="M11 15l-3 -3" />
              </svg>
            </Link>

          )}
        </div>

      </div>
      </div>
    </nav>
  );
};

