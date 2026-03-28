import { useState, useCallback, useRef } from 'react';
import { offlineChatService } from '../services/offlineChatService';

export const useChatAI = () => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // 🔑 contador seguro para IDs únicos
    const idCounter = useRef(0);
    const generateId = () => {
        idCounter.current += 1;
        return `${Date.now()}-${idCounter.current}`;
    };

    const sendMessage = useCallback(async (userMessage) => {
        if (!userMessage.trim() || isLoading) return;

        const userId = generateId();

        setMessages(prev => [
            ...prev,
            {
                from: 'user',
                text: userMessage,
                id: userId,
            }
        ]);

        setIsLoading(true);

        const loadingId = generateId();

        setMessages(prev => [
            ...prev,
            {
                from: 'bot',
                text: '...',
                isLoading: true,
                id: loadingId,
            }
        ]);

        // Delay mínimo para UX
        await new Promise(r => setTimeout(r, 500));

        const answer = offlineChatService.getAnswer(userMessage);

        setMessages(prev =>
            prev
                .filter(m => m.id !== loadingId)
                .concat({
                    from: 'bot',
                    text: answer,
                    id: generateId(),
                })
        );

        setIsLoading(false);
    }, [isLoading]);

    const resetChat = useCallback(() => {
        setMessages([]);
        setIsLoading(false);
        idCounter.current = 0; // opcional: resetear contador
    }, []);

    const botMessageCount = messages.filter(m => m.from === 'bot' && !m.isLoading).length;

    return {
        messages,
        isLoading,
        sendMessage,
        resetChat,
        botMessageCount,
        hasMessages: messages.length > 0,
    };
};