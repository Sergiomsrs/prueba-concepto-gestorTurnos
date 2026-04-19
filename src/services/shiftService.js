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
};