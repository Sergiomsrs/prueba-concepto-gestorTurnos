import { useState, useRef } from "react";
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

    // Estados para redimensionamiento
    const [chatSize, setChatSize] = useState({ width: 384, height: 500 });
    const [isResizing, setIsResizing] = useState(false);
    const chatRef = useRef(null);
    const isResizingRef = useRef(false); // Usar ref para evitar problemas de closure

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

    // Funciones de redimensionamiento CORREGIDAS
    const handleMouseDown = (e, direction) => {
        e.preventDefault();
        e.stopPropagation();

        setIsResizing(true);
        isResizingRef.current = true;

        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = chatSize.width;
        const startHeight = chatSize.height;

        const handleMouseMove = (e) => {
            if (!isResizingRef.current) return;

            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            let newWidth = startWidth;
            let newHeight = startHeight;

            // Aplicar cambios según la dirección
            if (direction.includes('right')) {
                newWidth = Math.max(300, Math.min(800, startWidth + deltaX));
            }
            if (direction.includes('left')) {
                newWidth = Math.max(300, Math.min(800, startWidth - deltaX));
            }
            if (direction.includes('bottom')) {
                newHeight = Math.max(300, Math.min(700, startHeight + deltaY));
            }
            if (direction.includes('top')) {
                newHeight = Math.max(300, Math.min(700, startHeight - deltaY));
            }

            setChatSize({ width: newWidth, height: newHeight });
        };

        const handleMouseUp = () => {
            isResizingRef.current = false;
            setIsResizing(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'default';
            document.body.style.userSelect = '';
        };

        // Cambiar cursor y deshabilitar selección de texto
        document.body.style.cursor = getDirectionCursor(direction);
        document.body.style.userSelect = 'none';

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    // Función para obtener el cursor correcto según la dirección
    const getDirectionCursor = (direction) => {
        switch (direction) {
            case 'top-left': return 'nw-resize';
            case 'top-right': return 'ne-resize';
            case 'bottom-left': return 'sw-resize';
            case 'bottom-right': return 'se-resize';
            case 'top': return 'n-resize';
            case 'bottom': return 's-resize';
            case 'left': return 'w-resize';
            case 'right': return 'e-resize';
            default: return 'default';
        }
    };

    return (
        <div className="relative">
            {/* Chat expandido */}
            <div className={`fixed sm:absolute bottom-16 sm:bottom-16 right-2 sm:right-0 transition-all duration-300 ease-in-out z-50 ${isOpen ? 'transform translate-y-0 opacity-100' : 'transform translate-y-full opacity-0 pointer-events-none'
                }`}>
                <div
                    ref={chatRef}
                    className="flex flex-col bg-white border border-gray-200 rounded-t-lg shadow-lg relative"
                    style={{
                        width: `${Math.min(chatSize.width, window.innerWidth - 16)}px`, // Respeta los márgenes móviles
                        height: `${Math.min(chatSize.height, window.innerHeight - 100)}px`, // Respeta el footer móvil
                        minWidth: '300px',
                        minHeight: '300px',
                        maxWidth: '800px',
                        maxHeight: '700px',
                        userSelect: isResizing ? 'none' : 'auto'
                    }}
                >

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

                    {/* Handles de redimensionamiento - OCULTOS EN MÓVIL */}
                    <div className="hidden sm:block">
                        {/* Esquinas */}
                        <div
                            className="absolute -top-1 -left-1 w-4 h-4 cursor-nw-resize bg-blue-500 rounded-tl-lg opacity-0 hover:opacity-80 transition-opacity z-10"
                            onMouseDown={(e) => handleMouseDown(e, 'top-left')}
                            title="Redimensionar esquina superior izquierda"
                        />

                        <div
                            className="absolute -top-1 -right-1 w-4 h-4 cursor-ne-resize bg-blue-500 rounded-tr-lg opacity-0 hover:opacity-80 transition-opacity z-10"
                            onMouseDown={(e) => handleMouseDown(e, 'top-right')}
                            title="Redimensionar esquina superior derecha"
                        />

                        <div
                            className="absolute -bottom-1 -left-1 w-4 h-4 cursor-sw-resize bg-blue-500 rounded-bl-lg opacity-0 hover:opacity-80 transition-opacity z-10"
                            onMouseDown={(e) => handleMouseDown(e, 'bottom-left')}
                            title="Redimensionar esquina inferior izquierda"
                        />

                        <div
                            className="absolute -bottom-1 -right-1 w-4 h-4 cursor-se-resize bg-blue-500 rounded-br-lg opacity-0 hover:opacity-80 transition-opacity z-10"
                            onMouseDown={(e) => handleMouseDown(e, 'bottom-right')}
                            title="Redimensionar esquina inferior derecha"
                        />

                        {/* Bordes */}
                        <div
                            className="absolute top-2 -left-1 w-2 h-[calc(100%-16px)] cursor-w-resize hover:bg-blue-200 transition-colors opacity-0 hover:opacity-70 rounded-l-lg"
                            onMouseDown={(e) => handleMouseDown(e, 'left')}
                            title="Redimensionar horizontalmente"
                        />

                        <div
                            className="absolute top-2 -right-1 w-2 h-[calc(100%-16px)] cursor-e-resize hover:bg-blue-200 transition-colors opacity-0 hover:opacity-70 rounded-r-lg"
                            onMouseDown={(e) => handleMouseDown(e, 'right')}
                            title="Redimensionar horizontalmente"
                        />

                        <div
                            className="absolute -top-1 left-2 w-[calc(100%-16px)] h-2 cursor-n-resize hover:bg-blue-200 transition-colors opacity-0 hover:opacity-70 rounded-t-lg"
                            onMouseDown={(e) => handleMouseDown(e, 'top')}
                            title="Redimensionar verticalmente"
                        />

                        <div
                            className="absolute -bottom-1 left-2 w-[calc(100%-16px)] h-2 cursor-s-resize hover:bg-blue-200 transition-colors opacity-0 hover:opacity-70 rounded-b-lg"
                            onMouseDown={(e) => handleMouseDown(e, 'bottom')}
                            title="Redimensionar verticalmente"
                        />
                    </div>

                    {/* Indicador visual de redimensionamiento */}
                    {isResizing && (
                        <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-3 py-1 rounded-md shadow-lg z-20">
                            {chatSize.width} × {chatSize.height}
                        </div>
                    )}
                </div>
            </div>

            {/* Botón flotante - AJUSTADO PARA MÓVIL */}
            <button
                onClick={openChat}
                className={`fixed sm:relative bottom-4 right-4 sm:bottom-auto sm:right-auto bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-40 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
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
