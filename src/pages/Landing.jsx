
import { LinkButton } from "../landing/LinkButton"
import { Projects } from "../landing/Projects"


export const Landing = () => {
  return (
    <section className="px-40 bg-gray-100">
      <div className="bg-gray-100">
        <section class="pt-24 pb-10">
          <img
            class="rounded-full size-16 mb-4"
            src="/sergio.webp"
            alt="sergio photo"
          />
          <h1
            class="text-gray-900 dark:text-white text-3xl md:text-4xl lg:text-5xl font-bold flex flex-row gap-x-4 pb-6 lg:pb-10"
          >
            Hola! mi nombre es Sergio
          </h1>
          <h2
            class="text-xl lg:text-2xl text-balance max-w-[700px] text-black dark:text-white"
          >
            <span>Estudiante de DAM. </span>
            <span class="text-yellow-800">
              Conocimientos de Frontend utilizando React, así como de Backend con
              Java y Spring Boot
            </span>
            .<span class="text-red-800"> De Murcia, España. </span>
            <span class="text-sky-800"
            >Siempre explorando diferentes tecnologías y lenguajes.</span
            >
          </h2>
        </section>
      </div>
      <div className="bg-gray-100">
        <main className="">
          <section className="">
            <h2 className="text-3xl font-bold mb-4">Sobre WorkSchedFlow</h2>
            <p className="text-lg text-gray-700 mb-6 text-pretty">
              WorkSchedFlow es una prueba de concepto diseñada para facilitar la gestión de turnos de trabajo.
              Su objetivo principal es cubrir las necesidades de los gestores de equipos,
              brindando una herramienta que simplifica el diseño de horarios mientras se asegura de cumplir con las normativas laborales y
              las expectativas de los empleados. La aplicación ofrece una interfaz intuitiva para gestionar los turnos, permitiendo a los
              responsables asegurar el cumplimiento legislativo y la optimización de los recursos, garantizando al mismo tiempo un equilibrio
              entre las demandas de la empresa y los derechos de los trabajadores.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Está diseñada utilizando tecnologías modernas como React para el frontend y Spring Boot en el backend,
              con persistencia de datos en una base de datos MySQL.
            </p>
            <p className="text-lg text-gray-700 mb-6 text-pretty">
              Además, en la pestaña "Horarios" podrás acceder a una versión demo de la aplicación, donde podrás experimentar su funcionamiento con datos simulados.
              Esto te permitirá explorar cómo gestiona y visualiza los turnos, ayudándote a comprender las ventajas que ofrece en situaciones reales.
            </p>
          </section>
          <section className="mt-10">
            <h3 className="text-2xl font-semibold mb-4">Características Principales</h3>
            <ul className="list-disc list-inside text-left text-lg text-gray-700">
              <li>Interfaz moderna y fácil de usar, creada con React y Tailwind CSS.</li>
              <li>Generación de turnos personalizados y cálculo automático de la duración.</li>
              <li>Línea temporal intuitiva y fácil de visualizar.</li>
              <li>Cálculo del número de empleados por hora.</li>
              <li>Filtrado de trabajadores por equipo de trabajo.</li>
              <li>Casillas desactivadas cuando no se cumplan 12 horas de descanso entre turnos de trabajo.</li>
              <li>Resumen final de horas trabajadas y variación con la base contratada.</li>
              <li>Visualización optimizada de turnos laborales con datos en formato HH:mm.</li>
              <li>Integración con APIs para obtener y gestionar datos de turnos.</li>
              <li>Persistencia de datos eficiente con MySQL y Spring Boot.</li>
            </ul>
          </section>
        </main>



        <section className="mt-10">
          <h3 className="text-2xl font-semibold mb-4">Conoce la App: Versión Demo</h3>
        <section className="flex justify-start gap-4 mb-4">
          <LinkButton to={"/"}>Ir a la Demo</LinkButton>
          <LinkButton to={"/techinfo"}>Detrás del Desarrollo</LinkButton>
        </section>
          <Projects
            title={"Barra de Navegación"}
            description={"Desde la barra de navegación, podrás acceder a la información de la aplicación, una versión de demostración, y la vista de resumen por empleado."}
            image={"/navbar.webp"}
          />
          <Projects
            title={"Área de trabajo"}
            description={"Esta es el área de trabajo propuesta, donde cada franja horaria representa un intervalo de 15 minutos. Los turnos pueden añadirse y eliminarse con facilidad, y puedes visualizar de manera intuitiva la duración de cada turno y el número de empleados por franja horaria."}
            image={"/general.webp"}
          />
          <Projects
            title={"Control de turnos desactivados"}
            description={"Ciertos turnos pueden ser desactivados para garantizar el cumplimiento de las restricciones aplicables. Esto se realiza desactivando las franjas horarias correspondientes, como se ilustra en el siguiente ejemplo. Las franjas horarias que no están disponibles se muestran desactivadas y quedan inhabilitadas para selección. Por ejemplo, las franjas horarias se desactivan automáticamente hasta que se hayan cumplido 12 horas desde la salida del turno de trabajo del día anterior."}
            image={"/disabledcheck.webp"}
          />
          <Projects
            title={"Control de filtros"}
            description={"En el encabezado del área de trabajo, se encuentran dos filtros clave: el primero permite seleccionar un rango de fechas para ajustar la visualización según el intervalo deseado, ofreciendo flexibilidad en la gestión del tiempo. El segundo filtro facilita la visualización del personal por equipo de trabajo, simplificando la organización y gestión en grandes equipos."}
            image={"/filtrado.webp"}
          />
          <Projects
            title={"Pie de zona de trabajo"}
            description={"En el pie de zona, se ofrece la opción de guardar o resetear el área de trabajo, además de proporcionar un resumen detallado del intervalo de tiempo seleccionado. Se puede visualizar una imagen clara de las jornadas de los trabajadores, incluyendo sus horas totales, la diferencia entre las horas trabajadas y contratadas, así como un desglose visual de las horas trabajadas por día."}
            image={"/resumen.webp"}
          />
          <Projects
            title={"Resumen de turnos por empleado"}
            description={"En la pestaña Resumen de Turnos por Empleado encontrarás un listado detallado de turnos en formato horario. Esta sección detecta automáticamente los turnos partidos y ofrece una vista clara e intuitiva para los empleados."}
            image={"/resumenSemanal.webp"}
          />
        </section>
      </div>
      <section className="mt-10">
        <h3 className="text-2xl font-semibold mb-4">Sobre el Desarrollador</h3>
        <p className="text-lg text-gray-700 mb-6">
        Hola, soy el creador de WorkSchedFlow. Mi pasión por la programación y el desarrollo web me ha llevado a crear esta prueba de concepto para simplificar la gestión de horarios en el entorno laboral a la vez que me permite practicar con tecnologías como React, Spring Boot, y MySQL. Estoy comprometido en seguir mejorando para desarrollar soluciones que hagan el día a día más eficiente.
        </p>
      </section>
    </section>
  )
}

