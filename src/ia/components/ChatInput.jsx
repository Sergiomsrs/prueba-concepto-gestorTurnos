export const ChatInput = ({
    value,
    onChange,
    onKeyDown,
    onSend,
    disabled,
    placeholder = "Escribe tu mensaje..."
}) => {
    return (
        <div className="border-t border-gray-200 p-4">
            <div className="flex gap-2">
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`flex-1 resize-none border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all
            ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-50' : 'bg-white'}
          `}
                    rows={1}
                    style={{ minHeight: '42px', maxHeight: '100px' }}
                />

                <button
                    onClick={onSend}
                    disabled={disabled || !value.trim()}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center min-w-[80px]
            ${disabled || !value.trim()
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95'
                        }
          `}
                >
                    {disabled ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="hidden sm:inline">...</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span>Enviar</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </div>
                    )}
                </button>
            </div>

            {/* Hint de atajos */}
            <div className="mt-2 text-xs text-gray-500">
                Presiona <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">Enter</kbd> para enviar
            </div>
        </div>
    );
};