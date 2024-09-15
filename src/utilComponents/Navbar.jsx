import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="bg-gray-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center">
          <Link to="/landing" className="text-gray-300 text-lg hover:text-white px-3 py-2 font-medium">
            Información
          </Link>
          <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 text-lg font-medium">
            Horarios
          </Link>
          <Link to="/employeeweek" className="text-gray-300 hover:text-white px-3 py-2 text-lg font-medium">
            Resumen Semanal
          </Link>
          {/*<Link to="/adduser" className="text-gray-300 hover:text-white px-3 py-2 text-lg font-medium">
            AddUser
          </Link>*/}
        </div>
        <div className="flex flex-col items-end text-white px-3 py-2">
          <h1 className="text-2xl font-bold tracking-wide">WorkSchedFlow</h1>
          <h2 className="text-sm font-light text-gray-400">Gestión de equipos de trabajo</h2>
        </div>
      </div>
    </div>
  </nav>
  );
};

