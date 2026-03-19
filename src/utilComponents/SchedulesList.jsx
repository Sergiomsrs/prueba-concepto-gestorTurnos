import { formatMillisecondsToTime } from "../timeTrack/utilities/timeManagement"

export const SchedulesList = ({ processedRecords }) => {
    const getDayOfWeek = (dateString) => {
        const [day, month, year] = dateString.split("/");
        const date = new Date(`${year}-${month}-${day}`);
        const weekday = date.toLocaleDateString("es-ES", { weekday: "long" });
        return weekday.charAt(0).toUpperCase() + weekday.slice(1);
    };

    return (
        <div className="border rounded-lg overflow-hidden shadow-sm bg-gray-50">
            {/* --- VISTA MÓVIL (Cards) --- */}
            <div className="block md:hidden">
                {processedRecords.map((record, index) => {
                    const weekday = getDayOfWeek(record.data.day);
                    const isWeekend = weekday === "Sábado" || weekday === "Domingo";

                    return (
                        <div key={index} className={`p-4 border-b last:border-b-0 bg-white mb-2 ${isWeekend ? 'border-l-4 border-indigo-300' : ''}`}>
                            {/* Cabecera de la Card */}
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">{weekday}</span>
                                    <h4 className="text-lg font-bold text-gray-800">{record.data.day}</h4>
                                </div>
                                <div className="text-right">
                                    <span className="block text-xs text-gray-400 uppercase">Total</span>
                                    <span className="text-lg font-mono font-bold text-blue-600">
                                        {record.data.isDayOff ? "-" : record.data.totalWorked}
                                    </span>
                                </div>
                            </div>

                            {/* Contenido: Horarios */}
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                {record.data.isDayOff ? (
                                    <span className="text-green-600 font-medium flex items-center gap-2">
                                        🌴 Día libre
                                    </span>
                                ) : (
                                    <div className="space-y-3">
                                        {record.data.periods.map((period, i) => (
                                            <div key={i} className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-1 rounded font-semibold ${period.entryIsMod === "true" ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-white border'}`}>
                                                        {period.entry}
                                                    </span>
                                                    <span className="text-gray-400">→</span>
                                                    {period.exit ? (
                                                        <span className={`px-2 py-1 rounded font-semibold ${period.exitIsMod === "true" ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-white border'}`}>
                                                            {period.exit}
                                                        </span>
                                                    ) : (
                                                        <span className="text-amber-600 text-xs font-bold animate-pulse">FALTA SALIDA</span>
                                                    )}
                                                </div>
                                                {period.exit && (
                                                    <span className="text-gray-500 font-mono text-xs italic">
                                                        {formatMillisecondsToTime(period.durationMs)}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer de la Card */}
                            <div className="mt-3 flex justify-between items-center">
                                {record.data.warning && (
                                    <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-1 rounded flex items-center gap-1">
                                        ⚠️ {record.data.warning}
                                    </span>
                                )}
                                <span className="text-[10px] text-gray-400 ml-auto">
                                    Registros: {record.data.isDayOff ? "0" : record.data.recordsCount / 2}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* --- VISTA DESKTOP (Tabla original mejorada) --- */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-separate border-spacing-0">
                    <thead>
                        <tr>
                            <th className="py-3 px-4 text-left text-gray-600 font-bold bg-gray-100 border-b uppercase text-xs tracking-wider">Fecha</th>
                            <th className="py-3 px-4 text-left text-gray-600 font-bold bg-gray-100 border-b uppercase text-xs tracking-wider">Día</th>
                            <th className="py-3 px-4 text-left text-gray-600 font-bold bg-gray-100 border-b uppercase text-xs tracking-wider">Horario</th>
                            <th className="py-3 px-4 text-center text-gray-600 font-bold bg-gray-100 border-b uppercase text-xs tracking-wider">Total</th>
                            <th className="py-3 px-4 text-center text-gray-600 font-bold bg-gray-100 border-b uppercase text-xs tracking-wider">Registros</th>
                        </tr>
                    </thead>
                    <tbody>
                        {processedRecords.map((record, index) => {
                            const weekday = getDayOfWeek(record.data.day);
                            const isSaturday = weekday === "Sábado";
                            const isSunday = weekday === "Domingo";
                            const isWeekend = isSaturday || isSunday;

                            const weekendBg = isSaturday
                                ? "bg-emerald-50/30 border-l-4 border-emerald-300"
                                : isSunday
                                    ? "bg-violet-50/30 border-l-4 border-violet-300"
                                    : "bg-white";

                            return (
                                <tr key={index} className={`transition-colors border-b hover:bg-gray-50 ${weekendBg}`}>
                                    <td className="py-4 px-4 whitespace-nowrap border-b border-gray-100">
                                        <span className="font-medium text-gray-900">{record.data.day}</span>
                                        {record.data.warning && (
                                            <span className="block text-[10px] leading-tight text-yellow-600 mt-1 max-w-[120px]">
                                                {record.data.warning}
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap border-b border-gray-100 font-semibold text-gray-700">
                                        {weekday}
                                    </td>
                                    <td className="py-4 px-4 border-b border-gray-100">
                                        {record.data.isDayOff ? (
                                            <span className="text-green-600 font-medium">Día libre 🌴</span>
                                        ) : (
                                            <div className="flex flex-col gap-1">
                                                {record.data.periods.map((period, i) => (
                                                    <div key={i} className="flex items-center gap-2 text-sm">
                                                        <span className={`px-1.5 py-0.5 rounded ${period.entryIsMod === "true" ? 'bg-red-50 text-red-700 border border-red-200' : 'text-gray-700 border'}`}>
                                                            {period.entry}
                                                        </span>
                                                        <span className="text-gray-400">→</span>
                                                        {period.exit ? (
                                                            <>
                                                                <span className={`px-1.5 py-0.5 rounded ${period.exitIsMod === "true" ? 'bg-red-50 text-red-700 border border-red-200' : 'text-gray-700 border'}`}>
                                                                    {period.exit}
                                                                </span>
                                                                <span className="text-gray-400 text-xs italic">
                                                                    ({formatMillisecondsToTime(period.durationMs)})
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="text-amber-600 font-bold text-xs uppercase">Falta salida</span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-4 px-4 text-center font-bold text-blue-700 border-b border-gray-100">
                                        {record.data.isDayOff ? "-" : record.data.totalWorked}
                                    </td>
                                    <td className="py-4 px-4 text-center text-xs text-gray-500 border-b border-gray-100">
                                        {record.data.isDayOff ? "0" : record.data.recordsCount / 2}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
