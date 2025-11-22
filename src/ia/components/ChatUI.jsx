import { useChatAI } from "../hooks/useChatAI";
import { useChatUI } from "../hooks/useChatUI";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";


export const ChatUI = () => {
    const {
        messages,
        isLoading,
        sendMessage,
        resetChat,
        botMessageCount,
        hasMessages
    } = useChatAI();

    const {
        isOpen,
        input,
        openChat,
        closeChat,
        updateInput,
        clearInput
    } = useChatUI();

    const handleSendMessage = async () => {
        const messageText = input.trim();
        if (!messageText) return;

        clearInput();
        await sendMessage(messageText);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="relative">
            {/* Chat expandido */}
            <div className={`absolute bottom-16 right-0 transition-all duration-300 ease-in-out ${isOpen ? 'transform translate-y-0 opacity-100' : 'transform translate-y-full opacity-0 pointer-events-none'
                }`}>
                <div className="flex flex-col h-[500px] w-96 bg-white border border-gray-200 rounded-t-lg shadow-lg">

                    <ChatHeader
                        onClose={closeChat}
                        onReset={resetChat}
                        hasMessages={hasMessages}
                    />

                    {/* Área de mensajes */}
                    <div className="flex-1 overflow-auto p-5 space-y-4 bg-gray-50">
                        {messages.length === 0 ? (
                            <div className="text-center text-gray-500 text-sm">
                                <div className="mb-3">¡Hola! Soy tu asistente IA 🤖</div>
                                <div className="text-xs leading-relaxed">
                                    Puedo ayudarte a crear turnos.
                                    <br />
                                    <strong>Ejemplo:</strong> "Crea un turno para el empleado 7 el 22/11/2025 de 08:00 a 14:00"
                                </div>
                            </div>
                        ) : (
                            messages.map((message) => (
                                <ChatMessage key={message.id} message={message} />
                            ))
                        )}
                    </div>

                    <ChatInput
                        value={input}
                        onChange={updateInput}
                        onKeyDown={handleKeyDown}
                        onSend={handleSendMessage}
                        disabled={isLoading}
                        placeholder="Escribe tu solicitud..."
                    />
                </div>
            </div>

            {/* Botón flotante */}
            <button
                onClick={openChat}
                className={`bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
                    }`}
            >
                <div className="flex items-center justify-center relative">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582-8 8-8a8.962 8.962 0 01-4.732-1.383l-4.215 1.055a.5.5 0 01-.616-.616l1.055-4.215A8.962 8.962 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                    </svg>
                    {botMessageCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                            {botMessageCount}
                        </div>
                    )}
                </div>
            </button>
        </div>
    );
};
