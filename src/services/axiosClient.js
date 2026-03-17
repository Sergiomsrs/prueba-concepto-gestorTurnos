import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const axiosClient = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// --- INTERCEPTOR DE PETICIÓN (REQUEST) ---
axiosClient.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("token");

        // Bloqueo total para el modo Demo
        if (token === "demo-token-12345") {
            console.warn(`🚫 Petición ${config.method.toUpperCase()} bloqueada: Modo Demo activo.`);

            const demoError = new Error("BLOCK_ALL_DEMO_REQUESTS");
            demoError.isDemoCancel = true;

            return Promise.reject(demoError);
        }

        // Inyección automática del token Bearer
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
        // Silenciar errores provocados por el bloqueo del Modo Demo
        if (error.isDemoCancel || error.message === "BLOCK_ALL_DEMO_REQUESTS") {
            return new Promise(() => { });
        }

        // 401: Token expirado o inválido -> Cierre de sesión y redirección
        if (error.response?.status === 401) {
            console.warn("Sesión expirada (401)");
            sessionStorage.clear();
            if (!window.location.hash.includes("/login")) {
                window.location.href = "/#/login";
            }
        }

        // 403: Prohibido (Falta de permisos) -> Solo informar, no cerrar sesión
        if (error.response?.status === 403) {
            console.error("Error 403: No tienes permisos suficientes para este recurso.");
        }

        return Promise.reject(error);
    }
);