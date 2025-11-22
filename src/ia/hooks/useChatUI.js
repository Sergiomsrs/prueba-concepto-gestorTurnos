// src/ia/hooks/useChatUI.js
import { useState, useCallback } from 'react';

export const useChatUI = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");

    const openChat = useCallback(() => {
        setIsOpen(true);
    }, []);

    const closeChat = useCallback(() => {
        setIsOpen(false);
    }, []);

    const toggleChat = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    const updateInput = useCallback((value) => {
        setInput(value);
    }, []);

    const clearInput = useCallback(() => {
        setInput("");
    }, []);

    return {
        isOpen,
        input,
        openChat,
        closeChat,
        toggleChat,
        updateInput,
        clearInput
    };
};