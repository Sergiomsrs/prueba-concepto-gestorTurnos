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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-slate-100 text-slate-800 mt-16">
      <header className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="./logo-navegador.webp" alt="Logo" width="48" height="48" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold">WorkSchedFlow</h1>
              <p className="text-sm text-slate-500">Gestión profesional de turnos · v0.03</p>
            </div>
          </div>

          <nav className="flex items-center gap-3">
            <LinkButton to={"/daily"}>Demo previa</LinkButton>
            <LinkButton to={"/workschedflow-demo/"}>Versión clásica</LinkButton>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-16">
        {/* HERO */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white rounded-2xl shadow-md p-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight text-slate-900">
              Planifica turnos con precisión y rapidez
            </h2>
            <p className="mt-4 text-slate-600 text-lg">
              Interfaz optimizada para equipos grandes: vista por franjas de 15 minutos, reglas automáticas de descanso y herramientas
              para ahorrar tiempo en la programación diaria.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <LinkButton to={"/"}>Ir a la demo</LinkButton>
              <LinkButton to={"/techinfo"}>Detrás del desarrollo</LinkButton>
              <a
                className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-white border border-slate-200 text-slate-700 shadow-sm hover:bg-slate-50"
                href="#features"
              >
                Ver características
              </a>
            </div>

            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-600">
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

          <div className="order-first lg:order-last">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 shadow-inner">
              <img
                src="./general.webp"
                alt="Vista del área de trabajo"
                className="w-full rounded-md border border-slate-200"
              />
              <div className="mt-3 text-xs text-slate-500">Vista de ejemplo del área de trabajo</div>
            </div>
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

        {/* CALL TO ACTION FINAL */}
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

