import { useReducer, useCallback, useRef } from 'react';
import { offlineChatService } from '../services/offlineChatService';

const initialState = {
    messages: [],
    isLoading: false,
};

function chatReducer(state, action) {
    switch (action.type) {
        case 'ADD_USER_MESSAGE':
            return {
                ...state,
                messages: [...state.messages, action.payload],
            };

        case 'ADD_LOADING_MESSAGE':
            return {
                ...state,
                isLoading: true,
                messages: [...state.messages, action.payload],
            };

        case 'REPLACE_LOADING_WITH_BOT':
            return {
                ...state,
                isLoading: false,
                messages: state.messages
                    .filter(m => m.id !== action.loadingId)
                    .concat(action.payload),
            };

        case 'RESET':
            return initialState;

        default:
            return state;
    }
}

export const useChatAI = () => {
    const [state, dispatch] = useReducer(chatReducer, initialState);

    const idCounter = useRef(0);
    const generateId = () => {
        idCounter.current += 1;
        return `${Date.now()}-${idCounter.current}`;
    };

    const sendMessage = useCallback(async (userMessage) => {
        if (!userMessage.trim()) return;

        // 1. mensaje usuario
        const userMsg = {
            id: generateId(),
            from: 'user',
            text: userMessage,
        };

        dispatch({ type: 'ADD_USER_MESSAGE', payload: userMsg });

        // 2. mensaje loading
        const loadingId = generateId();

        dispatch({
            type: 'ADD_LOADING_MESSAGE',
            payload: {
                id: loadingId,
                from: 'bot',
                text: '...',
                isLoading: true,
            },
        });

        // 3. delay UX
        await new Promise(r => setTimeout(r, 500));

        // 4. respuesta bot
        const answer = offlineChatService.getAnswer(userMessage);

        dispatch({
            type: 'REPLACE_LOADING_WITH_BOT',
            loadingId,
            payload: {
                id: generateId(),
                from: 'bot',
                text: answer,
            },
        });

    }, []);

    const resetChat = useCallback(() => {
        dispatch({ type: 'RESET' });
        idCounter.current = 0;
    }, []);

    const botMessageCount = state.messages.filter(
        m => m.from === 'bot' && !m.isLoading
    ).length;

    return {
        messages: state.messages,
        isLoading: state.isLoading,
        sendMessage,
        resetChat,
        botMessageCount,
        hasMessages: state.messages.length > 0,
    };
};