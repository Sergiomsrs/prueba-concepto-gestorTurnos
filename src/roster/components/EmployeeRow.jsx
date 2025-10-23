import { memo, useMemo, useRef } from "react";
import { useEmployeeInteractions } from "../hooks/useEmployeeInteractions";
import { selectColor } from "../../utils/function";

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

        // ✅ Nueva función para manejar click con casos especiales
        const handleCellClick = (hourIndex, event) => {
            const currentValue = employee.workShift[hourIndex];

            // ✅ Si es PTO, no hacer nada
            if (currentValue === "PTO") {
                event.preventDefault();
                event.stopPropagation();
                return;
            }

            // ✅ Si está disabled por límite, no hacer nada
            if (isIndexDisabled(hourIndex)) {
                event.preventDefault();
                event.stopPropagation();
                return;
            }

            // Para todos los casos (incluyendo CONFLICT), hacer dispatch
            dispatch({
                type: "UPDATE_SHIFT",
                payload: { dayIndex, employeeIndex, hourIndex },
            });
        };

        // ✅ Nueva función para manejar mouseDown con casos especiales
        const handleCellMouseDown = (hourIndex, event) => {
            const currentValue = employee.workShift[hourIndex];

            // ✅ Si es PTO, no permitir arrastre
            if (currentValue === "PTO") {
                event.preventDefault();
                event.stopPropagation();
                return;
            }

            // ✅ Si está disabled por límite, no permitir arrastre
            if (isIndexDisabled(hourIndex)) {
                event.preventDefault();
                event.stopPropagation();
                return;
            }

            // ✅ Si es CONFLICT, hacer el cambio pero NO iniciar arrastre
            if (currentValue === "CONFLICT") {
                event.preventDefault();
                event.stopPropagation();
                dispatch({
                    type: "UPDATE_SHIFT",
                    payload: { dayIndex, employeeIndex, hourIndex },
                });
                return; // ✅ Salir sin iniciar arrastre
            }

            // Para WORK y Null, continuar con arrastre normal
            clickLockRef.current = true;
            handleMouseDown(hourIndex);
        };

        const toggleHour = (hourIndex) => {
            const currentValue = employee.workShift[hourIndex];

            // ✅ No permitir toggle en PTO o disabled
            if (currentValue === "PTO" || isIndexDisabled(hourIndex)) {
                return;
            }

            dispatch({
                type: "UPDATE_SHIFT",
                payload: { dayIndex, employeeIndex, hourIndex },
            });
        };

        const getCursorClass = (isDisabled, value) => {
            if (isDisabled || value === "PTO") return 'cursor-not-allowed opacity-30';
            if (value === "CONFLICT") return 'cursor-pointer opacity-90'; // ✅ Diferente para CONFLICT
            return 'cursor-pointer';
        };

        const getBackgroundClass = (value, team) => {
            if (value === "PTO") return 'bg-red-200';
            if (value === "Null") return 'bg-neutral-100';
            if (value === "CONFLICT") return 'bg-amber-500 animate-pulse';
            return selectColor(team);
        };

        return (
            <>
                <div className="bg-white px-3 py-0 text-sm font-medium text-gray-800 border-r flex items-center">
                    <span className="truncate">{employee.teamWork}</span>
                </div>
                <div className="bg-white px-3 py-0 text-sm text-gray-700 border-r flex items-center">
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
                            className={`${cellBgClass} flex items-center justify-center w-5 h-5 px-0 py-0 mx-0 my-1`}
                            onMouseEnter={() => {
                                // ✅ Solo permitir mouse enter si no es PTO o CONFLICT
                                if (value !== "PTO" && value !== "CONFLICT") {
                                    handleMouseEnter(hourIndex);
                                }
                            }}
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
                                checked={value !== "Null" && value !== "PTO"}
                                onMouseDown={(e) => handleCellMouseDown(hourIndex, e)}
                                onChange={(e) => {
                                    // ✅ Solo permitir cambio si NO viene del click del mouseDown
                                    if (clickLockRef.current) {
                                        clickLockRef.current = false;
                                        return;
                                    }
                                    handleCellClick(hourIndex, e);
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
                                className={`
                w-5 h-5 m-0 p-0 appearance-none border-none
                ${getCursorClass(isIndexDisabled(hourIndex), value)}
                ${getBackgroundClass(value, employee.teamWork)}
                ${value === "WORK" ? 'border-t-2 border-b-2 border-neutral-200' : ''}
                focus:ring-2 focus:ring-indigo-400
                transition-all duration-150
                mx-auto my-1
                shadow-sm
              `}
                            />
                        </div>
                    );
                })}

                <div className="bg-white px-3 py-0 text-sm font-medium text-gray-700 border-l text-center">
                    {totalHours.toFixed(2)}
                </div>
            </>
        );
    }
);
