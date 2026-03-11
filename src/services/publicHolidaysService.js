import { axiosClient } from "./axiosClient";
export const fetchPublicHolidays = {

    getAll: async () => {
        try {
            const response = await axiosClient.get('/ph');

            if (response.status === 204) return [];

            return response.data;
        } catch (error) {
            if (error.response?.status === 204) return [];
            throw error;
        }
    },

    savePh: async (id, date, type, description, paid) => {
        try {
            const payload = {
                id: id,
                date: date,
                type: type,
                description: description,
                paid: paid === "SI"
            };

            const response = await axiosClient.post('/ph', payload);

            return {
                status: response.status,
                data: response.data
            };
        } catch (error) {
            throw new Error(`Error en la respuesta del servidor: ${error.response?.status || error.message}`);
        }
    },

    deleteById: async (id) => {
        try {
            const response = await axiosClient.delete(`/ph/${id}`);

            return {
                status: response.status,
                data: response.data
            };
        } catch (error) {
            throw new Error(`Error en la respuesta del servidor: ${error.response?.status || error.message}`);
        }
    },
};