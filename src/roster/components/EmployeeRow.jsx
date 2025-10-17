import { memo, useRef, useState, useCallback, useMemo } from "react";

export const EmployeeRow = memo(({
    employee,
    dayIndex,
    employeeIndex,
    dispatch,
    numRows,
    numDays,
    inputRefsMatrix,
}) => {
    // [Estados y Refs sin cambios]
    const inputRefs = useRef([]);
    const [isSelecting, setIsSelecting] = useState(false);
    const [startSelection, setStartSelection] = useState(null);
    const [baseValue, setBaseValue] = useState(null);
    const [keyboardSelecting, setKeyboardSelecting] = useState(false);
    const [selectionStart, setSelectionStart] = useState(null);
    const [keyboardBaseValue, setKeyboardBaseValue] = useState(null);
    const [lastFocusedIndex, setLastFocusedIndex] = useState(null);

    // [handleMouseDown, handleMouseEnter, handleMouseUp sin cambios, ya que son correctos]
    const handleMouseDown = useCallback((index) => {
        const currentValue = employee.workShift[index];
        const newValue = currentValue !== "WORK";

        setIsSelecting(true);
        setStartSelection(index);
        setBaseValue(newValue);

        dispatch({
            type: "UPDATE_SHIFT",
            payload: { dayIndex, employeeIndex, hourIndex: index },
        });
    }, [dispatch, dayIndex, employeeIndex, employee.workShift]);

    const handleMouseEnter = useCallback((index) => {
        if (!isSelecting || startSelection === null) return;
        const start = Math.min(startSelection, index);
        const end = Math.max(startSelection, index);

        dispatch({
            type: "UPDATE_SHIFT_RANGE",
            payload: { dayIndex, employeeIndex, startIndex: start, endIndex: end, value: baseValue },
        });
    }, [isSelecting, startSelection, baseValue, dayIndex, employeeIndex, dispatch]);

    const handleMouseUp = useCallback(() => {
        setIsSelecting(false);
        setStartSelection(null);
    }, []);

    // 🎹 Navegación por teclado
    const handleKeyDown = useCallback((event, colIndex) => {
        const { key, shiftKey } = event;

        // ✅ SIEMPRE actualizar el último índice enfocado
        setLastFocusedIndex(colIndex);

        const moveFocus = (newDay, newRow, newCol) => {
            const el = inputRefsMatrix.current?.[newDay]?.[newRow]?.[newCol];
            if (el) el.focus();
        };

        // --- Shift + Flechas (Selección) ---
        if (shiftKey && (key === "ArrowRight" || key === "ArrowLeft")) {
            const direction = key === "ArrowRight" ? 1 : -1;
            const newIndex = colIndex + direction;

            if (newIndex >= 0 && newIndex < employee.workShift.length) {
                // ✅ Mover el foco PRIMERO
                inputRefs.current[newIndex]?.focus();
                event.preventDefault();

                // ✅ Si hay un índice previo (lastFocusedIndex), hacer selección
                if (lastFocusedIndex !== null) {
                    const start = Math.min(lastFocusedIndex, newIndex);
                    const end = Math.max(lastFocusedIndex, newIndex);

                    // ✅ Usar el valor de la celda ACTUAL (donde empezó)
                    const baseValue = employee.workShift[colIndex] === "WORK";

                    // ✅ Aplicar a todo el rango
                    dispatch({
                        type: "UPDATE_SHIFT_RANGE",
                        payload: {
                            dayIndex,
                            employeeIndex,
                            startIndex: start,
                            endIndex: end,
                            value: baseValue // ✅ El valor de donde empezó
                        },
                    });
                }
            }
        }

        // --- Navegación normal (Sin Shift) ---
        else {
            if (key === "ArrowRight" && colIndex < employee.workShift.length - 1) {
                inputRefs.current[colIndex + 1]?.focus();
                event.preventDefault();
            }
            else if (key === "ArrowLeft" && colIndex > 0) {
                inputRefs.current[colIndex - 1]?.focus();
                event.preventDefault();
            }
            else if (key === "ArrowDown") {
                if (employeeIndex < numRows - 1) {
                    moveFocus(dayIndex, employeeIndex + 1, colIndex);
                } else if (dayIndex < numDays - 1) {
                    moveFocus(dayIndex + 1, 0, colIndex);
                }
                event.preventDefault();
            }
            else if (key === "ArrowUp") {
                if (employeeIndex > 0) {
                    moveFocus(dayIndex, employeeIndex - 1, colIndex);
                } else if (dayIndex > 0) {
                    moveFocus(dayIndex - 1, numRows - 1, colIndex);
                }
                event.preventDefault();
            }
            else if (key === " " || key === "Enter") {
                dispatch({
                    type: "UPDATE_SHIFT",
                    payload: { dayIndex, employeeIndex, hourIndex: colIndex },
                });
                event.preventDefault();
            }
        }

    }, [dispatch, dayIndex, employeeIndex, employee.workShift, numRows, numDays, inputRefsMatrix, lastFocusedIndex]);

    // [totalHours y JSX de renderizado sin cambios]
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