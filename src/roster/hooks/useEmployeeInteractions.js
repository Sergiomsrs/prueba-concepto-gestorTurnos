import { useState, useRef, useCallback } from "react";

export const useEmployeeInteractions = ({
    employee,
    dayIndex,
    employeeIndex,
    numRows,
    numDays,
    dispatch,
    inputRefsMatrix,
}) => {
    const inputRefs = useRef([]);
    const [isSelecting, setIsSelecting] = useState(false);
    const [startSelection, setStartSelection] = useState(null);
    const [baseValue, setBaseValue] = useState(null);
    const [lastFocusedIndex, setLastFocusedIndex] = useState(null);

    // 🖱️ MOUSE HANDLERS
    const handleMouseDown = useCallback(
        (index) => {
            const currentValue = employee.workShift[index];
            const newValue = currentValue !== "WORK";

            setIsSelecting(true);
            setStartSelection(index);
            setBaseValue(newValue);

            dispatch({
                type: "UPDATE_SHIFT",
                payload: { dayIndex, employeeIndex, hourIndex: index },
            });
        },
        [dispatch, dayIndex, employeeIndex, employee.workShift]
    );

    const handleMouseEnter = useCallback(
        (index) => {
            if (!isSelecting || startSelection === null) return;
            const start = Math.min(startSelection, index);
            const end = Math.max(startSelection, index);

            dispatch({
                type: "UPDATE_SHIFT_RANGE",
                payload: {
                    dayIndex,
                    employeeIndex,
                    startIndex: start,
                    endIndex: end,
                    value: baseValue,
                },
            });
        },
        [isSelecting, startSelection, baseValue, dayIndex, employeeIndex, dispatch]
    );

    const handleMouseUp = useCallback(() => {
        setIsSelecting(false);
        setStartSelection(null);
    }, []);

    // 🎹 TECLADO HANDLER
    const handleKeyDown = useCallback(
        (event, colIndex) => {
            const { key, shiftKey } = event;
            setLastFocusedIndex(colIndex);

            const moveFocus = (newDay, newRow, newCol) => {
                const el = inputRefsMatrix.current?.[newDay]?.[newRow]?.[newCol];
                if (el) el.focus();
            };

            // --- SHIFT + Flechas (selección múltiple)
            if (shiftKey && (key === "ArrowRight" || key === "ArrowLeft")) {
                const direction = key === "ArrowRight" ? 1 : -1;
                const newIndex = colIndex + direction;

                if (newIndex >= 0 && newIndex < employee.workShift.length) {
                    inputRefs.current[newIndex]?.focus();
                    event.preventDefault();

                    if (lastFocusedIndex !== null) {
                        const start = Math.min(lastFocusedIndex, newIndex);
                        const end = Math.max(lastFocusedIndex, newIndex);
                        const baseValue = employee.workShift[colIndex] === "WORK";

                        dispatch({
                            type: "UPDATE_SHIFT_RANGE",
                            payload: {
                                dayIndex,
                                employeeIndex,
                                startIndex: start,
                                endIndex: end,
                                value: baseValue,
                            },
                        });
                    }
                }
            }

            // --- Navegación normal
            else {
                if (key === "ArrowRight" && colIndex < employee.workShift.length - 1) {
                    inputRefs.current[colIndex + 1]?.focus();
                    event.preventDefault();
                } else if (key === "ArrowLeft" && colIndex > 0) {
                    inputRefs.current[colIndex - 1]?.focus();
                    event.preventDefault();
                } else if (key === "ArrowDown") {
                    if (employeeIndex < numRows - 1) {
                        moveFocus(dayIndex, employeeIndex + 1, colIndex);
                    } else if (dayIndex < numDays - 1) {
                        moveFocus(dayIndex + 1, 0, colIndex);
                    }
                    event.preventDefault();
                } else if (key === "ArrowUp") {
                    if (employeeIndex > 0) {
                        moveFocus(dayIndex, employeeIndex - 1, colIndex);
                    } else if (dayIndex > 0) {
                        moveFocus(dayIndex - 1, numRows - 1, colIndex);
                    }
                    event.preventDefault();
                } else if (key === " " || key === "Enter") {
                    dispatch({
                        type: "UPDATE_SHIFT",
                        payload: { dayIndex, employeeIndex, hourIndex: colIndex },
                    });
                    event.preventDefault();
                }
            }
        },
        [
            dispatch,
            dayIndex,
            employeeIndex,
            employee.workShift,
            numRows,
            numDays,
            inputRefsMatrix,
            lastFocusedIndex,
        ]
    );

    return {
        inputRefs,
        handleMouseDown,
        handleMouseEnter,
        handleMouseUp,
        handleKeyDown,
    };
};
