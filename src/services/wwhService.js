import { axiosClient } from "./axiosClient";


export const fetchConditions = {

    getWwhByEmployee: async (employeeId) => {
        try {
            const response = await axiosClient.get(`/wwh/${employeeId}`);
            return response.data || [];
        } catch (error) {
            if (error.response?.status === 204) return [];
            throw error;
        }
    },

    saveWwh: async (employeeId, startDate, endDate) => {
        try {
            const response = await axiosClient.post('/wwh/create', null, {
                params: {
                    employeeId: employeeId,
                    weeklyWorkHoursData: startDate,
                    wwhStartDate: endDate
                }
            });

            return { status: response.status, data: response.data };
        } catch (error) {
            throw new Error(`Error en la respuesta del servidor: ${error.response?.status}`);
        }
    },

    deleteWwh: async (wwhId) => {
        try {
            const response = await axiosClient.delete(`/wwh/${wwhId}`);
            return { status: response.status, data: response.data };
        } catch (error) {
            throw new Error(`Error en la respuesta del servidor: ${error.response?.status}`);
        }
    },
};
