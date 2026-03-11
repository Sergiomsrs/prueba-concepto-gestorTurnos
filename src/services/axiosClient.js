import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const axiosClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// interceptor request
axiosClient.interceptors.request.use(
    (config) => {

        const token = sessionStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// interceptor response
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {

        if (error.response?.status === 403) {
            console.warn("Token expirado");
            sessionStorage.clear();
            // window.location.href = "/prueba-concepto-gestorTurnos/login#/login";
        }

        return Promise.reject(error);
    }
);