import { Link } from 'react-router-dom'

export const Report = () => {
  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-2xl px-2 lg:max-w-7xl lg:px-8 mt-16">
        <h2 className="text-center text-2xl font-semibold text-indigo-600">WorkSchedFlow</h2>
        <p className="mx-auto mt-2 max-w-lg text-balance text-center text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl">
          Panel de Administración
        </p>
        <div className="mt-6 grid gap-8 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
          {/* Registro de Jornada */}
          <Link to="/fichar" className="relative group transition-transform hover:scale-105">
            <div className="absolute inset-px rounded-xl bg-white shadow-lg group-hover:shadow-2xl transition-shadow"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-xl">
              <div className="flex-1 flex flex-col items-center justify-center p-10">
                <img
                  className="w-36 h-36 object-contain rounded-full border-4 border-indigo-100 shadow mb-6 bg-gray-100 transition-all duration-200 group-hover:scale-110"
                  src="timetrack.webp"
                  alt="Registro de Jornada"
                />
                <h3 className="text-xl font-semibold text-indigo-700 mb-2 text-center">Registro de Jornada</h3>
                <p className="text-base text-gray-600 text-center">
                  Ficha tu jornada laboral de forma sencilla y rápida.
                </p>
              </div>
            </div>
          </Link>
          {/* Gestión Registros de Jornada */}
          <Link to="/revisar" className="relative group transition-transform hover:scale-105">
            <div className="absolute inset-px rounded-xl bg-white shadow-lg group-hover:shadow-2xl transition-shadow"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-xl">
              <div className="flex-1 flex flex-col items-center justify-center p-10">
                <img
                  className="w-36 h-36 object-cover rounded-full border-4 border-indigo-100 shadow mb-6 bg-gray-100 transition-all duration-200 group-hover:scale-110"
                  src="revision.webp"
                  alt="Gestión Registros"
                />
                <h3 className="text-xl font-semibold text-indigo-700 mb-2 text-center">Gestión Registros</h3>
                <p className="text-base text-gray-600 text-center">
                  Revisa y administra los registros de jornada de tu equipo.
                </p>
              </div>
            </div>
          </Link>
          {/* Añadir Usuario */}
          <Link to="/adduser" className="relative group transition-transform hover:scale-105">
            <div className="absolute inset-px rounded-xl bg-white shadow-lg group-hover:shadow-2xl transition-shadow"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-xl">
              <div className="flex-1 flex flex-col items-center justify-center p-10">
                <img
                  className="w-36 h-36 object-contain rounded-full border-4 border-indigo-100 shadow mb-6 bg-gray-100 transition-all duration-200 group-hover:scale-110"
                  src="usuarios.webp"
                  alt="Añadir Usuario"
                />
                <h3 className="text-xl font-semibold text-indigo-700 mb-2 text-center">Gestión Usuarios</h3>
                <p className="text-base text-gray-600 text-center">
                  Agrega nuevos usuarios y gestiona permisos fácilmente.
                </p>
              </div>
            </div>
          </Link>
           {/* Ver Ausencias */}
          <Link to="/loglist" className="relative group transition-transform hover:scale-105">
            <div className="absolute inset-px rounded-xl bg-white shadow-lg group-hover:shadow-2xl transition-shadow"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-xl">
              <div className="flex-1 flex flex-col items-center justify-center p-10">
                <img
                  className="w-36 h-36 object-contain rounded-full border-4 border-indigo-100 shadow mb-6 bg-gray-100 transition-all duration-200 group-hover:scale-110"
                  src="logList.webp"
                  alt="Añadir Usuario"
                />
                <h3 className="text-xl font-semibold text-indigo-700 mb-2 text-center">Revisar Ausencias</h3>
                <p className="text-base text-gray-600 text-center">
                  Revisa la lista con las últimas notificaciones de ausencias y fichajes no registrados.
                </p>
              </div>
            </div>
          </Link>
           {/* Ver Ausencias */}
          <Link to="/info" className="relative group transition-transform hover:scale-105">
            <div className="absolute inset-px rounded-xl bg-white shadow-lg group-hover:shadow-2xl transition-shadow"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-xl">
              <div className="flex-1 flex flex-col items-center justify-center p-10">
                <img
                  className="w-36 h-36 object-contain rounded-full border-4 border-indigo-100 shadow mb-6 bg-gray-100 transition-all duration-200 group-hover:scale-110"
                  src="info.webp"
                  alt="Añadir Usuario"
                />
                <h3 className="text-xl font-semibold text-indigo-700 mb-2 text-center">App Info</h3>
                <p className="text-base text-gray-600 text-center">
                  Informacion sobre la aplicación, sus características y tecnologías utilizadas.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
