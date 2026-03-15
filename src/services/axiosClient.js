import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const axiosClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// --- INTERCEPTOR DE PETICIÓN (REQUEST) ---
axiosClient.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("token");

        // 1. BLOQUEO TOTAL MODO DEMO
        // Si el token es el de demo, rechazamos CUALQUIER petición (GET, POST, etc.)
        if (token === "demo-token-12345") {
            console.warn(`🚫 Petición ${config.method.toUpperCase()} bloqueada: Modo Demo activo (Sin conexión a API).`);

            // Creamos un error personalizado
            const demoError = new Error("BLOCK_ALL_DEMO_REQUESTS");
            demoError.isDemoCancel = true;

            // Al retornar Promise.reject, la petición NUNCA sale del navegador
            return Promise.reject(demoError);
        }

        // 2. COMPORTAMIENTO NORMAL (Usuarios reales)
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// --- INTERCEPTOR DE RESPUESTA (RESPONSE) ---
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // A. Si nosotros mismos bloqueamos la petición en el Request
        if (error.isDemoCancel || error.message === "BLOCK_ALL_DEMO_REQUESTS") {

            // Retornamos una promesa que nunca se resuelve (Pending)
            // Esto evita que salten los bloques .catch() o errores rojos en tus componentes
            return new Promise(() => { });
        }

        // B. Manejo de errores reales del servidor (solo para usuarios no-demo)
        if (error.response?.status === 403 || error.response?.status === 401) {
            console.warn("Sesión inválida o expirada");
            sessionStorage.clear();
            // Evitamos redirecciones si ya estamos en login
            if (!window.location.hash.includes("/login")) {
                window.location.href = "/#/login";
            }
        }

        return Promise.reject(error);
    }
);