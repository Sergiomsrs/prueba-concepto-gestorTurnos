const API_URL = 'http://localhost:8081/api';
const ADMIN_CREDENTIALS = { dni: "1234", password: "1234" };

// 1. CONFIGURACIÓN DINÁMICA DE ROLES (Plantilla)
const ROLES_GENERATOR_CONFIG = [
    { prefijo: "Turno", horas: 39, equipo: "black", cantidad: 7 },
    { prefijo: "T-40", horas: 40, equipo: "black", cantidad: 0 },

];

// 2. CONFIGURACIÓN DE EMPLEADOS
const DEMO_CONFIG = [
    { cantidad: 0, horas: 39, equipo: "black", numero: 1 },
    { cantidad: 0, horas: 20, equipo: "red", numero: 1 }
];

async function seedData() {
    try {
        // --- LOGIN ---
        console.log("🔐 Autenticando administrador...");
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ADMIN_CREDENTIALS)
        });

        if (!loginRes.ok) throw new Error("Error en la autenticación. Revisa las credenciales.");

        const { token } = await loginRes.json();
        const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

        console.log("🚀 Iniciando carga masiva...");

        // --- 0. GENERAR Y CARGAR ROLES DE TURNO ---
        console.log("🛠️  Generando lista de roles dinámicamente...");
        const rolesToSave = [];

        ROLES_GENERATOR_CONFIG.forEach(config => {
            for (let i = 1; i <= config.cantidad; i++) {
                rolesToSave.push({
                    name: `${config.prefijo} ${i}`,
                    wwh: config.horas,
                    teamwork: config.equipo,
                    active: true // Importante: mapea a isActive en tu entidad Java
                });
            }
        });

        if (rolesToSave.length > 0) {
            const rolesRes = await fetch(`${API_URL}/role/bulk`, {
                method: 'POST',
                headers,
                body: JSON.stringify(rolesToSave)
            });

            if (rolesRes.ok) {
                console.log(`   ✅ ${rolesToSave.length} Roles genéricos creados/actualizados.`);
            } else {
                console.warn("   ⚠️ Error al guardar roles (revisa si el endpoint /bulk existe).");
            }
        }

        // --- 1. CARGAR EMPLEADOS Y VINCULACIONES ---
        for (const grupo of DEMO_CONFIG) {
            console.log(`\n📦 Creando grupo: ${grupo.cantidad} empleados (${grupo.equipo} - ${grupo.horas}h)`);

            for (let i = 1; i <= grupo.cantidad; i++) {
                const randomId = Math.floor(Math.random() * 9000) + 1000;

                // --- 1.1 CREAR EMPLEADO ---
                const empRes = await fetch(`${API_URL}/emp/create`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        name: `Empleado ${(grupo.numero + i) - 1}`,
                        lastName: 'Demo',
                        secondLastName: `Nº${randomId}`,
                        email: `user${randomId}@demo.com`,
                        dni: `DNI${randomId}`,
                        password: "password123",
                        hireDate: "2026-01-01",
                        role: "USER"
                    })
                });

                if (!empRes.ok) {
                    console.error(`   ❌ Error al crear empleado DNI${randomId}`);
                    continue;
                }

                const empleado = await empRes.json();
                const eId = empleado.id;

                // --- 1.2 ASIGNAR EQUIPO ---
                const twParams = new URLSearchParams({
                    employeeId: eId,
                    teamWork: grupo.equipo,
                    twStartDate: "2026-01-01"
                });
                await fetch(`${API_URL}/teamwork/create?${twParams.toString()}`, { method: 'POST', headers });

                // --- 1.3 ASIGNAR JORNADA ---
                const wwhParams = new URLSearchParams({
                    employeeId: eId,
                    weeklyWorkHoursData: grupo.horas,
                    wwhStartDate: "2026-01-01"
                });
                await fetch(`${API_URL}/wwh/create?${wwhParams.toString()}`, { method: 'POST', headers });

                console.log(`   ✅ [${i}/${grupo.cantidad}] Creado DNI${randomId} y vinculado.`);

                // Pequeño respiro para evitar saturar el servidor
                await new Promise(r => setTimeout(r, 50));
            }
        }

        console.log("\n✨ Proceso de carga masiva finalizado correctamente.");

    } catch (error) {
        console.error("\n❌ Error crítico en el seeder:", error.message);
    }
}

// Ejecutar
seedData();