import { useMemo, memo, useContext } from "react";
import { daysOfWeek } from "../../utils/data";
import { AppContext } from "../../context/AppContext";

// 🔹 Utilidad para calcular horas
const calculateShiftDurationFromWorkShift = (workShift) => {
    if (!workShift) return 0;
    const workCount = workShift.filter((block) => block === "WORK").length;
    return (workCount * 15) / 60;
};

// 🔹 Utilidad totales
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

// 🔹 Estilo plano y minimalista
const getCellStyle = (hours, isHoliday) => {
    if (hours > 0) return "bg-emerald-500 text-white font-semibold";
    if (isHoliday) return "bg-purple-50 text-purple-400 border border-purple-200";
    return "bg-slate-100 text-slate-400";
};

// 🔹 Fila de empleado - Diseño plano
const EmployeeRow = memo(
    ({ employeeName, employeeLastName, teamWork, dataToUse, holidayDates, selectedOption }) => {
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

        const fullName = useMemo(
            () => `${employeeName} ${employeeLastName}`,
            [employeeName, employeeLastName]
        );

        if (!isVisible) return null;

        return (
            <tr className="border-b border-slate-200 hover:bg-slate-50">
                {/* COLUMNA EMPLEADO */}
                <td className="pl-4 py-2.5 bg-white sticky left-0 z-10 border-r border-slate-200">
                    <div className="flex flex-col w-28">
                        <span className="text-sm font-semibold text-slate-800" title={fullName}>
                            {fullName}
                        </span>
                    </div>
                </td>

                {/* ESTADÍSTICAS */}
                <td className="px-3 py-2.5 text-sm text-slate-700 text-center border-r border-slate-200">
                    {wwh}
                </td>
                <td className="px-3 py-2.5 text-sm font-bold text-slate-900 text-center border-r border-slate-200">
                    {totalShiftDuration}
                </td>
                <td className={`px-3 py-2.5 text-sm font-bold text-center border-r-2 border-slate-300 ${variation >= 0 ? "text-emerald-600" : "text-red-600"
                    }`}>
                    {variation > 0 ? '+' : ''}{variation.toFixed(1)}
                </td>

                {/* CALENDARIO */}
                {dataToUse.map((day) => {
                    const emp = day.employees.find((e) => e.name === employeeName);
                    const hours = emp?.workShift ? calculateShiftDurationFromWorkShift(emp.workShift) : 0;
                    const isHoliday = day.holiday;

                    return (
                        <td key={day.id} className="p-0.5 w-8 h-10">
                            <div
                                className={`w-full h-full flex items-center justify-center text-xs rounded ${getCellStyle(hours, isHoliday)}`}
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
            prevProps.employeeLastName === nextProps.employeeLastName &&
            prevProps.teamWork === nextProps.teamWork &&
            prevProps.dataToUse === nextProps.dataToUse &&
            prevProps.holidayDates === nextProps.holidayDates &&
            prevProps.selectedOption === nextProps.selectedOption
        );
    }
);

EmployeeRow.displayName = 'EmployeeRow';

// 🔹 Fila footer
const DailySummaryRow = memo(({ dataToUse, employeesData, holidayDates, selectedOption }) => {
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

    // Calcular totales de columnas WWH, Total y Variación
    const columnTotals = useMemo(() => {
        let totalWWH = 0;
        let totalHours = 0;

        // Verificar que employeesData sea iterable
        if (!employeesData || !Array.isArray(employeesData)) {
            return { wwh: 0, total: '0.0', variation: '0.0' };
        }

        for (const [name] of employeesData) {
            // Filtrar por selectedOption
            const employeeInfo = dataToUse[0]?.employees.find(e => e.name === name);
            if (!employeeInfo) continue;

            const isVisible = selectedOption === "todos" || selectedOption === employeeInfo.teamWork;
            if (!isVisible) continue;

            // Calcular WWH
            let wwh = 0;
            for (const day of dataToUse) {
                if (holidayDates.includes(day.id)) continue;
                const emp = day.employees.find((e) => e.name === name);
                if (emp?.wwh) wwh += emp.wwh / 7;
            }
            totalWWH += Math.round((wwh * 2) / 2);

            // Calcular Total horas trabajadas
            totalHours += getTotalShiftDuration(name, dataToUse);
        }

        const totalVariation = totalWWH - totalHours;

        return {
            wwh: totalWWH,
            total: totalHours.toFixed(1),
            variation: totalVariation.toFixed(1)
        };
    }, [dataToUse, employeesData, holidayDates, selectedOption]);

    return (
        <tr className="bg-slate-50 border-t-2 border-slate-300">
            <td className="pl-4 py-3 sticky left-0 z-10 bg-slate-50 border-r border-slate-200">
                <div className="font-bold text-sm text-slate-900">TOTAL GENERAL</div>
            </td>

            {/* TOTALES DE COLUMNAS */}
            <td className="px-3 py-3 text-sm font-bold text-slate-900 text-center bg-slate-100 border-r border-slate-200">
                {columnTotals.wwh}
            </td>
            <td className="px-3 py-3 text-sm font-bold text-slate-900 text-center bg-slate-100 border-r border-slate-200">
                {columnTotals.total}
            </td>
            <td className={`px-3 py-3 text-sm font-bold text-center bg-slate-100 border-r-2 border-slate-300 ${parseFloat(columnTotals.variation) >= 0 ? "text-emerald-600" : "text-red-600"
                }`}>
                {parseFloat(columnTotals.variation) > 0 ? '+' : ''}{columnTotals.variation}
            </td>

            {/* TOTALES POR DÍA */}
            {dailyTotals.map((hours, i) => (
                <td key={i} className="p-0.5 w-8">
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold bg-slate-200 text-slate-900 rounded">
                        {hours}
                    </div>
                </td>
            ))}
        </tr>
    );
}, (prevProps, nextProps) => {
    // Comparación mejorada
    const employeesEqual =
        Array.isArray(prevProps.employeesData) &&
        Array.isArray(nextProps.employeesData) &&
        prevProps.employeesData.length === nextProps.employeesData.length;

    return (
        prevProps.dataToUse === nextProps.dataToUse &&
        employeesEqual &&
        prevProps.holidayDates === nextProps.holidayDates &&
        prevProps.selectedOption === nextProps.selectedOption
    );
});

DailySummaryRow.displayName = 'DailySummaryRow';

// 🔹 Componente principal
export const RosterRangeSummary = memo(({ data }) => {
    const { selectedOption, holidayDates } = useContext(AppContext);

    const employeesData = useMemo(() => {
        const employeeMap = new Map();
        for (const day of data) {
            for (const emp of day.employees) {
                if (!employeeMap.has(emp.name)) {
                    employeeMap.set(emp.name, {
                        lastName: emp.lastName,
                        teamWork: emp.teamWork
                    });
                }
            }
        }
        return Array.from(employeeMap.entries());
    }, [data]);

    const dayHeaders = useMemo(() => {
        return data.map((item) => {
            const dayName = item.day?.charAt(0).toUpperCase() || daysOfWeek[item.id]?.charAt(0);
            const dayNumber = typeof item.id === "string" ? item.id.slice(8, 10) : "";
            const isWeekend = item.day === 'sábado' || item.day === 'domingo';
            return { id: item.id, initial: dayName, dayNumber, isWeekend };
        });
    }, [data]);

    return (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-auto border-collapse bg-white">
                <thead>
                    <tr className="bg-slate-50 border-b-2 border-slate-300">
                        {/* HEADER EMPLEADO */}
                        <th className="text-left pl-4 py-3 sticky left-0 bg-slate-50 z-20 border-r border-slate-200 min-w-[160px]">
                            <div className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                                Empleado
                            </div>
                        </th>

                        {/* HEADERS ESTADÍSTICAS */}
                        <th className="px-3 py-3 text-xs font-bold text-slate-700 uppercase border-r border-slate-200" title="Weekly Working Hours">
                            WWH
                        </th>
                        <th className="px-3 py-3 text-xs font-bold text-slate-700 uppercase border-r border-slate-200" title="Total Horas">
                            Total
                        </th>
                        <th className="px-3 py-3 text-xs font-bold text-slate-700 uppercase border-r-2 border-slate-300" title="Variación">
                            Var
                        </th>

                        {/* HEADERS DÍAS */}
                        {dayHeaders.map((d) => (
                            <th
                                key={d.id}
                                className={`p-2 w-8 text-center ${d.isWeekend ? 'bg-slate-100' : 'bg-slate-50'
                                    }`}
                            >
                                <div className="flex flex-col items-center">
                                    <span className="text-xs font-semibold text-slate-700">
                                        {d.initial}
                                    </span>
                                    <span className="text-xs font-bold text-slate-900 mt-0.5">
                                        {d.dayNumber}
                                    </span>
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {employeesData.map(([name, { lastName, teamWork }]) => (
                        <EmployeeRow
                            key={name}
                            employeeName={name}
                            employeeLastName={lastName}
                            teamWork={teamWork}
                            dataToUse={data}
                            holidayDates={holidayDates}
                            selectedOption={selectedOption}
                        />
                    ))}
                    <DailySummaryRow dataToUse={data} employeesData={employeesData} holidayDates={holidayDates} selectedOption={selectedOption} />
                </tbody>
            </table>
        </div>
    );
}, (prevProps, nextProps) => {
    return prevProps.data === nextProps.data;
});

RosterRangeSummary.displayName = 'RosterRangeSummary';
