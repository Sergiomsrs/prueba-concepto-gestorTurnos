# WorkSchedFlow - POC

## 🚀 Descripción
**WorkSchedFlow** WorkSchedFlow es una plataforma de planificación operativa de personal diseñada para empresas con turnos, campañas y alta variabilidad de demanda. No es una herramienta de consulta ni de control de horarios, sino un sistema de diseño estratégico de cuadrantes. Permite construir la planificación óptima de equipos en función de la demanda del negocio, los picos de actividad y los objetivos de cobertura. Su enfoque está en ayudar a tomar decisiones, no solo en visualizar información. A través de su entorno de planificación, facilita el equilibrio entre necesidad operativa, disponibilidad de empleados y presupuesto. Es una herramienta pensada para sentarse a diseñar, optimizar y ajustar la estructura de trabajo, no solo para revisarla.

> [!IMPORTANT]
> **Aviso de Demo:** El servidor está alojado en la capa gratuita de Render. Si el sistema lleva más de 15 minutos inactivo, el servidor se "duerme". Al acceder por primera vez, puede tardar unos **3 minutos en responder** mientras se reactiva.

👉 **Demo online:** [WorkSchedFlow – Frontend en GitHub Pages](https://sergiomsrs.github.io/prueba-concepto-gestorTurnos/)  
🎥 **Vídeo demostración:** [Ver demo en YouTube](https://youtu.be/RifYxP6gKqA)  
📖 **Documentación:** [Guía de Uso Completa](https://sergiomsrs.github.io/wsf-landing/guia/)

![imagenApp](/public/general.webp)

---

## 🛠️ Estado del Proyecto
* **Frontend:** Desplegado y funcional en GitHub Pages.
* **Backend (API REST):** Desplegado en producción a través de Render.
* **Microservicio de IA:** En fase de desarrollo experimental utilizando **LangChain y Ollama** para la optimización automatizada de turnos.

---

## ✨ Características Principales

### 🧠 Inteligencia Artificial (Experimental)
* **Chat de Planificación:** Inserción de turnos mediante lenguaje natural (ej: *"Pon a Juan de 09:00 a 18:00 el próximo lunes"*).
* **Análisis de Cuadrantes:** Consultas inteligentes sobre el equilibrio de la carga de trabajo y cobertura de perfiles mediante IA.

### 📅 Gestión y Planificación Avanzada
* **Pizarra de Trabajo:** Interfaz interactiva con precisión de 15 minutos y soporte para teclado/ratón.
* **Turnos Genéricos:** Configuración de hasta 6 plantillas de semanas modelo para despliegues rápidos.
* **Validaciones Automáticas:** Control de descanso mínimo legal (12h) y detección de solapamientos o conflictos de disponibilidad.
* **Gestión de Ausencias:** Bloqueo automático de vacaciones y días no disponibles en la planificación.

### 👤 Vista del Empleado
* Portal personal para consulta de horarios, registros de jornada y notificaciones en tiempo real sobre cualquier modificación.

### 📋 Control de Jornada e Inspección
* **Sistema de Fichajes:** Registro de entrada/salida con alertas por ausencia o fichajes incorrectos.
* **Auditoría:** Vista de inspección para corregir registros con trazabilidad total y envío de notificaciones automáticas vía email.

### 📊 Reportes y Exportación
* Generación de reportes mensuales: horas totales, extra, nocturnas y festivas.
* **Cálculo de Costes:** Estimación automática según la lógica de negocio configurada.
* **Exportación:** Impresión directa de cuadrantes y reportes de inspección en **PDF**.

---

## 💻 Tecnologías Utilizadas
* **Frontend:** React, Tailwind CSS.
* **Backend:** Node.js / Express (API REST).
* **Base de Datos:** PostgreSQL / MongoDB (según configuración).
* **IA:** LangChain, Ollama.
* **Despliegue:** GitHub Pages (UI) y Render (Server).