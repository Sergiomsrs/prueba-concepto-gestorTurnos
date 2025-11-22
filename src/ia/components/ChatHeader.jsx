export const ChatHeader = ({ onClose, onReset, hasMessages }) => {
    return (
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">

            {/* Título y estado */}
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <span className="text-lg">🤖</span>
                </div>
                <div>
                    <h3 className="font-semibold text-sm">Asistente IA</h3>
                    <div className="flex items-center gap-1 text-xs text-blue-100">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span>En línea</span>
                    </div>
                </div>
            </div>

            {/* Botones de acción */}
            <div className="flex items-center gap-2">

                {/* Botón limpiar chat */}
                {hasMessages && (
                    <button
                        onClick={onReset}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                        title="Limpiar conversación"
                    >
                        <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                )}

                {/* Botón minimizar */}
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                    title="Minimizar chat"
                >
                    <svg className="w-4 h-4 group-hover:scale-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};