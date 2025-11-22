// src/ia/hooks/useChatAI.js
import { useState, useCallback } from 'react';
import { aiService } from '../services/aiService';


export const useChatAI = () => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = useCallback(async (userMessage) => {
        if (!userMessage.trim() || isLoading) return;

        // Agregar mensaje del usuario
        setMessages(prev => [...prev, {
            from: "user",
            text: userMessage,
            id: Date.now() // Para mejor tracking
        }]);

        // Mostrar indicador de carga
        setIsLoading(true);
        const loadingId = Date.now() + 1;
        setMessages(prev => [...prev, {
            from: "bot",
            text: "Escribiendo...",
            isLoading: true,
            id: loadingId
        }]);

        try {
            const response = await aiService.sendMessage(userMessage);

            // Reemplazar el mensaje de carga con la respuesta
            setMessages(prev => prev.filter(m => m.id !== loadingId).concat({
                from: "bot",
                text: response,
                id: Date.now() + 2
            }));

        } catch (error) {
            // Reemplazar mensaje de carga con error
            setMessages(prev => prev.filter(m => m.id !== loadingId).concat({
                from: "bot",
                text: "❌ Error al procesar tu solicitud. Verifica que el servidor esté funcionando.",
                id: Date.now() + 3,
                isError: true
            }));
        } finally {
            setIsLoading(false);
        }
    }, [isLoading]);

    const resetChat = useCallback(() => {
        setMessages([]);
        setIsLoading(false);
    }, []);

    const botMessageCount = messages.filter(m => m.from === "bot" && !m.isLoading).length;

    return {
        messages,
        isLoading,
        sendMessage,
        resetChat,
        botMessageCount,
        hasMessages: messages.length > 0
    };
};