import { useMemo, memo, useContext } from "react";
import { daysOfWeek } from "../../utils/data";
import { formatTime } from "../../utils/function";
import { AppContext } from "../../context/AppContext";

// 🔹 Utilidad para calcular horas desde workShift
const calculateShiftDurationFromWorkShift = (workShift) => {
    if (!workShift) return "00:00";

    const workCount = workShift.filter((block) => block === "WORK").length;
    const totalMinutes = workCount * 15; // Cada bloque son 15 minutos
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

// 🔹 Utilidad optimizada - ACTUALIZADA
const getTotalShiftDuration = (employeeName, data) => {
    let totalMinutes = 0;

    for (const day of data) {
        const emp = day.employees.find((e) => e.name === employeeName);
        if (emp) {
            // ✅ CALCULAR desde workShift en lugar de usar shiftDuration
            if (emp.workShift) {
                const workCount = emp.workShift.filter((block) => block === "WORK").length;
                totalMinutes += workCount * 15; // 15 minutos por bloque
            }
        }
    }

    return +(totalMinutes / 60).toFixed(2);
};

// 🔹 Fila de empleado memoizada - ACTUALIZADA
const EmployeeRow = memo(
    ({ employeeName, teamWork, dataToUse, holidayDates, selectedOption }) => {
        const isVisible = selectedOption === "todos" || selectedOption === teamWork;
        if (!isVisible) return null;

        const wwh = useMemo(() => {
            let total = 0;
            for (const day of dataToUse) {
                if (holidayDates.includes(day.id)) continue;
                const emp = day.employees.find((e) => e.name === employeeName);
                if (emp?.wwh) total += emp.wwh / 7;
            }
            return Math.round((total * 2) / 2);
        }, [dataToUse, employeeName, holidayDates]);

        // ✅ RECALCULAR desde workShift
        const totalShiftDuration = useMemo(
            () => getTotalShiftDuration(employeeName, dataToUse),
            [employeeName, dataToUse] // Se actualizará cuando cambie dataToUse
        );

        const variation = useMemo(() => wwh - totalShiftDuration, [wwh, totalShiftDuration]);

        return (
            <tr className="hover:bg-gray-50">
                <td className="text-left px-3 py-1 font-medium bg-white border-r">
                    {employeeName}
                </td>
                <td className="px-2 py-1">{wwh}</td>
                <td className="px-2 py-1">{totalShiftDuration}</td>
                <td className={`px-2 py-1 ${variation >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {variation.toFixed(2)}
                </td>

                {dataToUse.map((day) => {
                    const emp = day.employees.find((e) => e.name === employeeName);

                    // ✅ CALCULAR duración desde workShift en tiempo real
                    const calculatedDuration = emp?.workShift
                        ? calculateShiftDurationFromWorkShift(emp.workShift)
                        : "00:00";

                    return (
                        <td key={day.id} className="whitespace-nowrap px-2 py-1">
                            {calculatedDuration}
                            {holidayDates.includes(day.id) && " 🎉"}
                        </td>
                    );
                })}
            </tr>
        );
    }
);

// 🔹 Fila resumen por día (footer) - ACTUALIZADA
const DailySummaryRow = memo(({ dataToUse }) => {
    const dailyTotals = useMemo(() => {
        return dataToUse.map((day) => {
            let totalMinutes = 0;

            for (const emp of day.employees) {
                // ✅ CALCULAR desde workShift
                if (emp?.workShift) {
                    const workCount = emp.workShift.filter((block) => block === "WORK").length;
                    totalMinutes += workCount * 15;
                }
            }

            return +(totalMinutes / 60).toFixed(2);
        });
    }, [dataToUse]); // Se recalculará cuando cambie dataToUse

    const totalWeekHours = useMemo(
        () => dailyTotals.reduce((acc, val) => acc + val, 0).toFixed(2),
        [dailyTotals]
    );

    return (
        <tr className="bg-gray-100 font-semibold border-t-2 border-gray-300">
            <td className="text-left px-3 py-2">Total día</td>
            <td></td>
            <td>{totalWeekHours}</td>
            <td></td>
            {dailyTotals.map((hours, i) => (
                <td key={i} className="px-2 py-2">
                    {hours.toFixed(2)}
                </td>
            ))}
        </tr>
    );
});

// 🔹 Componente principal - SIN CAMBIOS
export const RosterRangeSummary = memo(({ data }) => {
    const { selectedOption, holidayDates } = useContext(AppContext);

    const dataToUse = data;

    const employeesData = useMemo(() => {
        const employeeMap = new Map();
        for (const day of dataToUse) {
            for (const emp of day.employees) {
                if (!employeeMap.has(emp.name)) {
                    employeeMap.set(emp.name, emp.teamWork);
                }
            }
        }
        return Array.from(employeeMap.entries());
    }, [dataToUse]);

    const dayHeaders = useMemo(() => {
        return dataToUse.map((item) => {
            const day =
                item.day?.charAt(0).toUpperCase() + item.day.slice(1) || daysOfWeek[item.id];
            return {
                id: item.id,
                label: day,
                sub: typeof item.id === "string" ? `(${item.id.slice(8)})` : "",
            };
        });
    }, [dataToUse]);

    return (
        <div className="overflow-x-auto py-8 my-8 bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500 max-w-[1800px]">
            <table className="table-auto text-center w-full mb-0">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="text-left px-3 py-2 sticky left-0 bg-gray-100 z-10">
                            Empleado
                        </th>
                        <th className="px-2 py-2">WWH</th>
                        <th className="px-2 py-2">Total</th>
                        <th className="px-2 py-2">Var</th>
                        {dayHeaders.map((d) => (
                            <th key={d.id} className="whitespace-nowrap px-2 py-2 min-w-[80px]">
                                {d.label}
                                <span className="text-xs block">{d.sub}</span>
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
                            dataToUse={dataToUse}
                            holidayDates={holidayDates}
                            selectedOption={selectedOption}
                        />
                    ))}

                    <DailySummaryRow dataToUse={dataToUse} />
                </tbody>
            </table>
        </div>
    );
});
