import { useMemo, memo, useContext } from "react";
import { daysOfWeek } from "../../utils/data";
import { AppContext } from "../../context/AppContext";

// Utilidad para calcular horas
const calculateShiftDurationFromWorkShift = (workShift) => {
    if (!workShift) return 0;
    const workCount = workShift.filter((block) => block === "WORK").length;
    return (workCount * 15) / 60;
};

const getTotalShiftDuration = (employeeId, data) => {
    let totalMinutes = 0;
    for (const day of data) {
        const emp = day.employees.find((e) => e.id === employeeId);
        if (emp?.workShift) {
            const workCount = emp.workShift.filter((block) => block === "WORK").length;
            totalMinutes += workCount * 15;
        }
    }
    return totalMinutes / 60; // múltiplos exactos de 0.25, sin redondeo
};

const getCellStyle = (hours, isHoliday) => {
    if (hours > 0) return "bg-emerald-500 text-white font-semibold";
    if (isHoliday) return "bg-purple-50 text-purple-400 border border-purple-200";
    return "bg-slate-100 text-slate-400";
};

//  Fila de empleado
// - isVisible se filtra en el padre → este componente nunca se monta si no es visible
// - fullName y variation son operaciones triviales, no necesitan useMemo
const EmployeeRow = memo(
    ({ employeeId, employeeName, employeeLastName, teamWork, dataToUse, holidayDates, selectedOption }) => {

        const wwh = useMemo(() => {
            let total = 0;
            for (const day of dataToUse) {
                if (day.holiday) continue;
                const emp = day.employees.find((e) => e.id === employeeId);
                if (emp?.pto == true) continue;
                if (emp?.wwh) total += emp.wwh / 7;
            }
            return Math.round((total * 2) / 2);
        }, [dataToUse, employeeId, holidayDates]);

        const totalShiftDuration = useMemo(
            () => getTotalShiftDuration(employeeId, dataToUse),
            [employeeId, dataToUse]
        );

        // Resta de dos números ya memoizados — no necesita useMemo
        const variation = wwh - totalShiftDuration;

        // Concatenación trivial — no necesita useMemo
        const fullName = `${employeeName} ${employeeLastName}`;

        return (
            <tr className="border-b border-slate-200 hover:bg-slate-50">
                {/* COLUMNA EMPLEADO */}
                <td className="pl-4 py-2.5 bg-white sticky left-0 z-10 border-r border-slate-200">
                    <div className="flex flex-col min-w-[150px] max-w-[250px]">
                        <span
                            className="whitespace-nowrap overflow-hidden text-ellipsis"
                            title={fullName}
                        >
                            {fullName}
                        </span>
                    </div>
                </td>

                {/* ESTADÍSTICAS */}
                <td className="px-3 py-2.5 text-sm text-slate-700 text-center border-r border-slate-200">
                    {wwh}
                </td>
                <td className="px-3 py-2.5 text-sm font-bold text-slate-900 text-center border-r border-slate-200">
                    {totalShiftDuration.toFixed(2)}
                </td>
                <td className={`px-3 py-2.5 text-sm font-bold text-center border-r-2 border-slate-300 ${variation >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                    {variation > 0 ? '+' : ''}{variation.toFixed(2)}
                </td>

                {/* CALENDARIO */}
                {dataToUse.map((day) => {
                    const emp = day.employees.find((e) => e.id === employeeId);
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
            prevProps.employeeId === nextProps.employeeId &&
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

//  Fila footer
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

    const columnTotals = useMemo(() => {
        let totalWWH = 0;
        let totalHours = 0;

        if (!employeesData || !Array.isArray(employeesData)) {
            return { wwh: 0, total: '0.0', variation: '0.0' };
        }

        for (const [id, employeeInfo] of employeesData) {
            const isVisible = selectedOption === "todos" || selectedOption === employeeInfo.teamWork;
            if (!isVisible) continue;

            let wwh = 0;
            for (const day of dataToUse) {
                if (day.holiday) continue;
                const emp = day.employees.find((e) => e.id === id);
                if (emp?.pto == false) continue;
                if (emp?.wwh) wwh += emp.wwh / 2;
            }
            totalWWH += Math.round((wwh * 2) / 2);
            totalHours += getTotalShiftDuration(id, dataToUse);
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

            <td className="px-3 py-3 text-sm font-bold text-slate-900 text-center bg-slate-100 border-r border-slate-200">
                {columnTotals.wwh}
            </td>
            <td className="px-3 py-3 text-sm font-bold text-slate-900 text-center bg-slate-100 border-r border-slate-200">
                {columnTotals.total}
            </td>
            <td className={`px-3 py-3 text-sm font-bold text-center bg-slate-100 border-r-2 border-slate-300 ${parseFloat(columnTotals.variation) >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                {parseFloat(columnTotals.variation) > 0 ? '+' : ''}{columnTotals.variation}
            </td>

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
    return (
        prevProps.dataToUse === nextProps.dataToUse &&
        prevProps.employeesData === nextProps.employeesData &&  // referencia estable gracias al useMemo del padre
        prevProps.holidayDates === nextProps.holidayDates &&
        prevProps.selectedOption === nextProps.selectedOption
    );
});

DailySummaryRow.displayName = 'DailySummaryRow';

// Componente principal
export const RosterRangeSummary = memo(({ data }) => {
    const { selectedOption, holidayDates } = useContext(AppContext);

    // Clave del mapa: emp.id (único y estable)
    const employeesData = useMemo(() => {
        const employeeMap = new Map();
        for (const day of data) {
            for (const emp of day.employees) {
                if (!employeeMap.has(emp.id)) {
                    employeeMap.set(emp.id, {
                        name: emp.name,
                        lastName: emp.lastName,
                        teamWork: emp.teamWork,
                    });
                }
            }
        }
        return Array.from(employeeMap.entries()); // [[id, { name, lastName, teamWork }], ...]
    }, [data]);

    // Filtrado en el padre — EmployeeRow no se monta si no es visible, evita ejecutar sus hooks
    const visibleEmployees = useMemo(() => {
        if (selectedOption === "todos") return employeesData;
        return employeesData.filter(([, { teamWork }]) => teamWork === selectedOption);
    }, [employeesData, selectedOption]);

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
                        <th className="text-left pl-4 py-3 sticky left-0 bg-slate-50 z-20 border-r border-slate-200 min-w-[150px] max-w-[250px] whitespace-nowrap">
                            <div className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                                Empleado
                            </div>
                        </th>
                        <th className="px-3 py-3 text-xs font-bold text-slate-700 uppercase border-r border-slate-200" title="Weekly Working Hours">
                            WWH
                        </th>
                        <th className="px-3 py-3 text-xs font-bold text-slate-700 uppercase border-r border-slate-200" title="Total Horas">
                            Total
                        </th>
                        <th className="px-3 py-3 text-xs font-bold text-slate-700 uppercase border-r-2 border-slate-300" title="Variación">
                            Var
                        </th>
                        {dayHeaders.map((d) => (
                            <th
                                key={d.id}
                                className={`p-2 w-8 text-center ${d.isWeekend ? 'bg-slate-100' : 'bg-slate-50'}`}
                            >
                                <div className="flex flex-col items-center">
                                    <span className="text-xs font-semibold text-slate-700">{d.initial}</span>
                                    <span className="text-xs font-bold text-slate-900 mt-0.5">{d.dayNumber}</span>
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {visibleEmployees.map(([id, { name, lastName, teamWork }]) => (
                        <EmployeeRow
                            key={id}
                            employeeId={id}
                            employeeName={name}
                            employeeLastName={lastName}
                            teamWork={teamWork}
                            dataToUse={data}
                            holidayDates={holidayDates}
                            selectedOption={selectedOption}
                        />
                    ))}
                    <DailySummaryRow
                        dataToUse={data}
                        employeesData={employeesData}
                        holidayDates={holidayDates}
                        selectedOption={selectedOption}
                    />
                </tbody>
            </table>
        </div>
    );
}, (prevProps, nextProps) => {
    return prevProps.data === nextProps.data;
});

RosterRangeSummary.displayName = 'RosterRangeSummary';
