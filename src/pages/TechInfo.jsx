import { LinkButton } from "../formComponents/LinkButton";
import { Projects } from "../formComponents/Projects";

export const TechInfo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-slate-800">
      {/* Contenido principal sin header duplicado */}
      <main className="max-w-7xl mx-auto px-6 pt-8 pb-16 space-y-16">
        {/* Hero mejorado - sin header redundante */}
        <section className="relative mt-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-3xl"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
                🏗️ Arquitectura y Base de Datos
              </h1>
              <p className="text-2xl text-slate-600 max-w-5xl mx-auto leading-relaxed">
                La aplicación gestiona horarios por{" "}
                <span className="font-semibold text-blue-600">franjas de 15 minutos</span>. El backend Spring Boot
                obtiene datos por intervalo de fechas y devuelve un arreglo estructurado que el frontend renderiza
                como una rejilla interactiva.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-8 text-center">
                <div className="text-4xl mb-4">⏱️</div>
                <h3 className="font-bold text-xl text-slate-800 mb-3">Intervalos</h3>
                <p className="text-lg text-slate-600">
                  Cada celda = 15 min
                  <br />
                  4 celdas = 1 hora
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-8 text-center">
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="font-bold text-xl text-slate-800 mb-3">Render</h3>
                <p className="text-lg text-slate-600">
                  Grid CSS responsivo
                  <br />
                  Columnas fijas optimizadas
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-8 text-center">
                <div className="text-4xl mb-4">🔄</div>
                <h3 className="font-bold text-xl text-slate-800 mb-3">Estado</h3>
                <p className="text-lg text-slate-600">
                  Sincronización en tiempo real
                  <br />
                  Cambios en batch
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
              <img
                src="./bdScheme.webp"
                alt="Esquema BD"
                className="w-full h-60 object-cover rounded-xl border border-slate-300 shadow-md"
              />
              <p className="mt-6 text-center text-lg text-slate-600 font-medium">
                Esquema simplificado de la base de datos y flujo de petición → respuesta
              </p>
            </div>
          </div>
        </section>

        {/* Modelo de datos con cards más grandes */}
        <section className="bg-white rounded-3xl shadow-xl border border-slate-100 p-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
              <span className="text-3xl text-white">🗄️</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-800">Modelo de Datos y Arquitectura</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-8">
              <p className="text-xl text-slate-700 leading-relaxed">
                La base de datos contiene las{" "}
                <span className="font-semibold text-blue-600">tablas principales</span> relacionadas con empleados,
                turnos y atributos temporales. La tabla 'Empleado' actúa como núcleo central del sistema.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-2xl">👤</span>
                  <div>
                    <h4 className="font-bold text-lg text-slate-800">Empleado</h4>
                    <p className="text-slate-600 text-base">Datos personales y atributos estáticos del trabajador</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-2xl">🕐</span>
                  <div>
                    <h4 className="font-bold text-lg text-slate-800">Turnos/Jornada</h4>
                    <p className="text-slate-600 text-base">Asignaciones temporales con período de validez</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-2xl">👥</span>
                  <div>
                    <h4 className="font-bold text-lg text-slate-800">Equipo</h4>
                    <p className="text-slate-600 text-base">Clasificación por grupos de trabajo</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-2xl">🏖️</span>
                  <div>
                    <h4 className="font-bold text-lg text-slate-800">Ausencias / PTO</h4>
                    <p className="text-slate-600 text-base">
                      Franjas inactivas que el frontend respeta automáticamente
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 border border-slate-200">
              <Projects
                title={"📊 Flujo de trabajo"}
                description={
                  "Petición entre fechas → Backend compone la vista diaria → Respuesta: arreglo de días con empleados y workShift (array de 62 slots)."
                }
                image={"DiagramaAppWebP.webp"}
              />
            </div>
          </div>
        </section>

        {/* Frontend con mejor estructura */}
        <section className="bg-white rounded-3xl shadow-xl border border-slate-100 p-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
              <span className="text-3xl text-white">⚛️</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-800">Frontend — Componentes Clave</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-8">
              <p className="text-xl text-slate-700 leading-relaxed">
                La UI está compuesta por{" "}
                <span className="font-semibold text-green-600">componentes reutilizables</span> optimizados para
                rendimiento y usabilidad.
              </p>

              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <h4 className="font-bold text-lg text-slate-800 mb-3">🏠 RosterPage</h4>
                  <p className="text-slate-700 text-base">Contenedor principal con lista de días y encabezados</p>
                </div>
                <div className="p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                  <h4 className="font-bold text-lg text-slate-800 mb-3">⏰ HeadRow</h4>
                  <p className="text-slate-700 text-base">Genera guías horarias y marca visualmente las horas</p>
                </div>
                <div className="p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                  <h4 className="font-bold text-lg text-slate-800 mb-3">👤 EmployeeRow</h4>
                  <p className="text-slate-700 text-base">Fila por empleado con celdas interactuables</p>
                </div>
                <div className="p-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                  <h4 className="font-bold text-lg text-slate-800 mb-3">📊 DistributionRow</h4>
                  <p className="text-slate-700 text-base">Resúmenes y métricas por día/rango</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
                <p className="text-slate-700 leading-relaxed text-base">
                  La rejilla usa{" "}
                  <span className="font-mono bg-slate-200 px-2 py-1 rounded">Tailwind CSS</span> y un grid con
                  columnas fijas. Las celdas se sincronizan con referencias para facilitar interacciones por teclado y
                  drag & drop.
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-8 border border-indigo-200">
                <h4 className="font-bold text-xl text-slate-800 mb-6 flex items-center gap-3">
                  <span>🎯</span> Interacciones Avanzadas
                </h4>
                <ul className="space-y-4 text-slate-700">
                  <li className="flex items-start gap-4">
                    <span className="text-indigo-500 text-xl">🖱️</span>
                    <span className="text-base">Drag-to-select para marcar múltiples franjas</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-indigo-500 text-xl">⚡</span>
                    <span className="text-base">Click/double-click para toggles rápidos</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-indigo-500 text-xl">⌨️</span>
                    <span className="text-base">Atajos de teclado y navegación accesible</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-indigo-500 text-xl">⚠️</span>
                    <span className="text-base">Gestión automática de conflictos y PTO</span>
                  </li>
                </ul>
              </div>

              <Projects
                title={"🔗 Petición a la Base de Datos"}
                description={
                  "Uso de JpaRepository en el backend para consultas por rango y generación de valores por defecto cuando falta información."
                }
                image={"query.webp"}
              />
            </div>
          </div>
        </section>

        {/* API y Estado con mejor diseño */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-xl border border-blue-100 p-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl">
              <span className="text-3xl text-white">🔄</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-800">Estado, Persistencia y API</h2>
          </div>

          <div className="bg-white/90 rounded-2xl p-8 border border-white/50">
            <p className="text-xl text-slate-700 mb-8 leading-relaxed">
              El frontend utiliza un hook central{" "}
              <code className="bg-blue-100 text-blue-800 px-3 py-2 rounded font-mono text-lg">useRoster</code> que
              expone toda la funcionalidad de gestión de estado:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-6 bg-blue-50 rounded-xl border border-blue-200">
                  <span className="text-2xl">📥</span>
                  <div>
                    <h4 className="font-bold text-lg text-slate-800">getRosterBetweenDates()</h4>
                    <p className="text-slate-600 text-base">Solicita datos al backend por rango de fechas</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-green-50 rounded-xl border border-green-200">
                  <span className="text-2xl">💾</span>
                  <div>
                    <h4 className="font-bold text-lg text-slate-800">saveData / modifiedData</h4>
                    <p className="text-slate-600 text-base">Envía cambios al servidor y mantiene estado local</p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-6 bg-purple-50 rounded-xl border border-purple-200">
                  <span className="text-2xl">📊</span>
                  <div>
                    <h4 className="font-bold text-lg text-slate-800">apiData</h4>
                    <p className="text-slate-600 text-base">Datos crudos sincronizados con la API</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-orange-50 rounded-xl border border-orange-200">
                  <span className="text-2xl">⏳</span>
                  <div>
                    <h4 className="font-bold text-lg text-slate-800">loading</h4>
                    <p className="text-slate-600 text-base">Indicador de carga y bloqueo de acciones</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-slate-100 rounded-xl border border-slate-200">
              <p className="text-slate-700 leading-relaxed text-base">
                💡 <strong>Optimización:</strong> Los cambios se acumulan en
                <code className="bg-slate-200 px-2 py-1 rounded font-mono mx-1">modifiedData</code> y se envían en
                batch al guardar, reduciendo el tráfico de red significativamente.
              </p>
            </div>
          </div>
        </section>

        {/* Performance mejorado */}
        <section className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl shadow-xl border border-emerald-100 p-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl">
              <span className="text-3xl text-white">⚡</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-800">Rendimiento y Optimizaciones</h2>
          </div>

          <div className="bg-white/90 rounded-2xl p-8 border border-white/50">
            <p className="text-xl text-slate-700 mb-8 leading-relaxed">
              🎯 Para mantener{" "}
              <span className="font-semibold text-emerald-600">alto rendimiento</span> con equipos grandes:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-200">
                  <h4 className="font-bold text-lg text-slate-800 mb-3 flex items-center gap-3">
                    <span>🗺️</span> Mapeos Precalculados
                  </h4>
                  <p className="text-slate-700 text-base">
                    Evita búsquedas O(n) con{" "}
                    <code className="font-mono">dayMapping.employeeMap</code>
                  </p>
                </div>
                <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                  <h4 className="font-bold text-lg text-slate-800 mb-3 flex items-center gap-3">
                    <span>🧠</span> Memoización Inteligente
                  </h4>
                  <p className="text-slate-700 text-base">
                    Usa <code className="font-mono">useMemo</code> y{" "}
                    <code className="font-mono">memo</code> en componentes pesados
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="p-6 bg-purple-50 rounded-xl border border-purple-200">
                  <h4 className="font-bold text-lg text-slate-800 mb-3 flex items-center gap-3">
                    <span>📐</span> Grid Optimizado
                  </h4>
                  <p className="text-slate-700 text-base">Columnas fijas reducen reflow y mejoran el scroll</p>
                </div>
                <div className="p-6 bg-orange-50 rounded-xl border border-orange-200">
                  <h4 className="font-bold text-lg text-slate-800 mb-3 flex items-center gap-3">
                    <span>🔗</span> Referencias Compartidas
                  </h4>
                  <p className="text-slate-700 text-base">
                    <code className="font-mono">inputRefsMatrix</code> evita relinks continuos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap con mejor diseño */}
        <section className="bg-white rounded-3xl shadow-xl border border-slate-100 p-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <span className="text-3xl text-white">🚀</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-800">Roadmap e Integraciones</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
                <h4 className="font-bold text-xl text-slate-800 mb-6 flex items-center gap-3">
                  <span>🎯</span> Próximas Funcionalidades
                </h4>
                <ul className="space-y-4 text-slate-700">
                  <li className="flex items-start gap-4">
                    <span className="text-purple-500 text-xl">📄</span>
                    <span className="text-base">Export a PDF con resúmenes detallados</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-purple-500 text-xl">📧</span>
                    <span className="text-base">Notificaciones automáticas por email</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-purple-500 text-xl">👤</span>
                    <span className="text-base">CRUD completo de empleados y equipos</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-purple-500 text-xl">📱</span>
                    <span className="text-base">Aplicación móvil nativa</span>
                  </li>
                </ul>
              </div>

              <div className="p-8 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-200">
                <h4 className="font-bold text-xl text-slate-800 mb-6 flex items-center gap-3">
                  <span>⚠️</span> Limitaciones Actuales
                </h4>
                <p className="text-slate-700 leading-relaxed text-base">
                  Sin virtualización de filas. Para equipos de{" "}
                  <span className="font-semibold">miles de empleados</span>, se está evaluando implementar viewport
                  virtualizado con{" "}
                  <code className="font-mono bg-slate-200 px-1 rounded">react-window</code>.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 border border-slate-200">
              <Projects
                title={"📊 Esquema de Respuesta"}
                description={
                  "La respuesta es un arreglo de días; cada día contiene empleados y cada empleado un array 'workShift' con estados por slot."
                }
                image={"timeIntervalScheme.webp"}
              />
            </div>
          </div>
        </section>

        {/* CTA final mejorado */}
        <section className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl shadow-2xl p-12 text-white">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6">🚀 ¿Listo para explorar el código?</h2>
            <p className="text-2xl text-blue-100 mb-10 max-w-3xl mx-auto">
              Accede a la demo interactiva o revisa el changelog para ver la evolución entre versiones
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <LinkButton
                to={"/"}
                className="text-lg px-8 py-2 bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
              >
                🎮 Abrir Demo
              </LinkButton>
              <a
                href="https://github.com/Sergiomsrs/prueba-concepto-gestorTurnos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg px-8 py-2 bg-gray-800 text-white hover:bg-gray-400 border border-blue-400 shadow-lg hover:shadow-xl transition-all inline-block rounded-lg"
              >
                📋 Accede al Código
              </a>

              <LinkButton
                to={"/info"}
                className="text-lg px-8 py-2 bg-purple-600 text-white hover:bg-purple-700 border border-purple-400 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
              >
                🏠 Volver Atrás
              </LinkButton>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center text-slate-500">
          © {new Date().getFullYear()} WorkSchedFlow — Documentación técnica completa
        </div>
      </footer>
    </div>
  );
};
