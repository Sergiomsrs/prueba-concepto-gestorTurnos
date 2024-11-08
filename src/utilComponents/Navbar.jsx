import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="bg-gray-900 min-h-[4rem]"> {/* Ajusta la altura mínima según sea necesario */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between h-full"> {/* Usa h-full para ocupar la altura completa */}
          <div className="flex flex-wrap items-center space-x-2 sm:space-x-4">
            <Link to="/landing" className="text-gray-300 text-xs sm:text-sm md:text-base hover:text-white px-2 py-1 sm:px-3 sm:py-2 font-medium">
              Home
            </Link>
            <Link to="/" className="text-gray-300 text-xs sm:text-sm md:text-base hover:text-white px-2 py-1 sm:px-3 sm:py-2 font-medium">
              Create
            </Link>
            <Link to="/employeeweek" className="text-gray-300 text-xs sm:text-sm md:text-base hover:text-white px-2 py-1 sm:px-3 sm:py-2 font-medium">
              WbyE
            </Link>
            <Link to="/adduser" className="text-gray-300 text-xs sm:text-sm md:text-base hover:text-white px-2 py-1 sm:px-3 sm:py-2 font-medium">
             Add
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
      </div>
    </nav>
  );
};

