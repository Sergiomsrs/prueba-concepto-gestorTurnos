import { memo, useMemo, useRef } from "react";
import { useEmployeeInteractions } from "../hooks/useEmployeeInteractions";

const getHighestNonZeroIndex = (array) => {
    if (!array) return -1;
    for (let i = array.length - 1; i >= 0; i--) {
        if (array[i] === "WORK") return i;
    }
    return -1;
};

export const EmployeeRow = memo(
    ({
        employee,
        dayIndex,
        employeeIndex,
        dispatch,
        numRows,
        numDays,
        inputRefsMatrix,
        previousEmployee,
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

        // Flag local para evitar doble toggle en click
        const clickLockRef = useRef(false);

        const disabledLimit = useMemo(() => {
            if (!previousEmployee?.workShift) return -1;
            const highestIndex = getHighestNonZeroIndex(previousEmployee.workShift);
            return highestIndex >= 48 ? highestIndex - 48 : -1;
        }, [previousEmployee?.workShift]);

        const isIndexDisabled = (index) =>
            disabledLimit >= 0 && index <= disabledLimit;

        const totalHours = useMemo(
            () => (employee.workShift.filter((w) => w === "WORK").length * 15) / 60,
            [employee.workShift]
        );

        const toggleHour = (hourIndex) => {
            dispatch({
                type: "UPDATE_SHIFT",
                payload: { dayIndex, employeeIndex, hourIndex },
            });
        };

        return (
            <>
                <div className="bg-white px-3 py-2 text-sm font-medium text-gray-800 border-r flex items-center">
                    <span className="truncate">{employee.teamWork}</span>
                </div>
                <div className="bg-white px-3 py-2 text-sm text-gray-700 border-r flex items-center">
                    <span className="truncate">
                        {employee.name} {employee.lastName}
                    </span>
                </div>

                {employee.workShift.map((value, hourIndex) => {
                    const disabled = isIndexDisabled(hourIndex) || value === "PTO";
                    const cellBgClass = disabled ? "bg-red-400" : "bg-white";

                    return (
                        <div
                            key={hourIndex}
                            className={`${cellBgClass} flex items-center justify-center p-0.5`}
                            onMouseEnter={() => handleMouseEnter(hourIndex)}
                            onMouseUp={handleMouseUp}
                        >
                            <input
                                ref={(el) => {
                                    inputRefs.current[hourIndex] = el;
                                    if (!inputRefsMatrix.current[dayIndex])
                                        inputRefsMatrix.current[dayIndex] = [];
                                    if (!inputRefsMatrix.current[dayIndex][employeeIndex])
                                        inputRefsMatrix.current[dayIndex][employeeIndex] = [];
                                    inputRefsMatrix.current[dayIndex][employeeIndex][hourIndex] = el;
                                }}
                                type="checkbox"
                                checked={value === "WORK"}
                                onMouseDown={(e) => {
                                    clickLockRef.current = true;
                                    handleMouseDown(hourIndex);
                                }}
                                onChange={(e) => {
                                    // solo permitir el cambio si NO viene del click del mouseDown
                                    if (clickLockRef.current) {
                                        clickLockRef.current = false;
                                        return;
                                    }
                                    toggleHour(hourIndex);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === " " || e.key === "Enter") {
                                        e.preventDefault();
                                        toggleHour(hourIndex);
                                    } else {
                                        handleKeyDown(e, hourIndex);
                                    }
                                }}
                                disabled={disabled}
                                className={`w-4 h-4 rounded border-gray-300 transition-all duration-75 ${value === "WORK" ? "bg-blue-500" : "bg-white"
                                    } ${disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
                            />
                        </div>
                    );
                })}

                <div className="bg-white px-3 py-2 text-sm font-medium text-gray-700 border-l text-center">
                    {totalHours.toFixed(2)}
                </div>
            </>
        );
    }
);
