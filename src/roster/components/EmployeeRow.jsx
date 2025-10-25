import { memo, useMemo, useRef, useCallback } from "react"; // ✅ Agregar useCallback
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

        // Función para manejar el toggle con casos especiales 
        const toggleHour = useCallback((hourIndex) => {
            const currentValue = employee.workShift[hourIndex];

            // No permitir toggle en PTO o disabled
            if (currentValue === "PTO" || isIndexDisabled(hourIndex)) {
                return;
            }

            dispatch({
                type: "UPDATE_SHIFT",
                payload: { dayIndex, employeeIndex, hourIndex },
            });
        }, [employee.workShift, isIndexDisabled, dispatch, dayIndex, employeeIndex]);


        // Manejo de onMouseDown unificado y más limpio
        const handleCellMouseDownWithLogic = useCallback((hourIndex, event) => {
            const currentValue = employee.workShift[hourIndex];

            // Si es PTO o Disabled: prevenir todo y salir.
            if (currentValue === "PTO" || isIndexDisabled(hourIndex)) {
                event.preventDefault();
                event.stopPropagation();
                return;
            }

            // Si es CONFLICT: hacer el toggle (convierte a PTO) y salir. NO iniciar arrastre.
            if (currentValue === "CONFLICT") {
                event.preventDefault();
                event.stopPropagation();
                toggleHour(hourIndex); // Usa toggleHour para el dispatch de CONFLICT -> PTO
                return;
            }

            // Para WORK y Null: iniciar arrastre.
            // La función handleMouseDown del hook se encarga del primer dispatch.
            handleMouseDown(hourIndex);
        }, [employee.workShift, isIndexDisabled, toggleHour, handleMouseDown]);

        const getCursorClass = (isDisabled, value) => {
            if (isDisabled || value === "PTO") return 'cursor-not-allowed opacity-30';
            if (value === "CONFLICT") return 'cursor-pointer opacity-90';
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
                {/* ... Elementos de Nombre y Equipo ... */}
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
                    const cellBgClass = disabled ? "bg-red-200" : "bg-white";

                    return (
                        <div
                            key={hourIndex}
                            className={`${cellBgClass} flex items-center justify-center w-5 h-5 px-0 py-0 mx-0 my-1`}
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
                                onMouseDown={(e) => handleCellMouseDownWithLogic(hourIndex, e)}
                                onMouseEnter={() => {
                                    handleMouseEnter(hourIndex);
                                }}
                                onChange={() => { /* NOOP */ }}
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

                {/* ... Elemento de Horas Totales ... */}
                <div className="bg-white px-3 py-0 text-sm font-medium text-gray-700 border-l text-center">
                    {totalHours.toFixed(2)}
                </div>
            </>
        );
    }
);