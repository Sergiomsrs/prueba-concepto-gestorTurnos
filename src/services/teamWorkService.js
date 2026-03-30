import { axiosClient } from "./axiosClient";

export const fetchTwConditions = {

    getTeamWorkByEmployee: async (employeeId) => {
        try {
            const response = await axiosClient.get(`/teamwork/${employeeId}`);


            return response.data || [];
        } catch (error) {
            if (error.response?.status === 204) return [];
            throw error;
        }
    },

    saveTw: async (employeeId, teamWork, twStartDate) => {
        try {
            const response = await axiosClient.post('/teamwork/create', null, {
                params: {
                    employeeId: employeeId,
                    teamWork: teamWork,
                    twStartDate: twStartDate
                }
            });

            return { status: response.status, data: response.data };
        } catch (error) {
            throw new Error(`Error en la respuesta del servidor: ${error.response?.status || error.message}`);
        }
    },

    deleteTw: async (twId) => {
        try {
            const response = await axiosClient.delete(`/teamwork/${twId}`);

            return { status: response.status, data: response.data };
        } catch (error) {
            throw new Error(`Error en la respuesta del servidor: ${error.response?.status || error.message}`);
        }
    },
};