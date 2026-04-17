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
        const weekday = date.toLocaleDateString("es-ES", { weekday: "short" });
        const dayNumber = date.getDay();
        const dayName = weekday.charAt(0).toUpperCase() + weekday.slice(1);

        return {
            name: dayName,
            isToday: dateString === todayStr,
            isWeekend: dayNumber === 0 || dayNumber === 6,
        };
    };

    const isDayFree = (record) => record.isDayOff || !record.periods?.length;

    if (!records.length) {
        return (
            <div className="border rounded-lg overflow-hidden shadow-sm bg-white mx-2 p-8 text-center text-sm text-gray-400">
                No hay turnos cargados para este periodo.
            </div>
        );
    }

    return (
        <div className="border rounded-lg overflow-hidden shadow-sm bg-white mx-2">

            {/* --- VISTA MÓVIL COMPACTA --- */}
            <div className="block md:hidden">
                {allDaysOfMonth.map((record) => {
                    const { name, isToday, isWeekend } = getDayInfo(record.day);
                    const free = isDayFree(record);

                    return (
                        <div
                            key={record.day}
                            className={`px-3 py-2 border-b last:border-b-0 flex items-center gap-3 ${isToday ? 'bg-amber-50' : isWeekend ? 'bg-indigo-100/40' : 'bg-white'
                                }`}
                        >
                            {/* Fecha y Día */}
                            <div className="flex flex-col items-center justify-center min-w-[50px] border-r pr-3">
                                <span className={`text-[10px] font-bold uppercase ${isToday ? 'text-amber-500' : isWeekend ? 'text-indigo-500' : 'text-gray-400'
                                    }`}>
                                    {name.replace('.', '')}
                                </span>
                                <span className="text-sm font-bold text-gray-800">
                                    {record.day.split('/')[0]}
                                </span>
                                {isToday && (
                                    <span className="text-[8px] font-bold text-amber-500 uppercase">hoy</span>
                                )}
                            </div>

                            {/* Info Principal */}
                            <div className="flex-1 min-w-0">
                                {free ? (
                                    <span className="text-xs text-green-600 font-medium italic">Día libre</span>
                                ) : (
                                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                                        {record.periods.map((period, i) => (
                                            <div key={i} className="flex items-center text-[13px]">
                                                <span className={period.entryIsMod === "true" ? 'text-red-600 font-bold' : 'text-gray-700'}>
                                                    {period.entry}
                                                </span>
                                                <span className="mx-1 text-gray-400 text-[10px]">→</span>
                                                {period.exit ? (
                                                    <span className={period.exitIsMod === "true" ? 'text-red-600 font-bold' : 'text-gray-700'}>
                                                        {period.exit}
                                                    </span>
                                                ) : (
                                                    <span className="text-amber-600 text-[10px] font-bold">...</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Total */}
                            <div className="text-right pl-2">
                                <span className="block text-[10px] text-gray-400 leading-none">HRS</span>
                                {free ? (
                                    <span className="text-sm font-mono font-bold text-gray-300">—</span>
                                ) : (
                                    <span className="text-sm font-mono font-bold text-blue-600">
                                        {record.totalWorked}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* --- VISTA DESKTOP --- */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-separate border-spacing-0">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 text-left text-gray-500 font-semibold bg-gray-50 border-b uppercase text-[11px]">Fecha</th>
                            <th className="py-2 px-4 text-left text-gray-500 font-semibold bg-gray-50 border-b uppercase text-[11px]">Día</th>
                            <th className="py-2 px-4 text-left text-gray-500 font-semibold bg-gray-50 border-b uppercase text-[11px]">Horarios</th>
                            <th className="py-2 px-4 text-center text-gray-500 font-semibold bg-gray-50 border-b uppercase text-[11px]">Total</th>
                            <th className="py-2 px-4 text-center text-gray-500 font-semibold bg-gray-50 border-b uppercase text-[11px]">Reg.</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {allDaysOfMonth.map((record) => {
                            const { name, isToday, isWeekend } = getDayInfo(record.day);
                            const free = isDayFree(record);

                            return (
                                <tr
                                    key={record.day}
                                    className={`hover:bg-gray-50/80 transition-colors ${isToday ? 'bg-amber-50' : isWeekend ? 'bg-indigo-100/40' : ''
                                        }`}
                                >
                                    <td className="py-2 px-4 text-sm font-medium text-gray-600">
                                        {record.day}
                                        {isToday && (
                                            <span className="ml-2 text-[9px] font-bold text-amber-500 uppercase">● hoy</span>
                                        )}
                                    </td>
                                    <td className={`py-2 px-4 text-sm ${isWeekend ? 'text-indigo-500 font-medium' : 'text-gray-500'}`}>
                                        {name}
                                    </td>
                                    <td className="py-2 px-4">
                                        {free ? (
                                            <span className="text-xs text-green-600 italic">Día libre</span>
                                        ) : (
                                            <div className="flex gap-4">
                                                {record.periods.map((period, i) => (
                                                    <span key={i} className="text-sm flex items-center gap-1">
                                                        <b className={period.entryIsMod === "true" ? "text-red-500" : ""}>
                                                            {period.entry}
                                                        </b>
                                                        <span className="text-gray-300">|</span>
                                                        <b className={period.exitIsMod === "true" ? "text-red-500" : ""}>
                                                            {period.exit || '??'}
                                                        </b>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-2 px-4 text-center font-mono font-bold">
                                        {free ? (
                                            <span className="text-gray-300">—</span>
                                        ) : (
                                            <span className="text-blue-600">{record.totalWorked}</span>
                                        )}
                                    </td>
                                    <td className="py-2 px-4 text-center text-xs">
                                        {free ? (
                                            <span className="text-gray-300">—</span>
                                        ) : (
                                            <span className="text-gray-400">{record.periodCount}</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};