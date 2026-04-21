import { axiosClient } from "@/services/axiosClient";


export const plannerService = {
    solve: async ({ absentEmployeeId, from, to }) => {
        // El segundo argumento de post es el body (null), el tercero es la config (params)
        const response = await axiosClient.post(`/shifts/solver/solve`, null, {
            params: {
                absentEmployeeId,
                from,
                to
            }
        });
        return response.data;
    },

    getStatus: async () => {
        const response = await axiosClient.get('/shifts/solver/status');
        return response.data; // Retorna "IDLE", "SOLVING_ACTIVE" o "SOLVING"
    },

    getProposal: async () => {
        const response = await axiosClient.get('/shifts/solver/proposal');
        return response.data;
    },

    confirm: async () => {
        const response = await axiosClient.post('/shifts/solver/confirm');
        return response.data;
    },
    reject: async () => {
        const response = await axiosClient.delete('/shifts/solver/reject');
        return response.data;
    }
};