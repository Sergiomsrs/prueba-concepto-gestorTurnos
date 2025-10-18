import { memo, useMemo } from "react";
import { useEmployeeInteractions } from "../hooks/useEmployeeInteractions";

export const EmployeeRow = memo(({
    employee,
    dayIndex,
    employeeIndex,
    dispatch,
    numRows,
    numDays,
    inputRefsMatrix,
}) => {

    const {
        inputRefs,
        handleMouseDown,
        handleMouseEnter,
        handleMouseUp,
        handleKeyDown,
    } = useEmployeeInteractions({
        employee,
        dayIndex,
        employeeIndex,
        numRows,
        numDays,
        dispatch,
        inputRefsMatrix,
    });

    const totalHours = useMemo(() => {
        return (employee.workShift.filter((w) => w === "WORK").length * 15) / 60;
    }, [employee.workShift]);

    return (
        <>
            <div className="bg-white px-3 py-2 text-sm font-medium text-gray-800 border-r flex items-center">
                <span className="truncate">{employee.teamWork}</span>
            </div>
            <div className="bg-white px-3 py-2 text-sm text-gray-700 border-r flex items-center">
                <span className="truncate">{employee.name} {employee.lastName}</span>
            </div>

            {employee.workShift.map((value, hourIndex) => (
                <div
                    key={hourIndex}
                    className="bg-white flex items-center justify-center p-0.5"
                    onMouseEnter={() => handleMouseEnter(hourIndex)}
                    onMouseUp={handleMouseUp}
                >
                    <input
                        ref={(el) => {
                            inputRefs.current[hourIndex] = el;
                            if (inputRefsMatrix.current) {
                                if (!inputRefsMatrix.current[dayIndex])
                                    inputRefsMatrix.current[dayIndex] = [];
                                if (!inputRefsMatrix.current[dayIndex][employeeIndex])
                                    inputRefsMatrix.current[dayIndex][employeeIndex] = [];
                                inputRefsMatrix.current[dayIndex][employeeIndex][hourIndex] = el;
                            }
                        }}
                        type="checkbox"
                        checked={value === "WORK"}
                        onMouseDown={() => handleMouseDown(hourIndex)}
                        onChange={() => { }}
                        onKeyDown={(e) => handleKeyDown(e, hourIndex)}
                        className={`w-4 h-4 rounded border-gray-300 cursor-pointer transition-all duration-75 ${value === "WORK" ? "bg-blue-500" : "bg-white"}`}
                    />
                </div>
            ))}

            <div className="bg-white px-3 py-2 text-sm font-medium text-gray-700 border-l text-center">
                {totalHours.toFixed(2)}
            </div>
        </>
    );
});
