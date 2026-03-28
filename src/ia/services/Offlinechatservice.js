

// ─────────────────────────────────────────────────────────────
// NORMALIZACIÓN
// ─────────────────────────────────────────────────────────────
const normalize = (str) =>
    str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, ' ');

// ─────────────────────────────────────────────────────────────
// SINÓNIMOS (puedes ampliar esto con el tiempo)
// ─────────────────────────────────────────────────────────────
const SYNONYMS = {
    turno: ['turno', 'turnos', 'horario', 'shift'],
    cuadrante: ['cuadrante', 'roster', 'planificacion'],
    fichar: ['fichar', 'fichaje', 'marcar', 'registro'],
    usuario: ['usuario', 'empleado', 'trabajador'],
    ausencia: ['ausencia', 'vacaciones', 'falta'],
    reporte: ['reporte', 'informe', 'resumen'],
};

// Expande keywords con sinónimos
const expandKeywords = (keywords) =>
    keywords.flatMap((kw) => SYNONYMS[kw] || [kw]);

// ─────────────────────────────────────────────────────────────
// MATCH FLEXIBLE
// ─────────────────────────────────────────────────────────────
const wordMatches = (text, kw) => {
    const t = normalize(text);
    const k = normalize(kw);

    if (t.includes(k)) return true;

    if (k.length >= 4) {
        return t.split(/\s+/).some((word) => word.startsWith(k));
    }

    return false;
};

// ─────────────────────────────────────────────────────────────
// SCORING (CLAVE PARA QUE NO SEA TERCO)
// ─────────────────────────────────────────────────────────────
const scoreEntry = (text, keywords) => {
    let score = 0;
    const expanded = expandKeywords(keywords);

    for (const kw of expanded) {
        if (wordMatches(text, kw)) {
            score += 2;
        } else {
            const t = normalize(text);
            const k = normalize(kw);

            if (k.length >= 4 && t.includes(k.slice(0, 4))) {
                score += 1;
            }
        }
    }

    return score;
};

// ─────────────────────────────────────────────────────────────
// MEMORIA DE CONTEXTO
// ─────────────────────────────────────────────────────────────
let lastTopic = null;

// ─────────────────────────────────────────────────────────────
// SERVICIO PRINCIPAL
// ─────────────────────────────────────────────────────────────
export const offlineChatService = {
    getAnswer(userMessage) {
        let bestScore = 0;
        let bestEntry = null;

        for (const entry of KB) {
            const score = scoreEntry(userMessage, entry.keys);

            if (score > bestScore) {
                bestScore = score;
                bestEntry = entry;
            }
        }

        // Si hay coincidencia
        if (bestEntry && bestScore > 0) {
            lastTopic = bestEntry.keys;

            const answer =
                typeof bestEntry.answer === 'function'
                    ? bestEntry.answer(userMessage)
                    : bestEntry.answer;

            // DEBUG (puedes quitarlo luego)
            console.log('USER:', userMessage);
            console.log('MATCH:', bestScore, bestEntry.keys);

            return answer;
        }

        // Fallback con contexto
        if (lastTopic) {
            return 'No estoy seguro 🤔\n\n¿Te refieres a lo anterior? Puedo explicarlo mejor si quieres.';
        }

        return FALLBACK;
    },
};










