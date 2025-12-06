import { useMemo, memo, useContext } from "react";
import { daysOfWeek } from "../../utils/data";
import { AppContext } from "../../context/AppContext";

// 🔹 Utilidad para calcular horas - MOVIDA FUERA para evitar recreación
const calculateShiftDurationFromWorkShift = (workShift) => {
    if (!workShift) return 0;
    const workCount = workShift.filter((block) => block === "WORK").length;
    return (workCount * 15) / 60;
};

// 🔹 Utilidad totales - MOVIDA FUERA
const getTotalShiftDuration = (employeeName, data) => {
    let totalMinutes = 0;
    for (const day of data) {
        const emp = day.employees.find((e) => e.name === employeeName);
        if (emp?.workShift) {
            const workCount = emp.workShift.filter((block) => block === "WORK").length;
            totalMinutes += workCount * 15;
        }
    }
    return +(totalMinutes / 60).toFixed(1);
};

// 🔹 Estilo BINARIO - MOVIDA FUERA
const getCellStyle = (hours, isHoliday) => {
    if (hours > 0) return "bg-emerald-600 text-white font-medium hover:bg-emerald-500";
    if (isHoliday) return "bg-slate-100 text-slate-300 border border-purple-200";
    return "bg-slate-50 text-slate-200 hover:bg-slate-100";
};

// 🔹 Componente de celda de día - MEMOIZADO
const DayCell = memo(({ day, employeeName, dataToUse, holidayDates }) => {
    const emp = dataToUse.find((e) => e.name === employeeName);
    const hours = useMemo(
        () => emp?.workShift ? calculateShiftDurationFromWorkShift(emp.workShift) : 0,
        [emp?.workShift]
    );
    const isHoliday = useMemo(
        () => holidayDates.includes(day.id),
        [holidayDates, day.id]
    );

    const cellStyle = useMemo(
        () => getCellStyle(hours, isHoliday),
        [hours, isHoliday]
    );

    return (
        <td className="p-0 border-l border-white border-b w-7 h-8 min-w-[28px]">
            <div
                className={`w-full h-full flex items-center justify-center text-[10px] transition-colors cursor-pointer ${cellStyle}`}
                title={`${day.day}: ${hours}h`}
            >
                {hours > 0 ? hours : isHoliday ? '🎉' : ''}
            </div>
        </td>
    );
}, (prevProps, nextProps) => {
    return (
        prevProps.day.id === nextProps.day.id &&
        prevProps.employeeName === nextProps.employeeName &&
        prevProps.dataToUse === nextProps.dataToUse &&
        prevProps.holidayDates === nextProps.holidayDates
    );
});

DayCell.displayName = 'DayCell';

// 🔹 Fila de empleado - OPTIMIZADA
const EmployeeRow = memo(
    ({ employeeName, teamWork, dataToUse, holidayDates, selectedOption }) => {
        const isVisible = useMemo(
            () => selectedOption === "todos" || selectedOption === teamWork,
            [selectedOption, teamWork]
        );

        const wwh = useMemo(() => {
            let total = 0;
            for (const day of dataToUse) {
                if (holidayDates.includes(day.id)) continue;
                const emp = day.employees.find((e) => e.name === employeeName);
                if (emp?.wwh) total += emp.wwh / 7;
            }
            return Math.round((total * 2) / 2);
        }, [dataToUse, employeeName, holidayDates]);

        const totalShiftDuration = useMemo(
            () => getTotalShiftDuration(employeeName, dataToUse),
            [employeeName, dataToUse]
        );

        const variation = useMemo(
            () => wwh - totalShiftDuration,
            [wwh, totalShiftDuration]
        );

        const variationClasses = useMemo(
            () => variation >= 0 ? "text-emerald-600 bg-emerald-50" : "text-red-600 bg-red-50",
            [variation]
        );

        if (!isVisible) return null;

        return (
            <tr className="group border-b border-slate-200 h-8 transition-colors hover:bg-blue-50">
                {/* NOMBRE - Tamaño legible */}
                <td className="text-left px-3 py-1 bg-white group-hover:bg-blue-50 sticky left-0 z-10 border-r border-slate-300 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                    <div className="flex flex-col justify-center w-40">
                        <span className="text-sm font-semibold text-slate-800 truncate" title={employeeName}>
                            {employeeName}
                        </span>
                        <span className="text-[10px] text-slate-500">{teamWork}</span>
                    </div>
                </td>

                {/* DATOS NUMÉRICOS - Tamaño medio */}
                <td className="px-2 py-1 text-xs font-medium text-slate-600 text-center bg-slate-50 border-r border-slate-200">
                    {wwh}
                </td>
                <td className="px-2 py-1 text-xs font-bold text-slate-800 text-center bg-slate-50 border-r border-slate-200">
                    {totalShiftDuration}
                </td>
                <td className={`px-2 py-1 text-xs font-bold text-center border-r-2 border-slate-300 ${variationClasses}`}>
                    {variation > 0 ? '+' : ''}{Math.round(variation)}
                </td>

                {/* CALENDARIO - Celdas con números */}
                {dataToUse.map((day) => {
                    const emp = day.employees.find((e) => e.name === employeeName);
                    const hours = emp?.workShift ? calculateShiftDurationFromWorkShift(emp.workShift) : 0;
                    const isHoliday = holidayDates.includes(day.id);

                    return (
                        <td
                            key={day.id}
                            className="p-0 border-l border-white border-b border-white w-7 h-8 min-w-[28px]"
                        >
                            <div
                                className={`w-full h-full flex items-center justify-center text-[10px] transition-colors cursor-pointer ${getCellStyle(hours, isHoliday)}`}
                                title={`${day.day}: ${hours}h`}
                            >
                                {hours > 0 ? hours : isHoliday ? '🎉' : ''}
                            </div>
                        </td>
                    );
                })}
            </tr>
        );
    },
    (prevProps, nextProps) => {
        return (
            prevProps.employeeName === nextProps.employeeName &&
            prevProps.teamWork === nextProps.teamWork &&
            prevProps.dataToUse === nextProps.dataToUse &&
            prevProps.holidayDates === nextProps.holidayDates &&
            prevProps.selectedOption === nextProps.selectedOption
        );
    }
);

