import { useContext, useMemo } from "react";
import { AppContext } from "../context/AppContext";
import { getTotalShiftDuration, uniqueEmployeeName, formatTime } from "../utils/function";
import { daysOfWeek } from "../utils/data";

export const WeeklySummary = ({ data }) => {
    const { selectedOption, holidayDates } = useContext(AppContext);

    const dataToUse = useMemo(() => data.slice(1), [data]);
    const uniqueEmployeeNames = uniqueEmployeeName(data);

    // Función para obtener el teamWork de un empleado
    const getEmployeeTeamWork = (employeeName) => {
        for (let i = 0; i < dataToUse.length; i++) {
            const employee = dataToUse[i].employees.find((e) => e.name === employeeName);
            if (employee) {
                return employee.teamWork;
            }
        }
        return null;
    };

    return (
        <div className="overflow-x-auto py-8 my-8 bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500 w-[1650px]">
            <table className="table table-hover text-center w-full mb-0">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="text-left px-3 py-2 left-0 bg-gray-100 z-10">Empleado</th>
                        <th className="px-2 py-2">WWH</th>
                        <th className="px-2 py-2">Total</th>
                        <th className="px-2 py-2">Var</th>
                        {dataToUse.map((item) => {
                            const day = item.day
                                ? item.day.charAt(0).toUpperCase() + item.day.slice(1)
                                : daysOfWeek[item.id];

                            return (
                                <th key={item.id} className="whitespace-nowrap px-2 py-2 min-w-[80px]">
                                    {day}
                                    <span className="text-xs block">
                                        {typeof item.id === "string" ? `(${item.id.slice(8)})` : ""}
                                    </span>
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {uniqueEmployeeNames.map(employeeName => {
                        const employeeNameTrimmed = employeeName.trim();
                        const teamWork = getEmployeeTeamWork(employeeNameTrimmed);

                        // Filtrar por equipo de trabajo
                        if (selectedOption !== "todos" && selectedOption !== teamWork) {
                            return null;
                        }

                        const wwh = Math.round(
                            (dataToUse.reduce((acc, day) => {
                                const employee = day.employees.find(emp => emp.name === employeeNameTrimmed);
                                const isHoliday = holidayDates.includes(day.id);

                                if (employee && !isHoliday) {
                                    return acc + (employee.wwh / 7);
                                }
                                return acc;
                            }, 0) * 2) / 2
                        );

                        const totalShiftDuration = getTotalShiftDuration(employeeNameTrimmed, dataToUse);
                        const variation = wwh - totalShiftDuration;

                        return (
                            <tr key={employeeNameTrimmed} className="hover:bg-gray-50">
                                <td className="text-left px-3 py-1 font-medium left-0 bg-white hover:bg-gray-50 z-10 border-r">
                                    {employeeNameTrimmed}
                                </td>
                                <td className="px-2 py-1">{wwh}</td>
                                <td className="px-2 py-1">{totalShiftDuration}</td>
                                <td className={`px-2 py-1 ${variation >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {variation.toFixed(2)}
                                </td>
                                {dataToUse.map((item) => (
                                    <td key={item.id} className="whitespace-nowrap px-2 py-1">
                                        {formatTime(item.employees.find((e) => e.name === employeeNameTrimmed)?.shiftDuration)}
                                        {holidayDates.includes(item.id) ? " 🎉" : ""}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};