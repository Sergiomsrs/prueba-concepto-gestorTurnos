import { axiosClient } from "@/services/axiosClient";

export const authService = {
    login: async (credentials) => {
        const response = await axiosClient.post('/auth/login', credentials);
        return response.data;
    },

    getMe: async () => {
        const response = await axiosClient.get('/emp/me');
        return response.data;
    }
};