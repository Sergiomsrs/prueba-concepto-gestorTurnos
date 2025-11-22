const AI_API_URL = import.meta.env.VITE_AI_API_URL || 'http://localhost:8090/ai';

export const aiService = {
    async sendMessage(message) {
        try {
            const response = await fetch(AI_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message })
            });

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            return await response.text();
        } catch (error) {
            console.error('Error en aiService.sendMessage:', error);
            throw error;
        }
    }
};