import React, { useMemo } from "react";

export const SchedulesList = ({ records = [] }) => {
    const todayStr = new Date().toLocaleDateString("es-ES");

    const allDaysOfMonth = useMemo(() => {
        if (records.length === 0) return [];

        const [, monthPart, yearPart] = records[0].day.split("/");
        const year = parseInt(yearPart);
        const month = parseInt(monthPart) - 1;

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const recordsMap = new Map(records.map(r => [r.day, r]));

        return Array.from({ length: daysInMonth }, (_, i) => {
            const dayStr = `${String(i + 1).padStart(2, "0")}/${String(month + 1).padStart(2, "0")}/${year}`;

            return recordsMap.get(dayStr) || {
                day: dayStr,
                isDayOff: true,
                periods: [],
                totalWorked: "00:00",
                periodCount: 0
            };
        });
    }, [records]);

    const getDayInfo = (dateString) => {
        const [day, month, year] = dateString.split("/");
        const date = new Date(`${year}-${month}-${day}`);
        const weekday = date.toLocaleDateString("es-ES", { weekday: "long" });
        const dayNumber = date.getDay();

        // Formatear nombre del día: primera letra mayúscula, resto minúscula
        const dayName = weekday.charAt(0).toUpperCase() + weekday.slice(1);

        return {
            name: dayName,
            shortName: dayName.substring(0, 3),
            isToday: dateString === todayStr,
            isWeekend: dayNumber === 0 || dayNumber === 6,
            isMonday: dayNumber === 1,
            isFriday: dayNumber === 5
        };
    };

    // Componente de turno individual - MUY VISUAL
    const ShiftCard = ({ p, isWeekend }) => (
        <div className={`group relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isWeekend
            ? 'bg-white/90 backdrop-blur-sm border-2 border-indigo-200 shadow-md'
            : 'bg-white border border-gray-200 shadow-sm hover:shadow-md'
            }`}>
            {/* Indicador de modificación */}
            {(p.entryIsMod === "true" || p.exitIsMod === "true") && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            )}

            {/* Hora de entrada */}
            <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-wider text-gray-400">Entrada</span>
                <span className={`font-mono font-bold text-base ${p.entryIsMod === "true" ? "text-orange-600" : "text-gray-700"}`}>
                    {p.entry}
                </span>
            </div>

            {/* Flecha decorativa */}
            <div className="text-indigo-300 text-lg font-light">→</div>

            {/* Hora de salida */}
            <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-wider text-gray-400">Salida</span>
                <span className={`font-mono font-bold text-base ${p.exitIsMod === "true" ? "text-orange-600" : "text-gray-700"}`}>
                    {p.exit || "--:--"}
                </span>
            </div>
        </div>
    );

    if (!records.length) {
        return (
            <div className="flex flex-col items-center justify-center p-16 text-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 rounded-2xl border-2 border-dashed border-indigo-200">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-1">No hay turnos cargados</h3>
                <p className="text-sm text-gray-400">Todavía no hay datos para este periodo</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Versión Desktop - Tabla moderna */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                {/* Cabecera con estilo tipo "dashboard" */}


                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b-2 border-gray-100">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Día</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Horarios</th>
                                <th className="text-center px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                                <th className="text-center px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">#</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {allDaysOfMonth.map((record) => {
                                const { name, shortName, isToday, isWeekend, isMonday, isFriday } = getDayInfo(record.day);

                                // Estilos según el día
                                let rowBg = "hover:bg-gray-50 transition-colors";
                                let dateColor = "text-gray-800";
                                let dayBadge = "";

                                if (isToday) {
                                    rowBg = "bg-gradient-to-r from-amber-50 to-yellow-50";
                                    dateColor = "text-amber-700";
                                    dayBadge = "bg-amber-100 text-amber-700";
                                } else if (isWeekend) {
                                    rowBg = "bg-indigo-50/30";
                                    dayBadge = "bg-indigo-100 text-indigo-600";
                                } else if (isMonday || isFriday) {
                                    dayBadge = "bg-gray-100 text-gray-600";
                                }

                                return (
                                    <tr key={record.day} className={rowBg}>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className={`font-bold text-base ${dateColor}`}>
                                                    {record.day.split("/")[0]}
                                                </span>
                                                <span className="text-[10px] text-gray-400">
                                                    {record.day.split("/").slice(1).join("/")}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className={`font-semibold ${isWeekend ? "text-indigo-600" : "text-gray-700"}`}>
                                                    {name}
                                                </span>
                                                {isToday && (
                                                    <span className="text-[9px] font-bold text-amber-600 mt-0.5">● HOY</span>
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            {record.isDayOff ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                    <span className="font-semibold text-emerald-700">Descanso</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-wrap gap-2">
                                                    {record.periods?.map((p, i) => (
                                                        <ShiftCard key={i} p={p} isWeekend={isWeekend} />
                                                    ))}
                                                </div>
                                            )}
                                        </td>

                                        <td className="text-center px-6 py-4">
                                            {!record.isDayOff && (
                                                <div className="inline-flex flex-col items-center">
                                                    <span className="font-mono font-black text-indigo-700 text-lg">
                                                        {record.totalWorked}
                                                    </span>
                                                    <span className="text-[9px] text-gray-400">horas</span>
                                                </div>
                                            )}
                                        </td>

                                        <td className="text-center px-6 py-4">
                                            {!record.isDayOff && (
                                                <span className="inline-flex items-center justify-center w-7 h-7 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
                                                    {record.periodCount}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Versión Móvil - Tarjetas estilo "feed" */}
            <div className="lg:hidden space-y-3">
                {allDaysOfMonth.map((record) => {
                    const { name, isToday, isWeekend } = getDayInfo(record.day);

                    let cardBg = "bg-white";
                    let borderColor = "border-gray-200";

                    if (isToday) {
                        cardBg = "bg-gradient-to-br from-amber-50 to-yellow-50";
                        borderColor = "border-amber-200";
                    } else if (isWeekend) {
                        cardBg = "bg-gradient-to-br from-indigo-50/50 to-blue-50/50";
                        borderColor = "border-indigo-200";
                    }

                    return (
                        <div
                            key={record.day}
                            className={`${cardBg} rounded-2xl border ${borderColor} shadow-sm overflow-hidden transition-all hover:shadow-md`}
                        >
                            {/* Cabecera de la tarjeta */}
                            <div className="px-5 pt-4 pb-2 border-b border-gray-100 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    {/* Número del día grande */}
                                    <div className={`text-3xl font-black ${isToday ? "text-amber-600" : isWeekend ? "text-indigo-600" : "text-gray-700"}`}>
                                        {record.day.split("/")[0]}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`font-semibold text-sm ${isWeekend ? "text-indigo-600" : "text-gray-600"}`}>
                                            {name}
                                        </span>
                                        <span className="text-[10px] text-gray-400">
                                            {record.day.split("/").slice(1).join("/")}
                                        </span>
                                    </div>
                                </div>

                                {isToday && (
                                    <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold">
                                        Hoy
                                    </span>
                                )}
                            </div>

                            {/* Contenido */}
                            <div className="p-5">
                                {record.isDayOff ? (
                                    <div className="flex items-center justify-center gap-3 py-6">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                                            <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-bold text-emerald-700 text-lg">Día de descanso</p>
                                            <p className="text-xs text-gray-400">Sin turnos asignados</p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {/* Turnos */}
                                        <div className="space-y-2 mb-4">
                                            {record.periods?.map((p, i) => (
                                                <ShiftCard key={i} p={p} isWeekend={isWeekend} />
                                            ))}
                                        </div>

                                        {/* Totales */}
                                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-500">Total trabajado</span>
                                                <span className="font-mono font-black text-indigo-700 text-xl">
                                                    {record.totalWorked}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="text-xs text-gray-500">Registros</span>
                                                <span className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold">
                                                    {record.periodCount}
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Leyenda / Resumen rápido - Solo visible en móvil si se desea */}
            <div className="lg:hidden mt-4 p-4 bg-gray-50 rounded-xl text-center">
                <div className="flex justify-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                        <span className="text-gray-500">Turno modificado</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-gray-500">Descanso</span>
                    </div>
                </div>
            </div>
        </div>
    );
};