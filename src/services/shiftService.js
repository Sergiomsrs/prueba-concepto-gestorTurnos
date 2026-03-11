import { axiosClient } from "./axiosClient";

// 📅 Obtener turnos de la semana (Ruta con variables en la URL)
export const getShiftWeek = async (startDate, endDate) => {
    try {
        const response = await axiosClient.get(`/day/${startDate}/${endDate}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 👥 Obtener roles/turnos genéricos
export const getGenericShiftWeek = async () => {
    try {
        const response = await axiosClient.get('/gs/getRoles');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 🛠️ Objeto de acciones para turnos
export const fetchShift = {
    // Guardar un turno individual
    saveIndividualShift: async (config) => {
        try {
            const response = await axiosClient.post('/schedule/create-turn', config);
            return {
                status: response.status,
                data: response.data
            };
        } catch (error) {
            throw new Error(`Error en la respuesta del servidor: ${error.response?.status || error.message}`);
        }
    },

    // Copiar una semana completa a otra
    copyWeek: async ({ sourceStartDate, targetStartDate }) => {
        try {
            const response = await axiosClient.post('/schedule/copy-week', {
                sourceStartDate,
                targetStartDate
            });

            // Axios maneja tanto texto plano como JSON en .data
            return {
                status: response.status,
                data: response.data
            };
        } catch (error) {
            throw new Error(error.response?.data?.message || "Error al copiar semana");
        }
    },
};