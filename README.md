# WorkSchedFlow - POC

## Descripción

**WorkSchedFlow** es una plataforma de planificación operativa de personal diseñada para empresas con turnos, campañas y alta variabilidad de demanda. No es una herramienta de consulta ni de control de horarios, sino un sistema de diseño estratégico de cuadrantes. Permite construir la planificación óptima de equipos en función de la demanda del negocio, los picos de actividad y los objetivos de cobertura. Su enfoque está en ayudar a tomar decisiones, no solo en visualizar información. A través de su entorno de planificación, facilita el equilibrio entre necesidad operativa, disponibilidad de empleados y presupuesto. Es una herramienta pensada para sentarse a diseñar, optimizar y ajustar la estructura de trabajo, no solo para revisarla.

👉 **Demo online:**  
[WorkSchedFlow – GitHub Pages](https://sergiomsrs.github.io/prueba-concepto-gestorTurnos/)

🎥 **Vídeo demostración:**  
[Ver demo en YouTube](https://youtu.be/RifYxP6gKqA)

![imagenApp](/public/general.webp)

---

## Estado del Proyecto

El proyecto se encuentra actualmente en **fase de despliegue** y cuenta con una **versión demo funcional** publicada en GitHub Pages.  
Además, dispone de una **API REST** que todavía no ha sido desplegada.

En paralelo, se está trabajando en el desarrollo de un **microservicio de inteligencia artificial**, basado en **LangChain y Ollama**, orientado a la automatización y optimización de la planificación de turnos.

---

## Características Principales

### Gestión y planificación
- Plataforma integral que unifica **gestión de empleados**, **cuadrantes horarios** y **control de fichajes**.
- Sistema totalmente automatizado: seleccionando un rango de fechas se generan los empleados activos, sus jornadas y los equipos de trabajo.
- Control preciso de jornadas y equipos, definiendo fechas de inicio y fin para cada asignación.

### Vista del empleado
- Vista personal por empleado con:
  - Horarios asignados
  - Ausencias y vacaciones
  - Registros de jornada
  - Notificaciones ante cualquier modificación

### Ausencias y disponibilidad
- Gestión completa de **ausencias, vacaciones y horas no disponibles**.
- Las ausencias se muestran señalizadas y quedan automáticamente excluidas de la planificación.

### Herramientas avanzadas de cuadrantes
- Creación de cuadrantes con:
  - Marcaje automático de descansos
  - Filtros por equipo o empleado
  - Vista diaria solo de empleados activos
  - Vistas globales o segmentadas por grupos
- Creación flexible de cuadrantes:
  - Desde cero
  - Copiando semanas anteriores
  - Aplicando turnos por defecto

### Plantillas y planificación modelo
- Configuración de **semanas genéricas** con empleados ficticios para planificaciones tipo.
- Asignación posterior de estas semanas a empleados reales.
- Hasta **6 semanas genéricas** disponibles.

### Control de jornada e inspección
- Control de registros de jornada con:
  - Alertas por ausencia en turno
  - Alertas por fichajes incorrectos
- Vista dedicada para inspección con:
  - Acceso completo a todos los registros
  - Descarga de informes en PDF
- Posibilidad de añadir o corregir fichajes, generando:
  - Notificaciones automáticas
  - Envío de correos tanto al gestor como al empleado

### Reportes y exportación
- Resumen automático por trabajador y totales del periodo seleccionado.
- Reporte mensual completo con:
  - Horas totales por empleado
  - Horas extra, nocturnas y festivas
  - Cálculo de costes según la lógica de negocio
- Impresión directa de cuadrantes en PDF, con una vista clara y lista para entregar.


