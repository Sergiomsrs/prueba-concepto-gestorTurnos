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
      more: "/changelog#v1",
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
      img: "./version-v3.webp",
      text: "Interfaz optimizada para grandes equipos y herramientas avanzadas de planificación.",
      link: "/",
      more: "/changelog#v3",
      color: "bg-blue-600",
      gradient: "from-blue-500 to-blue-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-slate-800">
      {/* Contenido principal sin header duplicado */}
      <main className="max-w-7xl mx-auto px-6 pt-8 pb-16 space-y-16">

        {/* INTRODUCCIÓN - Nueva sección */}
        <section className="mt-8">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-lg">
                <span className="text-2xl text-white">💡</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  ¿Qué es WorkSchedFlow?
                  <span className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full">
                    Prueba de concepto
                  </span>
                </h2>
                <p className="text-lg text-slate-700 leading-relaxed">
                  <span className="font-semibold text-indigo-600">WorkSchedFlow</span> es una prueba de concepto diseñada para facilitar la
                  <span className="font-medium"> gestión de turnos de trabajo</span>. Su objetivo principal es cubrir las necesidades de los
                  <span className="font-medium text-purple-600"> gestores de equipos</span>, brindando una herramienta que simplifica el diseño de horarios
                  mientras se asegura de cumplir con las <span className="font-medium">normativas laborales</span> y las expectativas de los empleados.
                </p>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <span className="text-indigo-500 text-xl">⚖️</span>
                    <div>
                      <h4 className="font-medium text-slate-800">Cumplimiento legislativo</h4>
                      <p className="text-slate-600 text-sm">Garantiza el respeto a las normativas laborales</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-purple-500 text-xl">🎯</span>
                    <div>
                      <h4 className="font-medium text-slate-800">Equilibrio empresa-empleado</h4>
                      <p className="text-slate-600 text-sm">Balancea demandas corporativas y derechos laborales</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HERO mejorado - sin header redundante */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-12">
            {/* Texto principal */}
            <div className="text-center max-w-5xl mx-auto mb-12">
              <h1 className="text-5xl sm:text-6xl font-bold leading-tight text-slate-900 mb-6">
                🎯 Planifica turnos con{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  precisión y rapidez
                </span>
              </h1>
              <p className="text-2xl text-slate-600 leading-relaxed max-w-4xl mx-auto">
                Interfaz optimizada para equipos grandes: vista por{" "}
                <span className="font-semibold text-blue-600">franjas de 15 minutos</span>,
                reglas automáticas de descanso y herramientas para ahorrar tiempo en la programación diaria.
              </p>

              <div className="mt-10 flex flex-wrap justify-center gap-6">
                <LinkButton to={"/"} className="text-lg px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
                  🚀 Ir a la demo
                </LinkButton>
                <LinkButton to={"/techinfo"} className="text-lg px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
                  🔧 Detrás del desarrollo
                </LinkButton>
                <a
                  className="inline-flex items-center px-8 py-4 rounded-lg text-lg font-medium bg-white border border-slate-200 text-slate-700 shadow-md hover:bg-slate-50 hover:shadow-lg transition-all"
                  href="https://sergiomsrs.github.io/wsf-landing/"
                >
                  ✨ Ver características
                </a>
              </div>

              {/* Características destacadas */}
              <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">🖱️</span>
                    <div>
                      <h4 className="font-bold text-lg text-slate-800">Drag & Click</h4>
                      <p className="text-slate-600">Interfaz optimizada</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">⏰</span>
                    <div>
                      <h4 className="font-bold text-lg text-slate-800">Control PTO</h4>
                      <p className="text-slate-600">Descansos automáticos</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">📊</span>
                    <div>
                      <h4 className="font-bold text-lg text-slate-800">Resúmenes</h4>
                      <p className="text-slate-600">Horas y exportación</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">🔗</span>
                    <div>
                      <h4 className="font-bold text-lg text-slate-800">APIs</h4>
                      <p className="text-slate-600">Integración completa</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Imagen hero con overlay */}
            <div className="relative mb-12">
              <div className="bg-gradient-to-r from-slate-100 to-slate-50 rounded-2xl p-6 border border-slate-200">
                <img
                  src="./general.webp"
                  alt="Vista del área de trabajo"
                  className="w-full h-auto rounded-xl shadow-lg border border-slate-300"
                />
                <div className="mt-6 text-center">
                  <span className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-lg shadow-sm border border-slate-200 text-slate-700 font-medium text-lg">
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                    Vista general de WorkSchedFlow en acción
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline horizontal mejorado */}
            <div className="relative">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-800 mb-4">🚀 Evolución del Producto</h2>
                <p className="text-xl text-slate-600">Del MVP inicial hasta la versión actual — progreso continuo</p>
              </div>

              <div className="relative">
                {/* Línea base con gradiente */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-slate-200 via-blue-300 to-purple-400 rounded-full"></div>

                <div className="flex flex-wrap justify-between items-start gap-8 relative z-10">
                  {versions.map((v, idx) => (
                    <div
                      key={v.id}
                      className={`relative w-80 flex-shrink-0 transform hover:-translate-y-2 transition-all duration-300 ${idx % 2 === 0 ? "mt-0" : "mt-20"
                        }`}
                    >
                      {/* Nodo central mejorado */}
                      <div className={`absolute left-1/2 -translate-x-1/2 -top-8 w-8 h-8 bg-gradient-to-br ${v.gradient} rounded-full shadow-lg ring-4 ring-white z-20 border-2 border-white`}>
                      </div>

                      {/* Tarjeta mejorada */}
                      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 relative z-10">
                        <div className="aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 mb-4 bg-slate-50">
                          <img
                            src={v.img}
                            alt={v.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          />
                        </div>

                        <div className="space-y-4">
                          <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${v.gradient} text-white text-sm font-medium rounded-full`}>
                            {v.id.toUpperCase()}
                          </div>

                          <div>
                            <h3 className="font-bold text-xl text-slate-800">{v.title}</h3>
                            <p className="text-sm text-slate-500 font-medium">{v.subtitle}</p>
                            <p className="text-slate-600 mt-3 leading-relaxed">{v.text}</p>
                          </div>

                          <div className="flex justify-between items-center pt-4">
                            <LinkButton to={v.link} className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                              🚀 Abrir
                            </LinkButton>
                            <a href={v.more} className="text-sm text-slate-500 hover:text-blue-600 font-medium transition-colors">
                              📋 Más info →
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center mt-12 text-slate-500 font-medium text-lg">
                ✨ Línea temporal — cada versión representa un salto significativo en funcionalidad
              </div>
            </div>
          </div>
        </section>

        {/* BENEFICIOS mejorados */}
        <section id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
            <div className="text-5xl mb-6">📈</div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Escalabilidad</h3>
            <p className="text-lg text-slate-600 leading-relaxed">Diseñado para manejar cientos de empleados con rendimiento estable y respuesta rápida.</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
            <div className="text-5xl mb-6">🎯</div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Precisión</h3>
            <p className="text-lg text-slate-600 leading-relaxed">Intervalos de 15 minutos y reglas automáticas para evitar conflictos de programación.</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
            <div className="text-5xl mb-6">✨</div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Usabilidad</h3>
            <p className="text-lg text-slate-600 leading-relaxed">Interfaz intuitiva con accesos rápidos y atajos de teclado integrados.</p>
          </div>
        </section>

        {/* GRID DE PROJECTS mejorado */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-800 mb-6">🔍 Explora la aplicación</h2>
            <p className="text-2xl text-slate-600">Descubre cada funcionalidad en detalle</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projectList.map((p) => (
              <div key={p.title} className="transform hover:-translate-y-1 transition-transform duration-300">
                <Projects title={p.title} description={p.description} image={p.image} />
              </div>
            ))}
          </div>
        </section>

        {/* CTA final mejorado */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl"></div>
          <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl shadow-2xl p-16 text-white text-center">
            <h2 className="text-4xl font-bold mb-6">🚀 ¿Listo para revolucionar tus turnos?</h2>
            <p className="text-2xl text-blue-100 mb-10 max-w-3xl mx-auto">
              Accede a la demo interactiva y comienza a generar horarios profesionales en segundos
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <LinkButton to={"/"} className="text-lg px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
                🎮 Probar Demo
              </LinkButton>
              <LinkButton to={"/techinfo"} className="text-lg px-8 py-4 bg-blue-600 text-white hover:bg-blue-700 border border-blue-400 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
                📖 Documentación
              </LinkButton>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

