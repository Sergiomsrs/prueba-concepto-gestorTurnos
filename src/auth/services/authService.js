import { axiosClient } from "@/services/axiosClient";

export const authService = {
    login: async (credentials, config) => {
        const response = await axiosClient.post('/auth/login', credentials, config);
        return response.data;
    },

    getMe: async (config) => {
        const response = await axiosClient.get('/emp/me', config);
        return response.data;
    }
};