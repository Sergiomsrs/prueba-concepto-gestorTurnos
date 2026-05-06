import React, { useMemo, useState } from "react";

const STATUS_DOT = {
    OK: { color: "bg-green-400", label: "Fichajes correctos" },
    INCIDENCIA: { color: "bg-amber-400", label: "Incidencia en fichajes" },
    SIN_FICHAJES: { color: "bg-red-400", label: "Sin fichajes" },
    SIN_TURNO: { color: "bg-gray-300", label: "Día libre" },
    PENDIENTE: { color: "bg-gray-300", label: "Turno pendiente" },
    FICHAJE_SIN_TURNO: { color: "bg-red-400", label: "Fichaje sin turno asignado" },
};

const formatTimestamp = (ts) => {
    if (!ts) return null;
    return new Date(ts.timestamp).toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
    });
};

const PeriodDetail = ({ period }) => {
    const entryTime = formatTimestamp(period.entryTimestamp);
    const exitTime = formatTimestamp(period.exitTimestamp);
    const entryMod = period.entryTimestamp?.isMod === "true";
    const exitMod = period.exitTimestamp?.isMod === "true";

    return (
        <div className="flex items-center gap-3 py-1">
            <span className="text-[11px] text-gray-400 w-20">
                {period.entry} → {period.exit}
            </span>
            <span className="text-[11px] text-gray-400">Fichajes:</span>
            <span className={`text-[12px] font-mono font-bold ${entryMod ? "text-red-500" : "text-gray-600"}`}>
                {period.entradaSaltada
                    ? <span className="text-emerald-400 italic text-[11px]">##</span>
                    : entryTime ?? <span className="text-red-400">no fichó</span>
                }
            </span>
            <span className="text-gray-300 text-[10px]">→</span>
            <span className={`text-[12px] font-mono font-bold ${exitMod ? "text-red-500" : "text-gray-600"}`}>
                {period.salidaSaltada
                    ? <span className="text-emerald-400 italic text-[11px]">##</span>
                    : exitTime ?? <span className="text-red-400">no fichó</span>
                }
            </span>
            {(entryMod || exitMod) && (
                <span className="text-[10px] text-red-400 italic">modificado</span>
            )}
        </div>
    );
};

const FichajesSinTurnoDetail = ({ fichajes }) => (
    <div className="flex flex-col gap-1">
        <span className="text-[11px] text-red-400 font-medium mb-1">Fichajes sin turno asignado</span>
        {fichajes.map((f, i) => {
            const time = new Date(f.timestamp).toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
            });
            const isMod = f.isMod === "true";
            return (
                <div key={i} className="flex items-center gap-3 py-1">
                    <span className="text-[12px] font-mono font-bold text-gray-400">#{i + 1}</span>
                    <span className={`text-[12px] font-mono font-bold ${isMod ? "text-red-500" : "text-gray-600"}`}>
                        {time}
                    </span>
                    {isMod && <span className="text-[10px] text-red-400 italic">modificado</span>}
                </div>
            );
        })}
    </div>
);

