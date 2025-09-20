import { Link } from 'react-router-dom'

export const AdminPage = () => {
  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-2xl px-2 lg:max-w-7xl lg:px-8 mt-16">
        <h2 className="text-center text-2xl font-semibold text-indigo-600">WorkSchedFlow</h2>
        <p className="mx-auto mt-2 max-w-lg text-balance text-center text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl">
          Panel de Administración
        </p>
        <div className="my-6 grid h-full gap-8 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
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
                  Marca tu entrada y salida de la jornada laboral de forma ágil y segura.
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
                  Supervisa, valida y corrige los registros de jornada de todos los empleados.
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
                  Añade nuevos empleados, edita sus datos y gestiona sus permisos de acceso.
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
                  Consulta las ausencias recientes y los fichajes pendientes de justificar.
                </p>
              </div>
            </div>
          </Link>

          {/* Ver Ausencias */}
          <Link to="/reports" className="relative group transition-transform hover:scale-105">
            <div className="absolute inset-px rounded-xl bg-white shadow-lg group-hover:shadow-2xl transition-shadow"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-xl">
              <div className="flex-1 flex flex-col items-center justify-center p-10">
                <img
                  className="w-36 h-36 object-contain rounded-full border-4 border-indigo-100 shadow mb-6 bg-gray-100 transition-all duration-200 group-hover:scale-110"
                  src="horarios.webp"
                  alt="Añadir Usuario"
                />
                <h3 className="text-xl font-semibold text-indigo-700 mb-2 text-center">Reportes</h3>
                <p className="text-base text-gray-600 text-center">
                  Visualiza los horarios asignados a cada empleado de manera clara y estructurada.
                </p>
              </div>
            </div>
          </Link>
          {/* Generar turnos */}
          <Link to="/generate" className="relative group transition-transform hover:scale-105">
            <div className="absolute inset-px rounded-xl bg-white shadow-lg group-hover:shadow-2xl transition-shadow"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-xl">
              <div className="flex-1 flex flex-col items-center justify-center p-10">
                <img
                  className="w-36 h-36 object-contain rounded-full border-4 border-indigo-100 shadow mb-6 bg-gray-100 transition-all duration-200 group-hover:scale-110"
                  src="genericShifts.webp"
                  alt="Añadir Usuario"
                />
                <h3 className="text-xl font-semibold text-indigo-700 mb-2 text-center">Generador de Turnos</h3>
                <p className="text-base text-gray-600 text-center">
                  Crea y asigna turnos genéricos de forma automática para optimizar la planificación.
                </p>
              </div>
            </div>
          </Link>
          <Link to="/generate-individual" className="relative group transition-transform hover:scale-105">
            <div className="absolute inset-px rounded-xl bg-white shadow-lg group-hover:shadow-2xl transition-shadow"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-xl">
              <div className="flex-1 flex flex-col items-center justify-center p-10">
                <img
                  className="w-36 h-36 object-contain rounded-full border-4 border-indigo-100 shadow mb-6 bg-gray-100 transition-all duration-200 group-hover:scale-110"
                  src="shiftform.webp"
                  alt="Añadir Usuario"
                />
                <h3 className="text-xl font-semibold text-indigo-700 mb-2 text-center">Introducir Turno</h3>
                <p className="text-base text-gray-600 text-center">
                  Añade turnos personalizados para empleados concretos de manera sencilla.
                </p>
              </div>
            </div>
          </Link>
          {/* Generar turnos */}
          <Link to="/setupweek" className="relative group transition-transform hover:scale-105">
            <div className="absolute inset-px rounded-xl bg-white shadow-lg group-hover:shadow-2xl transition-shadow"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-xl">
              <div className="flex-1 flex flex-col items-center justify-center p-10">
                <img
                  className="w-36 h-36 object-contain rounded-full border-4 border-indigo-100 shadow mb-6 bg-gray-100 transition-all duration-200 group-hover:scale-110"
                  src="setupweek.webp"
                  alt="Añadir Usuario"
                />
                <h3 className="text-xl font-semibold text-indigo-700 mb-2 text-center">Configurar Semana</h3>
                <p className="text-base text-gray-600 text-center">
                  Define la estructura semanal de turnos y ajusta la planificación según las necesidades del equipo.
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
                  Descubre las funcionalidades de la aplicación y la tecnología que la impulsa.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
