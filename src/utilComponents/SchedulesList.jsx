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

    const getDayOfWeek = (dateString) => {
        const [day, month, year] = dateString.split("/");
        const date = new Date(`${year}-${month}-${day}`);

        const weekday = date.toLocaleDateString("es-ES", { weekday: "short" });

        return {
            name: weekday.charAt(0).toUpperCase() + weekday.slice(1).replace(".", ""),
            isToday: dateString === todayStr
        };
    };

    const PeriodChip = ({ p }) => (
        <div className="flex items-center gap-2 px-2 py-1 rounded-full border border-gray-100 bg-gray-50 text-xs font-medium">
            <span className={p.entryIsMod === "true" ? "text-red-500 font-semibold" : "text-gray-700"}>
                {p.entry}
            </span>
            <span className="text-gray-300">→</span>
            <span className={p.exitIsMod === "true" ? "text-red-500 font-semibold" : "text-gray-700"}>
                {p.exit || "--"}
            </span>
        </div>
    );

    if (!records.length) {
        return (
            <div className="p-10 text-center border rounded-2xl bg-gray-50 text-gray-400">
                No hay datos disponibles para este periodo
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            {/* TABLE */}
            <div className="overflow-x-auto hidden md:block">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-400">
                        <tr>
                            <th className="text-left px-6 py-3">Fecha</th>
                            <th className="text-left px-6 py-3">Día</th>
                            <th className="text-left px-6 py-3">Horarios</th>
                            <th className="text-center px-6 py-3">Total</th>
                            <th className="text-center px-6 py-3">Registros</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {allDaysOfMonth.map((record) => {
                            const { name, isToday } = getDayOfWeek(record.day);

                            return (
                                <tr
                                    key={record.day}
                                    className={`transition hover:bg-gray-50 ${isToday ? "bg-indigo-50/40" : ""
                                        }`}
                                >
                                    <td className="px-6 py-3 font-medium text-gray-700">
                                        <div className="flex flex-col">
                                            <span>{record.day}</span>
                                            {isToday && (
                                                <span className="text-[10px] text-indigo-500 font-semibold">
                                                    HOY
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-6 py-3 text-gray-500 capitalize">
                                        {name}
                                    </td>

                                    <td className="px-6 py-3">
                                        {record.isDayOff ? (
                                            <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 font-medium">
                                                Día libre
                                            </span>
                                        ) : (
                                            <div className="flex flex-wrap gap-2">
                                                {record.periods?.map((p, i) => (
                                                    <PeriodChip key={i} p={p} />
                                                ))}
                                            </div>
                                        )}
                                    </td>

                                    <td className="text-center px-6 py-3 font-mono font-semibold text-gray-700">
                                        {record.isDayOff ? "-" : record.totalWorked}
                                    </td>

                                    <td className="text-center px-6 py-3 text-gray-400 text-xs">
                                        {record.isDayOff ? 0 : record.periodCount}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* MOBILE */}
            <div className="md:hidden divide-y divide-gray-100">
                {allDaysOfMonth.map((record) => {
                    const { name, isToday } = getDayOfWeek(record.day);

                    return (
                        <div
                            key={record.day}
                            className={`p-4 ${isToday ? "bg-indigo-50/40" : ""}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="font-semibold text-gray-700">
                                        {record.day}
                                    </div>
                                    <div className="text-xs text-gray-400 capitalize">
                                        {name}
                                    </div>
                                </div>

                                <div className="text-right font-mono text-sm font-semibold">
                                    {record.isDayOff ? "-" : record.totalWorked}
                                </div>
                            </div>

                            {record.isDayOff ? (
                                <span className="text-xs text-emerald-600 font-medium">
                                    Día libre
                                </span>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {record.periods?.map((p, i) => (
                                        <PeriodChip key={i} p={p} />
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};