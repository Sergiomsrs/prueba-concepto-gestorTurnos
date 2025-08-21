import { formatMillisecondsToTime } from "../timeTrack/utilities/timeManagement"

export const SchedulesList = ({ processedRecords }) => {
    const getDayOfWeek = (dateString) => {
        const [day, month, year] = dateString.split("/");
        const date = new Date(`${year}-${month}-${day}`);
        const weekday = date.toLocaleDateString("es-ES", { weekday: "long" });
        return weekday.charAt(0).toUpperCase() + weekday.slice(1);
    };

    return (
        <div className="overflow-x-auto border rounded">
            <table className="w-full border-separate border-spacing-0">
                <thead>
                    <tr>
                        <th className="py-2 px-4 text-left text-gray-700 font-semibold bg-gray-100 border-b">Fecha</th>
                        <th className="py-2 px-4 text-left text-gray-700 font-semibold bg-gray-100 border-b">Día</th>
                        <th className="py-2 px-4 text-left text-gray-700 font-semibold bg-gray-100 border-b">Horario</th>
                        <th className="py-2 px-4 text-center text-gray-700 font-semibold bg-gray-100 border-b">Total</th>
                        <th className="py-2 px-4 text-center text-gray-700 font-semibold bg-gray-100 border-b">Registros</th>
                    </tr>
                </thead>
                <tbody>
                    {processedRecords.map((record, index) => {
                        const weekday = getDayOfWeek(record.data.day);
                        const isSaturday = weekday === "Sábado";
                        const isSunday = weekday === "Domingo";
                        const isWeekend = isSaturday || isSunday;

                        // Colores suaves y coherentes para sábado y domingo
                        const weekendBg = isSaturday
                            ? "bg-gray-50 border-l-4 border-emerald-300"
                            : isSunday
                                ? "bg-gray-50 border-l-4 border-violet-300"
                                : "bg-white";

                        // Hover solo para días laborables
                        const hoverBg = !isWeekend ? "hover:bg-gray-100" : "";

                        return (
                            <tr
                                key={index}
                                className={`transition-colors ${weekendBg} ${hoverBg}`}
                            >
                                {/* Columna fecha */}
                                <td className="py-3 px-4 whitespace-nowrap border-b border-gray-200">
                                    {record.data.day}
                                    {record.data.warning && (
                                        <span className="block text-xs text-yellow-600 mt-1">
                                            {record.data.warning}
                                        </span>
                                    )}
                                </td>

                                {/* Columna día de la semana */}
                                <td className={`py-3 px-4 whitespace-nowrap border-b border-gray-200 font-semibold `}>
                                    {weekday}
                                </td>

                                {/* Columna horarios */}
                                <td className="py-3 px-4 border-b border-gray-200">
                                    {record.data.isDayOff ? (
                                        <span className="text-green-600 font-medium">
                                            Día libre 🌴
                                        </span>
                                    ) : (
                                        record.data.periods.map((period, i) => (
                                            <div
                                                key={i}
                                                className={`mb-2 last:mb-0 ${!period.isComplete ? 'text-amber-600' : ''}`}
                                            >
                                                <span className="flex items-center gap-1 text-sm flex-wrap">
                                                    {/* Entrada */}
                                                    <span className="inline-flex">
                                                        <span
                                                            className={`font-medium px-1 rounded ${period.entryIsMod === "true"
                                                                ? 'border border-red-500 text-red-700'
                                                                : ''
                                                                }`}
                                                        >
                                                            {period.entry}
                                                        </span>
                                                    </span>

                                                    <span className="text-gray-500 mx-1 ">→</span>

                                                    {/* Salida */}
                                                    {period.exit ? (
                                                        <>
                                                            <span className="inline-flex">
                                                                <span
                                                                    className={`font-medium px-1 rounded ${period.exitIsMod === "true"
                                                                        ? 'border border-red-500 text-red-700'
                                                                        : ''
                                                                        }`}
                                                                >
                                                                    {period.exit}
                                                                </span>
                                                            </span>

                                                            <span className="text-gray-500 ml-1 whitespace-nowrap">
                                                                ({formatMillisecondsToTime(period.durationMs)})
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="text-amber-600 font-bold ml-2">
                                                            (Falta Registro)
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </td>

                                {/* Total trabajado */}
                                <td className="py-3 px-4 text-center font-medium border-b border-gray-200">
                                    {record.data.isDayOff ? "-" : record.data.totalWorked}
                                </td>

                                {/* Nº de registros */}
                                <td className="py-3 px-4 text-center text-sm text-gray-500 border-b border-gray-200">
                                    {record.data.isDayOff ? "0" : record.data.recordsCount/2}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    )
}