export const SchedulesList = ({ records = [] }) => {
    const todayStr = new Date().toLocaleDateString("es-ES");
    const [expandedDay, setExpandedDay] = useState(null);

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
                fichajesSinTurno: [],
                totalWorked: "00:00",
                periodCount: 0,
                status: "SIN_TURNO",
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

    const isExpandable = (free, status, record) => {
        if (status === "FICHAJE_SIN_TURNO") return true;
        return !free && status !== "PENDIENTE";
    };

    const toggleExpand = (day) => {
        setExpandedDay(prev => prev === day ? null : day);
    };

    const StatusDot = ({ status }) => {
        const dot = STATUS_DOT[status] || STATUS_DOT.SIN_TURNO;
        return (
            <span
                className={`inline-block w-2.5 h-2.5 rounded-full ${dot.color} flex-shrink-0`}
                title={dot.label}
            />
        );
    };

    if (!records.length) {
        return (
            <div className="border rounded-lg overflow-hidden shadow-sm bg-white mx-2 p-8 text-center text-sm text-gray-400">
                No hay turnos cargados para este periodo.
            </div>
        );
    }

    return (
        <div className="border rounded-lg overflow-hidden shadow-sm bg-white mx-2">

            {/* --- VISTA MÓVIL --- */}
            <div className="block md:hidden">
                {allDaysOfMonth.map((record) => {
                    const { name, isToday, isWeekend } = getDayInfo(record.day);
                    const free = isDayFree(record);
                    const isExpanded = expandedDay === record.day;
                    const status = record.status || (free ? "SIN_TURNO" : "OK");
                    const expandable = isExpandable(free, status, record);
                    const tieneFichajesSinTurno = status === "FICHAJE_SIN_TURNO" && record.fichajesSinTurno?.length > 0;

                    return (
                        <div key={record.day} className="border-b last:border-b-0">
                            <div
                                className={`px-3 py-2 flex items-center gap-3 select-none
                                    ${expandable ? "cursor-pointer active:bg-gray-50" : ""}
                                    ${isToday ? "bg-amber-50" : isWeekend ? "bg-indigo-100/40" : "bg-white"}`}
                                onClick={() => expandable && toggleExpand(record.day)}
                            >
                                {/* Fecha */}
                                <div className="flex flex-col items-center justify-center min-w-[50px] border-r pr-3">
                                    <span className={`text-[10px] font-bold uppercase ${isToday ? "text-amber-500" : isWeekend ? "text-indigo-500" : "text-gray-400"}`}>
                                        {name.replace(".", "")}
                                    </span>
                                    <span className="text-sm font-bold text-gray-800">{record.day.split("/")[0]}</span>
                                    {isToday && <span className="text-[8px] font-bold text-amber-500 uppercase">hoy</span>}
                                </div>

                                {/* Dot de estado */}
                                {(tieneFichajesSinTurno || (!free && status !== "PENDIENTE")) && (
                                    <StatusDot status={status} />
                                )}

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    {tieneFichajesSinTurno ? (
                                        <span className="text-xs text-red-400 font-medium italic">Día libre · fichajes registrados</span>
                                    ) : free ? (
                                        <span className="text-xs text-green-600 font-medium italic">Día libre</span>
                                    ) : (
                                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                                            {record.periods.map((period, i) => (
                                                <div key={i} className="flex items-center text-[13px]">
                                                    <span className="text-gray-700">{period.entry}</span>
                                                    <span className="mx-1 text-gray-400 text-[10px]">→</span>
                                                    <span className="text-gray-700">{period.exit || "..."}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Total + chevron */}
                                <div className="text-right pl-2 flex items-center gap-2">
                                    <div>
                                        <span className="block text-[10px] text-gray-400 leading-none">HRS</span>
                                        {free ? (
                                            <span className="text-sm font-mono font-bold text-gray-300">—</span>
                                        ) : (
                                            <span className="text-sm font-mono font-bold text-blue-600">{record.totalWorked}</span>
                                        )}
                                    </div>
                                    {expandable && (
                                        <span className={`text-gray-400 text-xs transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>▾</span>
                                    )}
                                </div>
                            </div>

                            {/* Detalle expandido móvil */}
                            {isExpanded && expandable && (
                                <div className="px-4 pb-3 pt-1 bg-gray-50 border-t border-gray-100">
                                    {tieneFichajesSinTurno ? (
                                        <FichajesSinTurnoDetail fichajes={record.fichajesSinTurno} />
                                    ) : (
                                        record.periods.map((period, i) => (
                                            <PeriodDetail key={i} period={period} />
                                        ))
                                    )}
                                </div>
                            )}
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
                            <th className="py-2 px-4 text-left text-gray-500 font-semibold bg-gray-50 border-b uppercase text-[11px] w-6"></th>
                            <th className="py-2 px-4 text-left text-gray-500 font-semibold bg-gray-50 border-b uppercase text-[11px]">Horarios</th>
                            <th className="py-2 px-4 text-center text-gray-500 font-semibold bg-gray-50 border-b uppercase text-[11px]">Total</th>
                            <th className="py-2 px-4 text-center text-gray-500 font-semibold bg-gray-50 border-b uppercase text-[11px]">Reg.</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allDaysOfMonth.map((record) => {
                            const { name, isToday, isWeekend } = getDayInfo(record.day);
                            const free = isDayFree(record);
                            const isExpanded = expandedDay === record.day;
                            const status = record.status || (free ? "SIN_TURNO" : "OK");
                            const expandable = isExpandable(free, status, record);
                            const tieneFichajesSinTurno = status === "FICHAJE_SIN_TURNO" && record.fichajesSinTurno?.length > 0;

                            return (
                                <React.Fragment key={record.day}>
                                    <tr
                                        className={`hover:bg-gray-50/80 transition-colors
                                            ${expandable ? "cursor-pointer" : ""}
                                            ${isToday ? "bg-amber-50" : isWeekend ? "bg-indigo-100/40" : ""}`}
                                        onClick={() => expandable && toggleExpand(record.day)}
                                    >
                                        <td className="py-2 px-4 text-sm font-medium text-gray-600 border-b border-gray-100">
                                            {record.day}
                                            {isToday && <span className="ml-2 text-[9px] font-bold text-amber-500 uppercase">● hoy</span>}
                                        </td>
                                        <td className={`py-2 px-4 text-sm border-b border-gray-100 ${isWeekend ? "text-indigo-500 font-medium" : "text-gray-500"}`}>
                                            {name}
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-100">
                                            {(tieneFichajesSinTurno || (!free && status !== "PENDIENTE")) && (
                                                <StatusDot status={status} />
                                            )}
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-100">
                                            {tieneFichajesSinTurno ? (
                                                <span className="text-xs text-red-400 italic">Día libre · fichajes registrados</span>
                                            ) : free ? (
                                                <span className="text-xs text-green-600 italic">Día libre</span>
                                            ) : (
                                                <div className="flex gap-4">
                                                    {record.periods.map((period, i) => (
                                                        <span key={i} className="text-sm flex items-center gap-1 text-gray-700">
                                                            {period.entry}
                                                            <span className="text-gray-300">|</span>
                                                            {period.exit || "??"}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-2 px-4 text-center font-mono font-bold border-b border-gray-100">
                                            {free ? <span className="text-gray-300">—</span> : <span className="text-blue-600">{record.totalWorked}</span>}
                                        </td>
                                        <td className="py-2 px-4 text-center text-xs border-b border-gray-100">
                                            {free && !tieneFichajesSinTurno ? (
                                                <span className="text-gray-300">—</span>
                                            ) : (
                                                <span className="text-gray-400 flex items-center justify-center gap-1">
                                                    {tieneFichajesSinTurno ? record.fichajesSinTurno.length : record.periodCount}
                                                    {expandable && (
                                                        <span className={`text-[10px] transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>▾</span>
                                                    )}
                                                </span>
                                            )}
                                        </td>
                                    </tr>

                                    {/* Detalle expandido desktop */}
                                    {isExpanded && expandable && (
                                        <tr className={isToday ? "bg-amber-50/60" : isWeekend ? "bg-indigo-50/40" : "bg-gray-50/60"}>
                                            <td colSpan={6} className="px-8 py-3 border-b border-gray-100">
                                                {tieneFichajesSinTurno ? (
                                                    <FichajesSinTurnoDetail fichajes={record.fichajesSinTurno} />
                                                ) : (
                                                    <div className="flex flex-col gap-1">
                                                        {record.periods.map((period, i) => (
                                                            <PeriodDetail key={i} period={period} />
                                                        ))}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};