const API_URL = 'http://localhost:8081/api';

// 1. CONFIGURACIÓN DE LA DEMO
const ADMIN_CREDENTIALS = { dni: "1234", password: "1234" };

const DEMO_CONFIG = [
    { cantidad: 3, horas: 40, equipo: "blue" },
    { cantidad: 3, horas: 20, equipo: "black" }
];

async function seedData() {
    try {
        // --- LOGIN ---
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ADMIN_CREDENTIALS)
        });
        const { token } = await loginRes.json();
        const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

        console.log("🚀 Iniciando carga masiva...");

        for (const grupo of DEMO_CONFIG) {
            console.log(`\n📦 Creando grupo: ${grupo.cantidad} empleados (${grupo.equipo} - ${grupo.horas}h)`);

            for (let i = 1; i <= grupo.cantidad; i++) {
                const randomId = Math.floor(Math.random() * 9000) + 1000;

                // --- 1. CREAR EMPLEADO ---
                const empRes = await fetch(`${API_URL}/emp/create`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        name: `Nuevo`,
                        lastName: `${grupo.equipo} ${i}`, // Pilla "ROJO" o "VERDE"
                        secondLastName: `Nº${randomId}`,
                        email: `user${randomId}@demo.com`,
                        dni: `DNI${randomId}`,
                        password: "password123",
                        hireDate: "2026-01-01",
                        role: "USER"
                    })
                });
                const empleado = await empRes.json();
                const eId = empleado.id;

                // --- 2. ASIGNAR EQUIPO (TeamWork) ---
                // Nota: Usamos URLSearchParams porque tu backend usa @RequestParam (Query Params)
                const twParams = new URLSearchParams({
                    employeeId: eId,
                    teamWork: grupo.equipo,
                    twStartDate: "2026-01-01"
                });
                await fetch(`${API_URL}/teamwork/create?${twParams.toString()}`, { method: 'POST', headers });

                // --- 3. ASIGNAR JORNADA (WWH) ---
                const wwhParams = new URLSearchParams({
                    employeeId: eId,
                    weeklyWorkHoursData: grupo.horas,
                    wwhStartDate: "2026-01-01"
                });
                await fetch(`${API_URL}/wwh/create?${wwhParams.toString()}`, { method: 'POST', headers });

                console.log(`   ✅ [${i}/${grupo.cantidad}] Creado DNI${randomId} y vinculado a sus datos.`);

                // Pequeño respiro de 100ms para no estresar el RateLimiter si vas a crear muchos
                await new Promise(r => setTimeout(r, 100));
            }
        }
        console.log("\n✨ Demo lista para usar.");

    } catch (error) {
        console.error("❌ Error en el seeder:", error.message);
    }
}

seedData();