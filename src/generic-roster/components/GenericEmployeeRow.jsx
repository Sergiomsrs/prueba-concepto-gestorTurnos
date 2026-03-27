// generic/components/GenericEmployeeRow.jsx

import { memo, useMemo, useCallback } from "react";
import { useEmployeeInteractions } from "../../roster/hooks/useEmployeeInteractions";
import { selectColor } from "../../utils/function";

const getHighestNonZeroIndex = (array) => {
    if (!array) return -1;
    for (let i = array.length - 1; i >= 0; i--) {
        if (array[i] === "WORK") return i;
    }
    return -1;
};

export const GenericEmployeeRow = memo(
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

        const disabledLimit = useMemo(() => {
            if (!previousEmployee?.workShift) return -1;
            const highestIndex = getHighestNonZeroIndex(previousEmployee.workShift);
            return highestIndex >= 48 ? highestIndex - 48 : -1;
        }, [previousEmployee?.workShift]);

        const isIndexDisabled = useCallback(
            (index) => disabledLimit >= 0 && index <= disabledLimit,
            [disabledLimit]
        );

        const totalHours = useMemo(
            () => (employee.workShift.filter((w) => w === "WORK").length * 15) / 60,
            [employee.workShift]
        );

        // ── Sin labels de hora inicio/fin para genéricos (más limpio visualmente)
        // Si en el futuro las necesitas, es copiar el useMemo de EmployeeRow

        const toggleHour = useCallback((hourIndex) => {
            const currentValue = employee.workShift[hourIndex];
            if (currentValue === "PTO" || isIndexDisabled(hourIndex)) return;

            dispatch({
                type: "UPDATE_SHIFT",
                payload: { dayIndex, employeeIndex, hourIndex },
            });
        }, [employee.workShift, isIndexDisabled, dispatch, dayIndex, employeeIndex]);

        const handleCellMouseDownWithLogic = useCallback((hourIndex, event) => {
            const currentValue = employee.workShift[hourIndex];

            if (currentValue === "PTO" || isIndexDisabled(hourIndex)) {
                event.preventDefault();
                event.stopPropagation();
                return;
            }

            if (currentValue === "CONFLICT") {
                event.preventDefault();
                event.stopPropagation();
                toggleHour(hourIndex);
                return;
            }

            handleMouseDown(hourIndex);
        }, [employee.workShift, isIndexDisabled, toggleHour, handleMouseDown]);

        const getCursorClass = (isDisabled, value) => {
            if (isDisabled || value === "PTO") return "cursor-not-allowed opacity-30";
            if (value === "CONFLICT") return "cursor-pointer opacity-90";
            return "cursor-pointer";
        };

        const getBackgroundClass = (value) => {
            if (value === "PTO") return "bg-red-400";
            if (value === "Null") return "bg-slate-50";
            if (value === "CONFLICT") return "bg-amber-400 animate-pulse";
            return "";
        };

        return (
            <>
                {/* Sección / teamWork */}
                <div className="bg-white px-3 py-0 text-sm font-medium text-gray-800 border-r flex items-center">
                    <span className="truncate">{employee.teamWork}</span>
                </div>

                {/* Nombre del turno — sin botón modal, sin lastName */}
                <div className="bg-white px-3 py-0 text-sm text-gray-700 border-r flex items-center">
                    <span className="truncate">{employee.name}</span>
                </div>

                {/* Celdas de workShift */}
                {employee.workShift.map((value, hourIndex) => {
                    const disabled = isIndexDisabled(hourIndex) || value === "PTO";
                    const cellBgClass = disabled ? "bg-red-200/50" : "bg-white";
                    const isHourStart = hourIndex % 4 === 0;

                    return (
                        <div
                            key={hourIndex}
                            className={`${cellBgClass} flex items-center justify-center w-5 h-5 px-0 py-0 mx-0 my-1 relative`}
                            onMouseUp={handleMouseUp}
                        >
                            {/* Tick de hora en punto */}
                            {isHourStart && (
                                <div
                                    className="absolute w-[1px] bg-gray-200 z-10 pointer-events-none"
                                    style={{ left: "-0.5px", height: "30px" }}
                                />
                            )}

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
                                checked={value !== "Null" && value !== "PTO"}
                                onMouseDown={(e) => handleCellMouseDownWithLogic(hourIndex, e)}
                                onMouseEnter={() => handleMouseEnter(hourIndex)}
                                onChange={() => { }}
                                onKeyDown={(e) => {
                                    if (e.key === " " || e.key === "Enter") {
                                        e.preventDefault();
                                        toggleHour(hourIndex);
                                    } else {
                                        handleKeyDown(e, hourIndex);
                                    }
                                }}
                                disabled={disabled}
                                className={`
                                    w-5 h-5 m-0 p-0 appearance-none border-none
                                    ${getCursorClass(isIndexDisabled(hourIndex), value)}
                                    ${getBackgroundClass(value)}
                                    ${value === "WORK" ? "border-t-2 border-b-2 border-neutral-200" : ""}
                                    focus:ring-2 focus:ring-indigo-400
                                    mx-auto my-1
                                    shadow-sm
                                `}
                                style={value === "WORK" ? { backgroundColor: selectColor(employee.teamWork) } : {}}
                            />
                        </div>
                    );
                })}

                {/* Total horas */}
                <div className="bg-white px-3 py-0 text-sm font-medium text-gray-700 border-l text-center">
                    {totalHours.toFixed(2)}
                </div>
            </>
        );
    }
);

GenericEmployeeRow.displayName = "GenericEmployeeRow";