
import { axiosClient } from "@/services/axiosClient";

export const aiService = {
    async sendMessage(message) {
        try {
            // Usamos axiosClient para heredar la baseURL y los interceptores
            const response = await axiosClient.post('/ai/chat', { message }, {
                // Si la IA responde texto plano en lugar de JSON, 
                // esto evita que Axios intente parsearlo como objeto
                responseType: 'text'
            });

            // Axios devuelve el cuerpo de la respuesta directamente en .data
            return response.data;
        } catch (error) {
            console.error('Error en aiService.sendMessage:', error);
            throw error;
        }
    }
};