import { useState } from "react";

export const ChatUI = () => {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");

        // Agregar mensaje del usuario
        setMessages(prev => [...prev, { from: "user", text: userMessage }]);

        // Mostrar indicador de carga
        setIsLoading(true);
        setMessages(prev => [...prev, { from: "bot", text: "Escribiendo...", isLoading: true }]);

        try {
            const response = await fetch('http://localhost:8090/ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage })
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const result = await response.text(); // Como la API devuelve un string

            // Reemplazar el mensaje de carga con la respuesta
            setMessages(prev => prev.filter(m => !m.isLoading).concat({
                from: "bot",
                text: result
            }));

        } catch (error) {
            console.error('Error al enviar mensaje:', error);

            // Reemplazar mensaje de carga con error
            setMessages(prev => prev.filter(m => !m.isLoading).concat({
                from: "bot",
                text: "❌ Error al procesar tu solicitud. Verifica que el servidor esté funcionando."
            }));
        } finally {
            setIsLoading(false);
        }
    };

    // Función para resetear el chat
    const resetChat = () => {
        setMessages([]);
        setInput("");
        setIsLoading(false);
    };

    return (
        <div className="relative">
            {/* Chat expandido - Más grande */}
            <div className={`absolute bottom-16 right-0 transition-all duration-300 ease-in-out ${isOpen ? 'transform translate-y-0 opacity-100' : 'transform translate-y-full opacity-0 pointer-events-none'
                }`}>
                <div className="flex flex-col h-[500px] w-96 bg-white border border-gray-200 rounded-t-lg shadow-lg">
                    {/* Header del chat con botones */}
                    <div className="bg-blue-500 text-white px-5 py-4 rounded-t-lg flex items-center justify-between">
                        <h3 className="text-base font-medium">🤖 Asistente IA</h3>
                        <div className="flex items-center gap-2">
                            {/* Botón resetear */}
                            {messages.length > 0 && (
                                <button
                                    onClick={resetChat}
                                    className="text-white hover:text-gray-200 transition-colors p-1 hover:bg-blue-600 rounded"
                                    title="Limpiar chat"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            )}
                            {/* Botón cerrar */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white hover:text-gray-200 transition-colors p-1 hover:bg-blue-600 rounded"
                                title="Cerrar chat"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Área de mensajes - Más espacio */}
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
                            messages.map((m, i) => (
                                <div key={i} className={m.from === "user" ? "flex justify-end" : "flex justify-start"}>
                                    <span className={`inline-block px-4 py-3 rounded-lg text-sm leading-relaxed ${m.from === "user"
                                        ? "bg-blue-500 text-white rounded-br-none max-w-sm"
                                        : `bg-white text-gray-800 border border-gray-200 rounded-bl-none max-w-sm ${m.isLoading ? 'animate-pulse' : ''
                                        }`
                                        }`}>
                                        {m.isLoading ? (
                                            <span className="flex items-center gap-1">
                                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-100"></span>
                                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-200"></span>
                                                <span className="ml-2">Escribiendo...</span>
                                            </span>
                                        ) : (
                                            m.text
                                        )}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Input área - Más espacio */}
                    <div className="flex p-4 bg-white border-t border-gray-200 rounded-b-lg gap-3">
                        <input
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                            placeholder="Escribe tu solicitud..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && sendMessage()}
                            disabled={isLoading}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={isLoading || !input.trim()}
                            className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                        >
                            {isLoading ? '...' : 'Enviar'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Botón flotante para abrir chat */}
            <button
                onClick={() => setIsOpen(true)}
                className={`bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
                    }`}
            >
                <div className="flex items-center justify-center relative">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582-8 8-8a8.962 8.962 0 01-4.732-1.383l-4.215 1.055a.5.5 0 01-.616-.616l1.055-4.215A8.962 8.962 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                    </svg>
                    {/* Indicador de mensajes nuevos */}
                    {messages.length > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                            {messages.filter(m => m.from === "bot" && !m.isLoading).length}
                        </div>
                    )}
                </div>
            </button>
        </div>
    );
}