EmployeeRow.displayName = 'EmployeeRow';

// 🔹 Fila resumen footer - OPTIMIZADA
const DailySummaryRow = memo(({ dataToUse }) => {
    const dailyTotals = useMemo(() => {
        return dataToUse.map((day) => {
            let totalMinutes = 0;
            for (const emp of day.employees) {
                if (emp?.workShift) {
                    const workCount = emp.workShift.filter((block) => block === "WORK").length;
                    totalMinutes += workCount * 15;
                }
            }
            return +(totalMinutes / 60).toFixed(0);
        });
    }, [dataToUse]);

    return (
        <tr className="bg-slate-100 h-8 border-t-2 border-slate-300 font-bold text-xs">
            <td className="text-left px-3 py-1 sticky left-0 z-10 bg-slate-100 border-r border-slate-300 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                TOTAL
            </td>
            <td colSpan="3" className="bg-slate-100 border-r-2 border-slate-300"></td>

            {dailyTotals.map((hours, i) => (
                <td key={i} className="p-0 border-l border-white w-7 min-w-[28px] text-center bg-slate-200 text-slate-700">
                    {hours}
                </td>
            ))}
        </tr>
    );
}, (prevProps, nextProps) => {
    return prevProps.dataToUse === nextProps.dataToUse;
});

DailySummaryRow.displayName = 'DailySummaryRow';

// 🔹 Componente principal - OPTIMIZADO
export const RosterRangeSummary = memo(({ data }) => {
    const { selectedOption, holidayDates } = useContext(AppContext);

    const employeesData = useMemo(() => {
        const employeeMap = new Map();
        for (const day of data) {
            for (const emp of day.employees) {
                if (!employeeMap.has(emp.name)) {
                    employeeMap.set(emp.name, emp.teamWork);
                }
            }
        }
        return Array.from(employeeMap.entries());
    }, [data]);

    const dayHeaders = useMemo(() => {
        return data.map((item) => {
            const dayName = item.day?.charAt(0).toUpperCase() || daysOfWeek[item.id]?.charAt(0);
            const dayNumber = typeof item.id === "string" ? item.id.slice(8, 10) : "";
            return { id: item.id, initial: dayName, dayNumber };
        });
    }, [data]);

    return (
        <div className="overflow-x-auto">
            <table className="w-auto border-collapse bg-white rounded-lg shadow-sm border border-slate-200">
                <thead>
                    <tr className="bg-slate-100 h-10 border-b border-slate-300">
                        <th className="text-left px-3 sticky left-0 bg-slate-100 z-20 border-r border-slate-300 min-w-[160px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                            <span className="text-xs font-bold text-slate-700 uppercase">Empleado</span>
                        </th>
                        <th className="px-2 w-10 text-[10px] font-bold text-slate-600 bg-slate-50 border-r border-slate-200" title="Horas Esperadas">WWH</th>
                        <th className="px-2 w-10 text-[10px] font-bold text-slate-600 bg-slate-50 border-r border-slate-200" title="Horas Reales">TOT</th>
                        <th className="px-2 w-10 text-[10px] font-bold text-slate-600 bg-slate-50 border-r-2 border-slate-300" title="Variación">VAR</th>

                        {/* HEADERS DÍAS */}
                        {dayHeaders.map((d) => (
                            <th key={d.id} className="p-0 w-7 min-w-[28px] bg-slate-100 border-l border-white">
                                <div className="flex flex-col items-center justify-center h-full w-full leading-none">
                                    <span className="text-[9px] text-slate-500 font-normal mb-0.5">{d.initial}</span>
                                    <span className="text-[10px] font-bold text-slate-800">{d.dayNumber}</span>
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {employeesData.map(([name, teamWork]) => (
                        <EmployeeRow
                            key={name}
                            employeeName={name}
                            teamWork={teamWork}
                            dataToUse={data}
                            holidayDates={holidayDates}
                            selectedOption={selectedOption}
                        />
                    ))}
                    <DailySummaryRow dataToUse={data} />
                </tbody>
            </table>
        </div>
    );
}, (prevProps, nextProps) => {
    return prevProps.data === nextProps.data;
});

RosterRangeSummary.displayName = 'RosterRangeSummary';
