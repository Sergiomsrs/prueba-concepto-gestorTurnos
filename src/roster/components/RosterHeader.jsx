import { memo } from 'react';

export const RosterHeader = memo(({ onSave, modifiedCount, loading, alert }) => {
    return (
        <header className="bg-white shadow-sm border-b px-6 py-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">ShiftBoard</h1>
                    <p className="text-gray-600">Gestión de turnos de trabajo</p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Indicador de cambios pendientes */}
                    {modifiedCount > 0 && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                            {modifiedCount} cambios pendientes
                        </span>
                    )}

                    {/* Botón de guardado */}
                    <button
                        onClick={onSave}
                        disabled={modifiedCount === 0 || loading}
                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${modifiedCount === 0 || loading
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                    >
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </div>

            {/* Alert */}
            {alert?.isOpen && (
                <div className={`mt-4 p-3 rounded-lg ${alert.message?.type === 'success' ? 'bg-green-100 text-green-800' :
                        alert.message?.type === 'error' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                    }`}>
                    {alert.message?.text}
                </div>
            )}
        </header>
    );
});

RosterHeader.displayName = 'RosterHeader';