const KB = [

    // ── Saludos ───────────────────────────────────────────────────────────────
    {
        keys: ['buenos dias'],
        answer: '¡Buenos días! ¿Tienes alguna duda sobre WorkSchedFlow? Puedo ayudarte con cuadrantes, turnos, fichajes, usuarios y más.',
    },
    {
        keys: ['buenas tardes'],
        answer: '¡Buenas tardes! ¿En qué puedo ayudarte hoy con WorkSchedFlow?',
    },
    {
        keys: ['buenas noches'],
        answer: '¡Buenas noches! Aquí estoy si tienes alguna duda sobre la app.',
    },
    {
        keys: ['buenas'],
        answer: '¡Buenas! Soy el asistente de WorkSchedFlow. ¿En qué puedo ayudarte?\n\nSi no sabes por dónde empezar, prueba a preguntarme "¿qué puedes hacer?" y te cuento.',
    },
    {
        keys: ['hola'],
        answer: '¡Hola! 👋 Soy el asistente de WorkSchedFlow.\n\nPuedo ayudarte con dudas sobre cómo usar la app. Por ejemplo puedes preguntarme:\n\n• "¿Cómo creo un cuadrante?"\n• "¿Qué significa una celda roja?"\n• "¿Cómo ficha un empleado?"\n• "¿Cómo añado un turno individual?"\n\n¿Por dónde empezamos?',
    },

    // ── Quién eres / qué puedes hacer ────────────────────────────────────────
    {
        keys: ['quien eres'],
        answer: 'Soy el asistente de WorkSchedFlow 🤖\n\nEstoy aquí para ayudarte a entender cómo funciona la aplicación. Conozco todo sobre:\n\n• La Roster Page y los cuadrantes\n• Turnos genéricos e individuales\n• Fichajes y control horario\n• Gestión de usuarios y ausencias\n• Reportes de horas\n\n¿Qué necesitas saber?',
    },
    {
        keys: ['que puedes'],
        answer: 'Puedo responder preguntas sobre cómo usar WorkSchedFlow. Por ejemplo:\n\n💬 "¿Cómo hago un cuadrante?"\n💬 "¿Qué son los turnos genéricos?"\n💬 "¿Por qué aparecen celdas en rojo?"\n💬 "¿Cómo corrijo un fichaje?"\n💬 "¿Cómo añado un empleado?"\n💬 "¿Cómo genero un reporte de horas?"\n\nPregúntame lo que necesites.',
    },
    {
        keys: ['que sabes'],
        answer: 'Conozco en detalle todas las funcionalidades de WorkSchedFlow:\n\n• Roster Page y elaboración de cuadrantes\n• Turnos genéricos y turnos individuales\n• Control de descanso de 12 horas\n• Fichajes y corrección de registros\n• Gestión de usuarios, jornadas y ausencias\n• Reportes de horas y costes\n\n¿Sobre qué quieres saber más?',
    },
    {
        keys: ['como funciona'],
        answer: 'WorkSchedFlow gira en torno a la **Roster Page**, tu pizarra principal de planificación:\n\n1. Seleccionas un rango de fechas\n2. El sistema carga automáticamente los empleados activos\n3. Asignas turnos haciendo clic o arrastrando en las celdas\n4. Guardas los cambios con el botón de guardar\n\nTambién puedes usar turnos genéricos para planificar semanas completas de golpe. ¿Quieres que te explique alguna parte en detalle?',
    },
    {
        keys: ['por donde empiezo'],
        answer: 'Te recomiendo empezar por aquí:\n\n1️⃣ Crea los empleados desde el Panel de Administración → Gestión de Usuarios\n2️⃣ Abre la Roster Page y selecciona un rango de fechas\n3️⃣ Asigna turnos haciendo clic en las celdas de cada empleado\n4️⃣ Guarda con el botón de guardar\n\nSi quieres planificar semanas enteras rápido, pregúntame por los turnos genéricos.',
    },
    {
        keys: ['como empiezo'],
        answer: 'Lo primero es crear tus empleados desde el Panel de Administración. Después ya puedes abrir la Roster Page, seleccionar fechas y empezar a asignar turnos.\n\n¿Quieres que te explique alguno de esos pasos?',
    },
    {
        keys: ['no entiendo'],
        answer: '¡Sin problema, te oriento! 😊\n\nCuéntame qué estás intentando hacer y te explico paso a paso. Por ejemplo:\n\n• ¿Quieres crear el horario de tu equipo?\n• ¿Necesitas corregir un fichaje?\n• ¿Quieres añadir un empleado nuevo?\n\nTambién tienes la guía completa en:\nhttps://sergiomsrs.github.io/wsf-landing/guia/',
    },
    {
        keys: ['estoy perdido'],
        answer: 'Tranquilo, te ayudo a orientarte 😊\n\nWorkSchedFlow tiene tres áreas principales:\n\n📋 **Cuadrantes** — diseña los horarios de tu equipo en la Roster Page\n⏱️ **Fichajes** — controla entradas y salidas de los empleados\n👥 **Usuarios** — gestiona empleados, jornadas y ausencias\n\n¿Por cuál empezamos?',
    },
    {
        keys: ['ayuda'],
        answer: '¡Aquí estoy para ayudarte! 🤖\n\nPuedes preguntarme sobre cualquier funcionalidad de WorkSchedFlow. Algunos ejemplos:\n\n• "¿Cómo creo un cuadrante?"\n• "¿Qué son las celdas rojas?"\n• "¿Cómo gestiono las ausencias?"\n• "¿Cómo genero un reporte?"\n\nO consulta la guía completa en:\nhttps://sergiomsrs.github.io/wsf-landing/guia/',
    },

    // ── Agradecimientos y respuestas cortas ───────────────────────────────────
    {
        keys: ['muchas gracias'],
        answer: '¡Con mucho gusto! 😊 Si tienes más dudas sobre WorkSchedFlow aquí estoy.',
    },
    {
        keys: ['gracias'],
        answer: '¡De nada! 😊 Si tienes más dudas sobre WorkSchedFlow aquí estoy.\n\nRecuerda que también tienes la guía completa en:\nhttps://sergiomsrs.github.io/wsf-landing/guia/',
    },
    {
        keys: ['perfecto'],
        answer: '¡Genial! ¿Hay algo más en lo que pueda ayudarte?',
    },
    {
        keys: ['entendido'],
        answer: '¡Perfecto! ¿Necesitas saber algo más sobre la app?',
    },
    {
        keys: ['ok'],
        answer: '👍 ¿Hay algo más que quieras saber sobre WorkSchedFlow?',
    },
    {
        keys: ['vale'],
        answer: '¡Entendido! ¿Necesitas ayuda con algo más?',
    },

    // ── Preguntas existenciales / off-topic ───────────────────────────────────
    {
        keys: ['como estas'],
        answer: '¡Estoy aquí y listo para ayudarte! 🤖\n\nSoy un asistente especializado en WorkSchedFlow, así que lo mío son los cuadrantes, turnos y fichajes. ¿En qué puedo ayudarte?',
    },
    {
        keys: ['que tal'],
        answer: '¡Todo bien por aquí! ¿Tienes alguna duda sobre WorkSchedFlow?',
    },
    {
        keys: ['eres humano'],
        answer: 'No, soy un asistente automatizado integrado en WorkSchedFlow 🤖\n\nNo soy humano, pero conozco la app a fondo. Si tienes dudas sobre cómo funciona, pregúntame sin miedo.',
    },
    {
        keys: ['eres una ia'],
        answer: 'Sí, soy el asistente virtual de WorkSchedFlow. Estoy especializado en ayudarte a usar la aplicación. ¿Qué necesitas saber?',
    },
    {
        keys: ['eres un bot'],
        answer: 'Sí, soy un asistente automatizado 🤖 Estoy aquí para ayudarte con cualquier duda sobre WorkSchedFlow.',
    },
    {
        keys: ['adios'],
        answer: '¡Hasta luego! 👋 Si en algún momento tienes dudas sobre WorkSchedFlow, aquí estaré.',
    },
    {
        keys: ['hasta luego'],
        answer: '¡Hasta luego! 👋 Que vaya bien el turno.',
    },
    {
        keys: ['chao'],
        answer: '¡Chao! 👋 Cuando necesites ayuda con la app, aquí estoy.',
    },
    {
        keys: ['bye'],
        answer: '¡Bye! 👋 Cualquier duda sobre WorkSchedFlow, ya sabes dónde encontrarme.',
    },

    // ── Qué es la app ─────────────────────────────────────────────────────────
    {
        keys: ['que es', 'workschedflow'],
        answer: 'WorkSchedFlow es una herramienta de gestión de turnos de trabajo diseñada para gestores de equipos. Permite:\n\n• Crear y gestionar cuadrantes horarios\n• Controlar fichajes y jornadas\n• Gestionar empleados, ausencias y disponibilidad\n• Generar reportes de horas trabajadas\n• Integración con IA para insertar turnos por lenguaje natural',
    },
    {
        keys: ['para que sirve'],
        answer: 'WorkSchedFlow sirve para gestionar todo lo relacionado con los turnos de tu equipo: diseñar cuadrantes, controlar fichajes, gestionar ausencias y generar reportes de horas. Todo en una sola plataforma.',
    },

    // ── Roster / Cuadrantes ───────────────────────────────────────────────────
    {
        keys: ['roster'],
        answer: 'La Roster Page es la pizarra principal de planificación. Desde aquí puedes:\n\n• Ver todos los empleados activos en el periodo seleccionado\n• Asignar turnos haciendo clic o arrastrando en las celdas\n• Usar el teclado (barra espaciadora + Shift + flechas)\n• Ver el total de horas por empleado y por día\n• Filtrar por equipo o por nombre de empleado\n• Exportar e imprimir el cuadrante en PDF',
    },
    {
        keys: ['cuadrante'],
        answer: 'Los cuadrantes se elaboran desde la Roster Page. El proceso es:\n\n1. Selecciona el rango de fechas en la cabecera\n2. El sistema carga automáticamente los empleados activos\n3. Haz clic en las celdas para asignar turnos (o arrastra para rangos)\n4. Guarda con el botón de guardar\n\nTambién puedes generar cuadrantes completos usando turnos genéricos. ¿Quieres saber más sobre alguna de las dos formas?',
    },
    {
        keys: ['insertar', 'turno', 'celda'],
        answer: 'Puedes insertar turnos en la pizarra de dos formas:\n\n🖱️ Ratón: haz clic en una celda para marcarla, o clic y arrastra para completar un rango.\n\n⌨️ Teclado: navega con las flechas, marca con la barra espaciadora. Mantén Shift + flechas para seleccionar varias celdas a la vez.',
    },
    {
        keys: ['filtro'],
        answer: 'La Roster Page tiene varios filtros:\n\n• Por equipo: muestra solo los empleados del equipo seleccionado\n• Por nombre: muestra únicamente la línea del empleado buscado\n• Empleados activos: clic en el icono del reloj para ver solo los que trabajan ese día\n• Resetear: botón para quitar todos los filtros de golpe',
    },
    {
        keys: ['imprimir'],
        answer: 'Para imprimir el cuadrante o exportarlo a PDF:\n\n1. Selecciona el periodo de fechas\n2. Haz clic en el botón de Imprimir en la cabecera\n3. Se abrirá una vista optimizada para papel\n4. Desde ahí puedes guardar como PDF o imprimir directamente',
    },
    {
        keys: ['exportar', 'pdf'],
        answer: 'Puedes exportar a PDF tanto los cuadrantes (desde el botón Imprimir de la Roster Page) como los registros de fichajes (desde la sección de revisión de fichajes). Ambas vistas están optimizadas para papel.',
    },
    {
        keys: ['resumen', 'periodo'],
        answer: 'Al final de la Roster Page encontrarás el resumen del periodo con:\n\n• Horas de jornada que debe realizar cada empleado\n• Horas efectivamente trabajadas\n• Varianza (diferencia entre lo planificado y lo real)\n• Gráfica visual con los días trabajados\n• Totales globales del periodo',
    },

    // ── Descanso 12h ──────────────────────────────────────────────────────────
    {
        keys: ['12', 'descanso'],
        answer: 'WorkSchedFlow controla automáticamente el descanso mínimo de 12 horas entre turnos:\n\n• Las franjas que incumplen el descanso aparecen sombreadas en rojo\n• Esas celdas están bloqueadas y no permiten asignar turnos\n• Es un control automático que garantiza el cumplimiento de la normativa laboral',
    },
    {
        keys: ['rojo', 'bloqueado'],
        answer: 'Las celdas en rojo indican que ese empleado no puede trabajar en esa franja. Los motivos pueden ser:\n\n• No han transcurrido 12 horas desde su último turno (descanso mínimo legal)\n• El empleado tiene vacaciones o ausencia registrada ese día\n• Tiene una franja de no disponibilidad configurada',
    },
    {
        keys: ['amarillo', 'parpadeo', 'conflicto'],
        answer: 'Las celdas en amarillo parpadeante indican un conflicto: el empleado tiene un turno asignado pero coincide con una ausencia o periodo de no disponibilidad. Debes resolverlo manualmente decidiendo si quitar el turno o la ausencia.',
    },

    // ── Distribución por franja ───────────────────────────────────────────────
    {
        keys: ['personas', 'franja', 'distribucion'],
        answer: 'En la última fila de cada día puedes ver la distribución de empleados por franja horaria. Haz clic en "Personas" para alternar entre dos modos:\n\n1. Modo total: muestra todos los empleados activos en cada franja\n2. Modo equipo: muestra solo los del equipo que tienes filtrado',
    },

    // ── Turnos genéricos ──────────────────────────────────────────────────────
    {
        keys: ['turno', 'generico'],
        answer: 'Los turnos genéricos permiten diseñar semanas modelo con empleados ficticios y luego asignarlos a empleados reales:\n\n1. Selecciona una de las 6 semanas genéricas disponibles\n2. Diseña la planificación con empleados ficticios\n3. Asigna qué empleado real realizará cada turno\n4. Selecciona la fecha concreta y aplica la semana\n5. La Roster Page cargará el cuadrante y marcará los conflictos en amarillo',
    },
    {
        keys: ['semana', 'generica'],
        answer: 'El sistema admite hasta 6 semanas genéricas diferentes. Cada una puede tener hasta 50 turnos activos configurados. Son plantillas reutilizables que puedes aplicar a cualquier semana del año asignando los empleados reales en el momento.',
    },

    // ── Formulario turno individual ───────────────────────────────────────────
    {
        keys: ['formulario', 'turno'],
        answer: 'Para insertar un turno individual desde el formulario (sección "Introducir Turno"):\n\n1. Selecciona el empleado\n2. Elige la fecha\n3. Define hora de inicio y fin (en intervalos de 15 minutos)\n4. El sistema calcula la duración automáticamente\n5. Guarda — el formulario se limpia solo si todo es correcto\n\n⚠️ No se permiten turnos solapados para el mismo empleado.',
    },
    {
        keys: ['solapamiento'],
        answer: 'El sistema no permite registrar dos turnos que se solapen para el mismo empleado. Si intentas hacerlo, recibirás un mensaje de error y el turno no se guardará.',
    },

    // ── Fichajes ──────────────────────────────────────────────────────────────
    {
        keys: ['fichar'],
        answer: 'Los empleados fichan desde la vista Time Track usando su DNI y contraseña. El sistema:\n\n• Registra automáticamente si es entrada o salida según el contexto\n• No es necesario seleccionar manualmente el tipo\n• Confirma visualmente el fichaje al momento\n• Comprueba cada 30 minutos si hay fichajes que faltan\n• Envía emails de alerta si detecta ausencias o fichajes incorrectos',
    },
    {
        keys: ['fichaje'],
        answer: 'Los fichajes se registran desde la vista Time Track con DNI y contraseña. El sistema detecta automáticamente si es una entrada o una salida según el turno.\n\nSi necesitas corregir un fichaje, los gestores pueden hacerlo desde la sección Gestión de Registros. ¿Quieres saber cómo?',
    },
    {
        keys: ['corregir', 'registro'],
        answer: 'Para corregir un fichaje ve a Gestión de Registros:\n\n• Puedes insertar fichajes de entrada o salida manualmente\n• Corregir horarios ya registrados\n• El sistema notifica al empleado y al gestor por email\n• Todas las modificaciones quedan registradas para trazabilidad\n• Se puede exportar el historial en PDF',
    },
    {
        keys: ['ausencia', 'falta', 'incidencia'],
        answer: 'El sistema detecta automáticamente las ausencias:\n\n• Comprueba cada 30 minutos si los empleados han fichado según su turno\n• Detecta entradas y salidas que faltan\n• Envía emails de alerta automáticos\n• Las ausencias registradas se tienen en cuenta para no generar falsos avisos',
    },

    // ── Gestión de usuarios ───────────────────────────────────────────────────
    {
        keys: ['crear', 'usuario'],
        answer: 'Para crear un nuevo usuario ve a Gestión de Usuarios en el panel de administración:\n\n1. Rellena el formulario con los datos del empleado\n2. Asigna el rol: Administrador o Usuario\n3. Selecciona el empleado vinculado desde el desplegable\n4. Guarda — el sistema validará los datos y confirmará la creación',
    },
    {
        keys: ['rol', 'administrador', 'permiso'],
        answer: 'WorkSchedFlow tiene dos roles:\n\n👤 Usuario (empleado): solo puede ver su propia información — turnos, fichajes, vacaciones y notificaciones.\n\n🔧 Administrador: acceso completo a todas las funcionalidades — cuadrantes, gestión de usuarios, reportes, fichajes de todos los empleados, etc.',
    },
    {
        keys: ['jornada', 'horas semanales'],
        answer: 'Desde Gestión de Usuarios puedes configurar la jornada laboral de cada empleado:\n\n• Define las horas semanales y la fecha de inicio\n• El historial de jornadas anteriores se conserva, no se sobreescribe\n• También puedes asignar y cambiar el equipo de trabajo con control de fechas',
    },
    {
        keys: ['vacacion'],
        answer: 'Para registrar vacaciones o indisponibilidades ve a Gestión de Usuarios y selecciona el empleado:\n\n• Ausencias: indica fecha de inicio, fin y motivo\n• Indisponibilidad parcial: define la franja horaria en que no puede trabajar\n• Estas fechas quedarán marcadas en la pizarra y excluidas de la planificación automáticamente',
    },

    // ── Vista empleado ────────────────────────────────────────────────────────
    {
        keys: ['vista', 'empleado'],
        answer: 'La Vista de Empleado es la interfaz que ve cada trabajador al entrar con su cuenta. Desde ahí puede consultar:\n\n• Sus turnos y horarios asignados\n• Historial de fichajes\n• Vacaciones planificadas\n• Ausencias y justificantes\n• Todo organizado por fechas y periodos',
    },

    // ── Reportes ──────────────────────────────────────────────────────────────
    {
        keys: ['reporte'],
        answer: 'La sección de Reportes permite analizar las horas del equipo en un periodo:\n\n• Selecciona fecha de inicio y fin\n• Métricas globales: horas totales, horas extra, complementarias\n• Detalle por empleado: horas planificadas vs trabajadas\n• Desglose de horas festivas y nocturnas\n• Preparado para cálculo de costes según lógica de negocio',
    },
    {
        keys: ['horas extra'],
        answer: 'En la sección de Reportes puedes ver el desglose de horas por empleado incluyendo horas base, horas extra, complementarias, festivas y nocturnas. Selecciona el periodo que quieras analizar y el sistema lo calcula automáticamente.',
    },

    // ── IA / Chat ─────────────────────────────────────────────────────────────
    {
        keys: ['ia', 'inteligencia artificial'],
        answer: 'WorkSchedFlow tiene dos funciones de IA integradas (experimentales):\n\n🤖 Chat de planificación: inserta turnos escribiendo en lenguaje natural, por ejemplo: "Añade un turno a María el 15/04 de 08:00 a 16:00".\n\n📊 Análisis de cuadrantes: pregúntale cosas como "¿Cuántos empleados cierran el lunes?" o "¿Está equilibrada la planificación esta semana?"',
    },

    // ── Guía ──────────────────────────────────────────────────────────────────
    {
        keys: ['guia'],
        answer: '📖 Puedes consultar la guía completa de WorkSchedFlow aquí:\nhttps://sergiomsrs.github.io/wsf-landing/guia/\n\nCubre todas las secciones: cuadrantes, turnos, fichajes, usuarios, reportes e IA.',
    },
    {
        keys: ['manual'],
        answer: '📖 La documentación completa está disponible en:\nhttps://sergiomsrs.github.io/wsf-landing/guia/',
    },

    // ── Desarrollador ─────────────────────────────────────────────────────────
    {
        keys: ['quien', 'desarrollo'],
        answer: 'WorkSchedFlow ha sido desarrollado por Sergio Méndez Soler.\n\nPuedes contactar con él o ver su perfil profesional en:\nhttps://www.linkedin.com/in/sergio-mendez-soler-03902aa5/',
    },
    {
        keys: ['quien', 'hizo'],
        answer: 'WorkSchedFlow fue creado por Sergio Méndez Soler.\n\nSi tienes alguna pregunta sobre el proyecto puedes encontrarle en LinkedIn:\nhttps://www.linkedin.com/in/sergio-mendez-soler-03902aa5/',
    },
    {
        keys: ['desarrollador'],
        answer: 'El desarrollador de WorkSchedFlow es Sergio Méndez Soler.\n\n🔗 https://www.linkedin.com/in/sergio-mendez-soler-03902aa5/',
    },
    {
        keys: ['autor'],
        answer: 'WorkSchedFlow ha sido diseñado y desarrollado por Sergio Méndez Soler.\n\nPuedes ver su perfil y ponerte en contacto en LinkedIn:\nhttps://www.linkedin.com/in/sergio-mendez-soler-03902aa5/',
    },
    {
        keys: ['contacto'],
        answer: 'Puedes contactar con el desarrollador a través de LinkedIn:\nhttps://www.linkedin.com/in/sergio-mendez-soler-03902aa5/\n\nDesde ahí puedes hacer cualquier consulta sobre el proyecto o solicitar acceso con API real.',
    },
    {
        keys: ['linkedin'],
        answer: 'Aquí tienes el perfil de LinkedIn del desarrollador:\nhttps://www.linkedin.com/in/sergio-mendez-soler-03902aa5/',
    },
    {
        keys: ['sergio'],
        answer: 'Sergio Méndez Soler es el desarrollador de WorkSchedFlow.\n\nPuedes ver su perfil profesional y contactar con él en:\nhttps://www.linkedin.com/in/sergio-mendez-soler-03902aa5/',
    },

    // ── Estado del proyecto ───────────────────────────────────────────────────
    {
        keys: ['version final'],
        answer: 'WorkSchedFlow está actualmente en estado de pruebas y no es una versión final. Es una prueba de concepto funcional que sigue en desarrollo.\n\nSi tienes sugerencias o quieres saber más sobre el proyecto, puedes contactar con el desarrollador en LinkedIn:\nhttps://www.linkedin.com/in/sergio-mendez-soler-03902aa5/',
    },
    {
        keys: ['estado', 'proyecto'],
        answer: 'WorkSchedFlow se encuentra actualmente en fase de pruebas. Es una prueba de concepto funcional, no una versión final de producto.\n\nPara más información sobre el roadmap o el estado del desarrollo, contacta con el desarrollador:\nhttps://www.linkedin.com/in/sergio-mendez-soler-03902aa5/',
    },
    {
        keys: ['prueba', 'beta'],
        answer: 'Sí, WorkSchedFlow está en fase de pruebas. El modo demo permite explorar todas las vistas e interactuar con la pizarra sin necesidad de cuenta.\n\nSi quieres una prueba real con acceso completo a la API, puedes solicitarlo escribiendo al desarrollador en LinkedIn:\nhttps://www.linkedin.com/in/sergio-mendez-soler-03902aa5/',
    },
    {
        keys: ['funciona', 'real', 'cuenta'],
        answer: 'El sistema es completamente funcional como prueba de concepto. El modo demo te permite explorar todas las vistas e interactuar con la pizarra.\n\nPara una prueba real con acceso a la API completa, contacta con el desarrollador en LinkedIn:\nhttps://www.linkedin.com/in/sergio-mendez-soler-03902aa5/',
    },
    {
        keys: ['produccion'],
        answer: 'WorkSchedFlow está actualmente en fase de pruebas, no en producción como producto final.\n\nSi te interesa una versión con acceso real a la API, puedes solicitarlo contactando con el desarrollador:\nhttps://www.linkedin.com/in/sergio-mendez-soler-03902aa5/',
    },

    // ── Modo demo ─────────────────────────────────────────────────────────────
    {
        keys: ['demo'],
        answer: 'El modo demo de WorkSchedFlow te permite:\n\n✅ Explorar todas las vistas de la aplicación\n✅ Interactuar con la pizarra de planificación\n✅ Ver cómo funciona el sistema sin necesidad de cuenta\n\nSi quieres una prueba real con acceso completo a la API, escribe al desarrollador en LinkedIn:\nhttps://www.linkedin.com/in/sergio-mendez-soler-03902aa5/',
    },
    {
        keys: ['probar', 'aplicacion'],
        answer: 'Puedes explorar WorkSchedFlow ahora mismo en modo demo — te permite ver todas las vistas e interactuar con la pizarra sin necesidad de registrarte.\n\nSi quieres una prueba completa con la API real, contacta con el desarrollador en LinkedIn:\nhttps://www.linkedin.com/in/sergio-mendez-soler-03902aa5/',
    },
    {
        keys: ['acceso, accedo'],
        answer: 'El modo demo está disponible para explorar la app libremente.\n\nSi necesitas acceso completo con la API real para una prueba en condiciones, puedes solicitarlo escribiendo al desarrollador en LinkedIn:\nhttps://www.linkedin.com/in/sergio-mendez-soler-03902aa5/',
    },
    {
        keys: ['cuenta', 'registrar'],
        answer: 'Para el modo demo no necesitas cuenta — puedes explorar la app directamente.\n\nSi quieres un acceso real con tu propio entorno y datos, contacta con el desarrollador en LinkedIn para solicitarlo:\nhttps://www.linkedin.com/in/sergio-mendez-soler-03902aa5/',
    },

    // ── Preguntas técnicas ────────────────────────────────────────────────────
    {
        keys: ['tecnologia', 'stack'],
        answer: 'Para detalles técnicos sobre el stack o la arquitectura de WorkSchedFlow, lo mejor es contactar directamente con el desarrollador en LinkedIn:\nhttps://www.linkedin.com/in/sergio-mendez-soler-03902aa5/',
    },
    {
        keys: ['codigo', 'repositorio'],
        answer: 'Para consultas sobre el código o el repositorio del proyecto, contacta con el desarrollador en LinkedIn:\nhttps://www.linkedin.com/in/sergio-mendez-soler-03902aa5/',
    },
    {
        keys: ['api', 'integracion'],
        answer: 'Para consultas sobre la API o posibles integraciones con WorkSchedFlow, contacta con el desarrollador en LinkedIn:\nhttps://www.linkedin.com/in/sergio-mendez-soler-03902aa5/',
    },
    {
        keys: ['precio', 'coste', 'licencia'],
        answer: 'WorkSchedFlow está actualmente en fase de pruebas. Para cualquier consulta sobre condiciones de uso o licenciamiento, contacta con el desarrollador en LinkedIn:\nhttps://www.linkedin.com/in/sergio-mendez-soler-03902aa5/',
    },
    {
        keys: ['bug', 'error', 'fallo'],
        answer: 'Si has encontrado un error o algo no funciona como esperas, puedes reportarlo directamente al desarrollador en LinkedIn:\nhttps://www.linkedin.com/in/sergio-mendez-soler-03902aa5/\n\nTu feedback es muy valioso para mejorar el sistema.',
    },
    {
        keys: ['sugerencia', 'mejora', 'propuesta'],
        answer: 'Las sugerencias son bienvenidas 😊 Puedes enviarlas al desarrollador directamente en LinkedIn:\nhttps://www.linkedin.com/in/sergio-mendez-soler-03902aa5/',
    },
];

const FALLBACK =
    'No tengo una respuesta para eso 🤔\n\nPuedes consultar la guía completa en:\nhttps://sergiomsrs.github.io/wsf-landing/guia/\n\nAlgunos temas sobre los que sí puedo ayudarte:\n• Cuadrantes y la Roster Page\n• Turnos genéricos\n• Fichajes y control horario\n• Gestión de usuarios y ausencias\n• Reportes de horas';

