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
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-slate-100 text-slate-800 mt-16">
      <header className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="./logo-navegador.webp" alt="Logo" width="48" height="48" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold">WorkSchedFlow</h1>
              <p className="text-sm text-slate-500">Gestión profesional de turnos · v0.3</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-16">
        {/* HERO con timeline vertical integrado */}
        <section className="flex flex-col items-center text-center bg-white rounded-2xl shadow-md p-8 space-y-10 overflow-hidden">
          {/* Texto principal */}
          <div className="max-w-3xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight text-slate-900">
              Planifica turnos con precisión y rapidez
            </h2>
            <p className="mt-4 text-slate-600 text-lg">
              Interfaz optimizada para equipos grandes: vista por franjas de 15 minutos, reglas automáticas de descanso y herramientas
              para ahorrar tiempo en la programación diaria.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <LinkButton to={"/"}>Ir a la demo</LinkButton>
              <LinkButton to={"/techinfo"}>Detrás del desarrollo</LinkButton>
              <a
                className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-white border border-slate-200 text-slate-700 shadow-sm hover:bg-slate-50"
                href="https://sergiomsrs.github.io/wsf-landing/"
              >
                Ver características
              </a>
            </div>

            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-600 text-left">
              <li className="flex items-start gap-3">
                <span className="text-slate-400 mt-1">✅</span>
                Interfaz drag & click optimizada
              </li>
              <li className="flex items-start gap-3">
                <span className="text-slate-400 mt-1">✅</span>
                Control de descansos y PTO automático
              </li>
              <li className="flex items-start gap-3">
                <span className="text-slate-400 mt-1">✅</span>
                Resumen de horas y exportación
              </li>
              <li className="flex items-start gap-3">
                <span className="text-slate-400 mt-1">✅</span>
                Integración con APIs y persistencia
              </li>
            </ul>
          </div>

          {/* Imagen hero */}
          <div className="relative w-full max-w-5xl">
            <img
              src="./general.webp"
              alt="Vista del área de trabajo"
              className="w-full h-auto rounded-2xl border border-slate-200 shadow-md object-cover"
            />
            <div className="absolute bottom-3 left-4 bg-white/80 backdrop-blur-sm text-slate-800 px-3 py-1 rounded-md text-sm shadow-sm">
              Vista general de WorkSchedFlow
            </div>
          </div>

          {/* Timeline horizontal escalonado */}
          <div className="relative w-full max-w-5xl mt-8">
            {/* Línea base */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-200"></div>

            <div className="flex flex-wrap justify-between items-start gap-8">
              {versions.map((v, idx) => (
                <div
                  key={v.id}
                  className={`relative w-64 flex-shrink-0 ${idx % 2 === 0 ? "mt-0" : "mt-12"
                    }`}
                >
                  {/* Nodo central */}
                  <div className="absolute left-1/2 -translate-x-1/2 -top-5 w-5 h-5 rounded-full shadow ring-2 ring-white z-10"
                    style={{ backgroundColor: v.color }}>
                  </div>

                  {/* Línea de conexión */}
                  {idx !== versions.length - 1 && (
                    <div className="absolute top-[calc(50%-1px)] left-[calc(50%+1.25rem)] w-[calc(100%-2.5rem)] h-px bg-slate-200 z-0"></div>
                  )}

                  {/* Tarjeta */}
                  <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm relative z-10">
                    <div className="aspect-[16/9] rounded-lg overflow-hidden border border-slate-200 mb-3">
                      <img
                        src={v.img}
                        alt={v.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                      />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-semibold text-slate-800">{v.title}</div>
                      <div className="text-xs text-slate-500">{v.subtitle}</div>
                      <div className="text-sm text-slate-600 mt-1">{v.text}</div>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <LinkButton to={v.link} className="text-xs">Abrir</LinkButton>
                      <a href={v.more} className="text-xs text-slate-600 hover:text-slate-800">Más</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-slate-500 mt-6">
            Línea temporal — evolución del producto versión a versión.
          </div>
        </section>





        {/* BENEFICIOS / KPI */}
        <section id="features" className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h4 className="font-semibold text-slate-800">Escalabilidad</h4>
            <p className="mt-2 text-sm text-slate-600">Diseñado para manejar cientos de empleados con rendimiento estable.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h4 className="font-semibold text-slate-800">Precisión</h4>
            <p className="mt-2 text-sm text-slate-600">Intervalos de 15 minutos y reglas automáticas para evitar conflictos.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h4 className="font-semibold text-slate-800">Usabilidad</h4>
            <p className="mt-2 text-sm text-slate-600">Interfaz intuitiva con accesos rápidos y atajos de teclado ya integrados.</p>
          </div>
        </section>

        {/* GRID DE PROJECTS (uso de componente existente) */}
        <section className="mt-10">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">Explora la aplicación</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projectList.map((p) => (
              <Projects key={p.title} title={p.title} description={p.description} image={p.image} />
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section className="mt-12 bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-lg font-semibold">¿Listo para probarlo?</h4>
            <p className="text-sm text-slate-600">Accede a la demo y comienza a generar turnos en segundos.</p>
          </div>
          <div className="flex gap-3">
            <LinkButton to={"/"}>Ir a la demo</LinkButton>
            <LinkButton to={"/techinfo"}>Documentación técnica</LinkButton>
          </div>
        </section>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-8 text-sm text-slate-500">
        <div className="border-t border-slate-100 pt-6">
          © {new Date().getFullYear()} WorkSchedFlow — Diseñado por el autor. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};

