import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/landing" className="text-gray-300 text-lg hover:text-white px-3 py-2  font-medium">
              Home
            </Link>
            <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 text-lg font-medium">
              Create
            </Link>
            <Link to="/services" className="text-gray-300 hover:text-white px-3 py-2 text-lg font-medium">
              Services
            </Link>
          </div>
          <div className="flex items-center text-xl  text-white px-3 py-2  font-extrabold">
            <h1>App Gestión de Horarios</h1>
          </div>
        </div>
      </div>
    </nav>
  );
};

