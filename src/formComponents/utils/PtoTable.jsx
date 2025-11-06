export const PtoTable = ({ employeePto }) => {
    // Función para calcular los días entre dos fechas (incluyendo ambos días)
    const getDaysBetween = (start, end) => {
        if (!start || !end) return "-";
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diff = endDate - startDate;
        return diff >= 0 ? Math.floor(diff / (1000 * 60 * 60 * 24)) + 1 : "-";
    };

    // Función para formatear fecha más legible con año
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    // Función para formato compacto cuando las fechas son del mismo año
    const formatDateCompact = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short'
        });
    };

    // Función para determinar si dos fechas son del mismo año
    const isSameYear = (date1, date2) => {
        if (!date1 || !date2) return false;
        return new Date(date1).getFullYear() === new Date(date2).getFullYear();
    };

    if (employeePto.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                    </svg>
                </div>
                <p className="text-gray-500 text-sm font-medium">Sin vacaciones programadas</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">

            {/* Header de la tabla */}
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    <div className="col-span-5">Período</div>
                    <div className="col-span-4">Motivo</div>
                    <div className="col-span-3 text-center">Duración</div>
                </div>
            </div>

            {/* Filas de datos */}
            <div className="divide-y divide-gray-100">
                {employeePto.map((pto) => {
                    const days = getDaysBetween(pto.startDate, pto.terminationDate);
                    const isMultipleDays = days !== "-" && days > 1;
                    const sameYear = isSameYear(pto.startDate, pto.terminationDate);

                    return (
                        <div key={pto.id} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                            <div className="grid grid-cols-12 gap-2 items-center">

                                {/* Columna Período */}
                                <div className="col-span-5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-8 bg-purple-500 rounded-full flex-shrink-0"></div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                                                {isMultipleDays ? (
                                                    sameYear ? (
                                                        // Mismo año: mostrar formato compacto + año al final
                                                        <>
                                                            <span>{formatDateCompact(pto.startDate)}</span>
                                                            <svg className="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                            </svg>
                                                            <span>{formatDateCompact(pto.terminationDate)}</span>
                                                            <span className="text-xs text-purple-600 font-normal ml-1">
                                                                {new Date(pto.startDate).getFullYear()}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        // Diferentes años: mostrar año completo en ambas
                                                        <>
                                                            <span className="text-xs">{formatDate(pto.startDate)}</span>
                                                            <svg className="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                            </svg>
                                                            <span className="text-xs">{formatDate(pto.terminationDate)}</span>
                                                        </>
                                                    )
                                                ) : (
                                                    // Día único: mostrar fecha completa con año
                                                    <span>{formatDate(pto.startDate)}</span>
                                                )}
                                            </div>
                                            {!isMultipleDays && (
                                                <span className="text-xs text-gray-500">Día único</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Columna Motivo */}
                                <div className="col-span-4">
                                    <p className="text-sm text-gray-600 truncate" title={pto.absenceReason}>
                                        {pto.absenceReason}
                                    </p>
                                </div>

                                {/* Columna Duración */}
                                <div className="col-span-3 text-center">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${days === 1
                                            ? 'bg-blue-100 text-blue-800'
                                            : days > 7
                                                ? 'bg-purple-100 text-purple-800'
                                                : 'bg-indigo-100 text-indigo-800'
                                        }`}>
                                        {days === "-" ? "N/A" : `${days} día${days > 1 ? 's' : ''}`}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer con resumen */}
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                        Total de períodos: <span className="font-medium text-gray-900">{employeePto.length}</span>
                    </span>
                    <span className="text-gray-600">
                        Total de días: <span className="font-medium text-gray-900">
                            {employeePto.reduce((total, pto) => {
                                const days = getDaysBetween(pto.startDate, pto.terminationDate);
                                return total + (days === "-" ? 0 : days);
                            }, 0)}
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );
};
