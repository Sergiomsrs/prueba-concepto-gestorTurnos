import React from 'react'
import { LinkButton } from '../landing/LinkButton'
import { Projects } from '../landing/Projects'

export const TechInfo = () => {
  return (
    <section className="px-40 pt-20 bg-gray-100">
      <div className="bg-gray-100">
        <main className="">
          <section className="">
            <h2 className="text-3xl font-bold mb-4">Base de datos y Conexión mediante Springboot</h2>
            <p className="text-lg text-gray-700 mb-6 text-pretty">
              La base de datos está compuesta por cuatro tablas principales. La tabla 'Empleado' actúa como la central, mientras que las otras tres tablas están vinculadas a ella mediante la clave foránea (FK) del ID de empleado.
            </p>
          </section>
        </main>

        <section className="mt-10">
          <Projects
            title={"Esquema de la Base de Datos"}
            description={"Cada uno de los tres atributos actuales en la base de datos (turno, jornada y equipo) cuenta con una fecha de inicio y de finalización. Esto permite realizar consultas precisas, obteniendo los datos correspondientes según el intervalo de tiempo solicitado."}
            image={"/bdScheme.webp"}
          />
          <Projects
            title={"Flujo de trabajo"}
            description={"El flujo de trabajo para la creación de horarios comienza con una solicitud a la API basada en dos fechas. A partir de esta petición, se obtienen los empleados activos y sus respectivos atributos dentro del rango de fechas especificado."}
            image={"/DiagramaAppWebP.webp"}
          />
          <Projects
            title={"Petición a la base de datos"}
            description={"Cuando la petición llega a la API, esta consulta toda la información necesaria en la base de datos. Se ha optado por utilizar JpaRepository para realizar la consulta, lo que permite gestionar fácilmente los casos en los que no haya datos y se deban generar valores por defecto."}
            image={"/query.webp"}
          />
          <Projects
            title={"Esquema de respuesta"}
            description={"La respuesta devuelta a la aplicación es un arreglo de días, el cual se renderiza mediante componentes de React para formar la vista de horarios que se presenta en la demo."}
            image={"/timeIntervalScheme.webp"}
          />

        </section>
      </div>
      <section className="mt-10">
        <h3 className="text-2xl font-semibold mb-4">Próximas Implementaciones</h3>
        <ul className="list-disc list-inside text-left text-lg text-gray-700">
          <li>Formulario de registro de empleados.</li>
          <li>CRUD completo para todos los atributos.</li>
          <li>Visión responsive para pantallas más pequeñas.</li>
          <li>Exportación a PDF de los horarios elaborados.</li>
          <li>Envío de email a cada empleado con el resumen de los turnos.</li>
          <li>Inhabilitación de casillas por disponibilidad, vacaciones u otras ausencias.</li>
        </ul>
      </section>
      <div className='pt-4'>
        <LinkButton to={"/landing"}>Volver</LinkButton>
      </div>
    </section>
  )
}
