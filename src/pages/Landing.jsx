import { LinkButton } from "../formComponents/LinkButton";
import { Projects } from "../formComponents/Projects";

export const Landing = () => {
  const projectList = [
    {
      title: "Área de trabajo",
      description:
        "Cada franja de 15 min es intuitiva y permite añadir/quitar turnos con precisión. Visualiza duración y densidad de personal.",
      image: "general.webp",
    },
    {
      title: "Turnos deshabilitados",
      description:
        "Se desactivan franjas horarias automáticamente (p.ej. 12h descanso) y se resaltan claramente para evitar errores de planificación.",
      image: "disabledcheck.webp",
    },
    {
      title: "Control de filtros",
      description:
        "Filtra por fecha, equipo o empleado para centrar la vista. Ideal para gestionar grandes equipos con rapidez.",
      image: "control-filtros.webp",
    },
    {
      title: "Gestión de empleados",
      description:
        "Añade empleados, equipos, vacaciones y disponibilidades con formularios limpios y confirmaciones claras.",
      image: "gestion-usuarios.webp",
    },
    {
      title: "Resumen y pie de zona",
      description:
        "Resumen de horas trabajadas, diferencias con la base contratada y export/guardar cambios desde un panel claro.",
      image: "pie-zona-trabajo.webp",
    },
    {
      title: "Disponibilidad",
      description:
        "Gestiona ausencias y permisos: franjas inactivas marcadas en rojo y excluidas del cálculo automáticamente.",
      image: "control-disponibilidad.webp",
    },
  ];

  const versions = [
    {
      id: "v1",
      title: "Versión 1 — MVP",
      subtitle: "Inicial",
      img: "./version-v1.webp",
      text: "Funcionalidad básica para crear y ver turnos. Primer paso del producto.",
      link: "https://sergiomsrs.github.io/workschedflow-demo/#/workschedflow-demo/",
      more: "#",
      color: "bg-slate-700",
      gradient: "from-slate-600 to-slate-800",
    },
    {
      id: "v2",
      title: "Versión 2 — UX refinada",
      subtitle: "Mejoras UI",
      img: "./version-v2.webp",
      text: "Filtrado, rendimiento y refinamientos visuales orientados a usabilidad.",
      link: "/daily",
      more: "/changelog#v2",
      color: "bg-slate-500",
      gradient: "from-slate-400 to-slate-600",
    },
    {
      id: "v3",
      title: "Versión 3 — Actual",
      subtitle: "Actual",
      img: "./general.webp",
      text: "Interfaz optimizada para grandes equipos y herramientas avanzadas de planificación.",
      link: "/",
      more: "/changelog#v3",
      color: "bg-blue-600",
      gradient: "from-blue-500 to-blue-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-slate-800 overflow-x-hidden">
      {/* Contenido principal */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-8 pb-8 sm:pb-16 space-y-8 sm:space-y-16">
        {/* INTRODUCCIÓN - Optimizada para móvil */}
        <section className="mt-4 sm:mt-8">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl sm:rounded-2xl border border-indigo-100 p-4 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <div className="flex-shrink-0 p-2 sm:p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg sm:rounded-xl shadow-lg">
                <span className="text-xl sm:text-2xl text-white">💡</span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center gap-2">
                  ¿Qué es WorkSchedFlow?
                  <span className="inline-flex items-center px-2 sm:px-3 py-1 bg-indigo-100 text-indigo-700 text-xs sm:text-sm font-medium rounded-full w-fit">
                    Prueba de concepto
                  </span>
                </h2>
                <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
                  <span className="font-semibold text-indigo-600">WorkSchedFlow</span> es una prueba de concepto diseñada para facilitar la
                  <span className="font-medium"> gestión de turnos de trabajo</span>. Su objetivo principal es cubrir las necesidades de los
                  <span className="font-medium text-purple-600"> gestores de equipos</span>, brindando una herramienta que simplifica el diseño de horarios
                  mientras se asegura de cumplir con las <span className="font-medium">normativas laborales</span> y las expectativas de los empleados.
                </p>
                <div className="mt-4 grid grid-cols-1 gap-4">
                  <div className="flex items-start gap-3">
                    <span className="text-indigo-500 text-lg sm:text-xl flex-shrink-0">⚖️</span>
                    <div>
                      <h4 className="font-medium text-slate-800 text-sm sm:text-base">Cumplimiento legislativo</h4>
                      <p className="text-slate-600 text-xs sm:text-sm">Garantiza el respeto a las normativas laborales</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-purple-500 text-lg sm:text-xl flex-shrink-0">🎯</span>
                    <div>
                      <h4 className="font-medium text-slate-800 text-sm sm:text-base">Equilibrio empresa-empleado</h4>
                      <p className="text-slate-600 text-xs sm:text-sm">Balancea demandas corporativas y derechos laborales</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HERO mejorado para móvil */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-xl sm:rounded-3xl"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-3xl shadow-lg sm:shadow-2xl border border-white/50 p-6 sm:p-12">
            {/* Texto principal */}
            <div className="text-center max-w-5xl mx-auto mb-8 sm:mb-12">
              <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold leading-tight text-slate-900 mb-4 sm:mb-6">
                🎯 Planifica turnos con{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  precisión y rapidez
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 leading-relaxed max-w-4xl mx-auto">
                Interfaz optimizada para equipos grandes: vista por{" "}
                <span className="font-semibold text-blue-600">franjas de 15 minutos</span>,
                reglas automáticas de descanso y herramientas para ahorrar tiempo en la programación diaria.
              </p>

              <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-6">
                <LinkButton to={"/"} className="text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
                  🚀 Ir a la demo
                </LinkButton>
                <LinkButton to={"/techinfo"} className="text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
                  🔧 Detrás del desarrollo
                </LinkButton>
                <a
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-sm sm:text-base lg:text-lg font-medium bg-white border border-slate-200 text-slate-700 shadow-md hover:bg-slate-50 hover:shadow-lg transition-all"
                  href="https://sergiomsrs.github.io/wsf-landing/"
                >
                  ✨ Ver características
                </a>
              </div>

              {/* Características destacadas - Grid responsive */}
              <div className="mt-8 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-left">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <span className="text-2xl sm:text-3xl flex-shrink-0">🖱️</span>
                    <div>
                      <h4 className="font-bold text-base sm:text-lg text-slate-800">Drag & Click</h4>
                      <p className="text-slate-600 text-sm sm:text-base">Interfaz optimizada</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <span className="text-2xl sm:text-3xl flex-shrink-0">⏰</span>
                    <div>
                      <h4 className="font-bold text-base sm:text-lg text-slate-800">Control PTO</h4>
                      <p className="text-slate-600 text-sm sm:text-base">Descansos automáticos</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <span className="text-2xl sm:text-3xl flex-shrink-0">📊</span>
                    <div>
                      <h4 className="font-bold text-base sm:text-lg text-slate-800">Resúmenes</h4>
                      <p className="text-slate-600 text-sm sm:text-base">Horas y exportación</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <span className="text-2xl sm:text-3xl flex-shrink-0">🔗</span>
                    <div>
                      <h4 className="font-bold text-base sm:text-lg text-slate-800">APIs</h4>
                      <p className="text-slate-600 text-sm sm:text-base">Integración completa</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Imagen hero con overlay - Responsive */}
            <div className="relative mb-8 sm:mb-12">
              <div className="bg-gradient-to-r from-slate-100 to-slate-50 rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-slate-200">
                <img
                  src="./general.webp"
                  alt="Vista del área de trabajo"
                  className="w-full h-auto rounded-lg sm:rounded-xl shadow-lg border border-slate-300"
                />
                <div className="mt-4 sm:mt-6 text-center">
                  <span className="inline-flex items-center gap-2 bg-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-sm border border-slate-200 text-slate-700 font-medium text-sm sm:text-lg">
                    <span className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></span>
                    Vista general de WorkSchedFlow en acción
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline horizontal - Completamente responsive */}
            <div className="relative">
              <div className="text-center mb-6 sm:mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2 sm:mb-4">🚀 Evolución del Proyecto</h2>
                <p className="text-base sm:text-xl text-slate-600">Del MVP inicial hasta la versión actual — progreso continuo</p>
              </div>

              <div className="relative">
                {/* Línea base - Oculta en móvil */}
                <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-slate-200 via-blue-300 to-purple-400 rounded-full"></div>

                {/* Layout móvil vs desktop */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-between items-center sm:items-start gap-6 sm:gap-8 relative z-10">
                  {versions.map((v, idx) => (
                    <div
                      key={v.id}
                      className={`relative w-full max-w-sm sm:w-80 flex-shrink-0 transform hover:-translate-y-2 transition-all duration-300 ${
                        // Solo aplicar margin top alternado en desktop
                        idx % 2 === 0 ? "sm:mt-0" : "sm:mt-20"
                        }`}
                    >
                      {/* Nodo central - Ajustado para móvil */}
                      <div className={`absolute left-1/2 -translate-x-1/2 -top-4 sm:-top-8 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br ${v.gradient} rounded-full shadow-lg ring-2 sm:ring-4 ring-white z-20 border border-white sm:border-2`}>
                      </div>

                      {/* Tarjeta mejorada */}
                      <div className="bg-white border border-slate-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg sm:shadow-xl hover:shadow-2xl transition-all duration-300 relative z-10">
                        <div className="aspect-[16/10] rounded-lg sm:rounded-xl overflow-hidden border border-slate-200 mb-3 sm:mb-4 bg-slate-50">
                          <img
                            src={v.img}
                            alt={v.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          />
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                          <div className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-r ${v.gradient} text-white text-xs sm:text-sm font-medium rounded-full`}>
                            {v.id.toUpperCase()}
                          </div>

                          <div>
                            <h3 className="font-bold text-lg sm:text-xl text-slate-800">{v.title}</h3>
                            <p className="text-xs sm:text-sm text-slate-500 font-medium">{v.subtitle}</p>
                            <p className="text-slate-600 mt-2 sm:mt-3 leading-relaxed text-sm sm:text-base">{v.text}</p>
                          </div>

                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-3 sm:pt-4 gap-3 sm:gap-0">
                            {v.id === "v1" ? (
                              <a
                                href={v.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-400 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 w-full sm:w-auto"
                              >
                                🚀 Abrir
                              </a>
                            ) : (
                              <LinkButton to={v.link} className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm w-full sm:w-auto">
                                🚀 Abrir
                              </LinkButton>
                            )}
                            <a className="text-xs sm:text-sm text-slate-500 hover:text-blue-600 font-medium transition-colors text-center sm:text-right">
                              📋 Más info →
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center mt-8 sm:mt-12 text-slate-500 font-medium text-sm sm:text-lg">
                ✨ Línea temporal — cada versión representa un salto significativo en funcionalidad
              </div>
            </div>
          </div>
        </section>

        {/* BENEFICIOS - Grid completamente responsive */}
        <section id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all">
            <div className="text-4xl sm:text-5xl mb-4 sm:mb-6">📈</div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3 sm:mb-4">Escalabilidad</h3>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">Diseñado para manejar cientos de empleados con rendimiento estable y respuesta rápida.</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all">
            <div className="text-4xl sm:text-5xl mb-4 sm:mb-6">🎯</div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3 sm:mb-4">Precisión</h3>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">Intervalos de 15 minutos y reglas automáticas para evitar conflictos de programación.</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all">
            <div className="text-4xl sm:text-5xl mb-4 sm:mb-6">✨</div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3 sm:mb-4">Usabilidad</h3>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">Interfaz intuitiva con accesos rápidos y atajos de teclado integrados.</p>
          </div>
        </section>

        {/* GRID DE PROJECTS - Responsive completo */}
        <section>
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-4 sm:mb-6">🔍 Explora la aplicación</h2>
            <p className="text-lg sm:text-xl md:text-2xl text-slate-600">Descubre cada funcionalidad en detalle</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {projectList.map((p) => (
              <div key={p.title} className="transform hover:-translate-y-1 transition-transform duration-300">
                <Projects title={p.title} description={p.description} image={p.image} />
              </div>
            ))}
          </div>
        </section>

        {/* CTA final - Optimizado para móvil */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-3xl"></div>
          <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-3xl shadow-lg sm:shadow-2xl p-8 sm:p-16 text-white text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">🚀 ¿Listo para revolucionar tus turnos?</h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 mb-6 sm:mb-10 max-w-3xl mx-auto">
              Accede a la demo interactiva y comienza a generar horarios profesionales en segundos
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6">
              <LinkButton to={"/"} className="text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
                🎮 Probar Demo
              </LinkButton>
              <LinkButton to={"/techinfo"} className="text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white hover:bg-blue-700 border border-blue-400 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
                📖 Documentación
              </LinkButton>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

