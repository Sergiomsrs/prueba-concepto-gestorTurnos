import { formatMillisecondsToTime } from "../timeTrack/utilities/timeManagement"

export const SchedulesList = ({ processedRecords }) => {
    const getDayOfWeek = (dateString) => {
        const [day, month, year] = dateString.split("/");
        const date = new Date(`${year}-${month}-${day}`);
        const weekday = date.toLocaleDateString("es-ES", { weekday: "short" }); // "lun.", "mar."
        return weekday.charAt(0).toUpperCase() + weekday.slice(1);
    };

    return (
        <div className="border rounded-lg overflow-hidden shadow-sm bg-white mx-2">
            {/* --- VISTA MÓVIL COMPACTA --- */}
            <div className="block md:hidden">
                {processedRecords.map((record, index) => {
                    const weekday = getDayOfWeek(record.data.day);
                    const isWeekend = weekday.includes("Sáb") || weekday.includes("Dom");

                    return (
                        <div key={index} className={`px-3 py-2 border-b last:border-b-0 flex items-center gap-3 ${isWeekend ? 'bg-indigo-100/40' : 'bg-white'}`}>

                            {/* Fecha y Día (Columna fija a la izquierda) */}
                            <div className="flex flex-col items-center justify-center min-w-[50px] border-r pr-3">
                                <span className={`text-[10px] font-bold uppercase ${isWeekend ? 'text-indigo-500' : 'text-gray-400'}`}>
                                    {weekday.replace('.', '')}
                                </span>
                                <span className="text-sm font-bold text-gray-800">
                                    {record.data.day.split('/')[0]}
                                </span>
                            </div>

                            {/* Info Principal (Centro) */}
                            <div className="flex-1 min-w-0">
                                {record.data.isDayOff ? (
                                    <span className="text-xs text-green-600 font-medium italic">Día libre</span>
                                ) : (
                                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                                        {record.data.periods.map((period, i) => (
                                            <div key={i} className="flex items-center text-[13px]">
                                                <span className={`${period.entryIsMod === "true" ? 'text-red-600 font-bold' : 'text-gray-700'}`}>
                                                    {period.entry}
                                                </span>
                                                <span className="mx-1 text-gray-400 text-[10px]">→</span>
                                                {period.exit ? (
                                                    <span className={`${period.exitIsMod === "true" ? 'text-red-600 font-bold' : 'text-gray-700'}`}>
                                                        {period.exit}
                                                    </span>
                                                ) : (
                                                    <span className="text-amber-600 text-[10px] font-bold">...</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {/* Warning muy pequeño abajo si existe */}
                                {record.data.warning && (
                                    <span className="block text-[9px] text-amber-700 truncate">
                                        ⚠️ {record.data.warning}
                                    </span>
                                )}
                            </div>

                            {/* Total Trabajado (Derecha) */}
                            <div className="text-right pl-2">
                                <span className="block text-[10px] text-gray-400 leading-none">HRS</span>
                                <span className="text-sm font-mono font-bold text-blue-600">
                                    {record.data.isDayOff ? "-" : record.data.totalWorked}
                                </span>
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
                        {processedRecords.map((record, index) => {
                            const weekday = getDayOfWeek(record.data.day);
                            const isWeekend = weekday.includes("Sáb") || weekday.includes("Dom");

                            return (
                                <tr key={index} className={`hover:bg-gray-50/80 transition-colors ${isWeekend ? 'bg-indigo-100/40' : ''}`}>
                                    <td className="py-2 px-4 text-sm font-medium text-gray-600">{record.data.day}</td>
                                    <td className="py-2 px-4 text-sm text-gray-500">{weekday}</td>
                                    <td className="py-2 px-4">
                                        {record.data.isDayOff ? (
                                            <span className="text-xs text-green-600">Día libre</span>
                                        ) : (
                                            <div className="flex gap-4">
                                                {record.data.periods.map((period, i) => (
                                                    <span key={i} className="text-sm flex items-center gap-1">
                                                        <b className={period.entryIsMod === "true" ? "text-red-500" : ""}>{period.entry}</b>
                                                        <span className="text-gray-300">|</span>
                                                        <b className={period.exitIsMod === "true" ? "text-red-500" : ""}>{period.exit || '??'}</b>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-2 px-4 text-center font-mono font-bold text-blue-600">{record.data.isDayOff ? "-" : record.data.totalWorked}</td>
                                    <td className="py-2 px-4 text-center text-xs text-gray-400">{record.data.isDayOff ? "0" : record.data.recordsCount / 2}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
