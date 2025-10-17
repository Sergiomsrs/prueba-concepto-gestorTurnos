import { useState, useCallback } from "react";

export const useEmployeeInteractions = ({
    employee,
    dayIndex,
    employeeIndex,
    dispatch,
    numRows,
    numDays,
    inputRefsMatrix,
}) => {
    const [isSelecting, setIsSelecting] = useState(false);
    const [startSelection, setStartSelection] = useState(null);
    const [baseValue, setBaseValue] = useState(null);

    const [keyboardSelecting, setKeyboardSelecting] = useState(false);
    const [selectionStart, setSelectionStart] = useState(null);
    const [keyboardBaseValue, setKeyboardBaseValue] = useState(null);

    // 🖱️ Ratón: iniciar selección
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

    // 🖱️ Ratón: arrastrar
    const handleMouseEnter = useCallback(
        (index) => {
            if (!isSelecting || startSelection === null) return;

            const start = Math.min(startSelection, index);
            const end = Math.max(startSelection, index);

            dispatch({
                type: "UPDATE_SHIFT_RANGE",
                payload: { dayIndex, employeeIndex, startIndex: start, endIndex: end, value: baseValue },
            });
        },
        [isSelecting, startSelection, baseValue, dayIndex, employeeIndex, dispatch]
    );

    const handleMouseUp = useCallback(() => {
        setIsSelecting(false);
        setStartSelection(null);
    }, []);

    // 🎹 Teclado
    const handleKeyDown = useCallback(
        (event, colIndex) => {
            const { key, shiftKey } = event;

            const moveFocus = (newDay, newRow, newCol) => {
                const el = inputRefsMatrix.current?.[newDay]?.[newRow]?.[newCol];
                if (el) el.focus();
            };

            // ⇧ Shift + Flechas → selección
            if (shiftKey && (key === "ArrowRight" || key === "ArrowLeft")) {
                event.preventDefault();

                if (!keyboardSelecting) {
                    setKeyboardSelecting(true);
                    setSelectionStart(colIndex);

                    const initialBaseValue = employee.workShift[colIndex] === "WORK";
                    setKeyboardBaseValue(initialBaseValue);

                    dispatch({
                        type: "UPDATE_SHIFT_FIXED",
                        payload: { dayIndex, employeeIndex, hourIndex: colIndex, value: initialBaseValue },
                    });
                }

                const direction = key === "ArrowRight" ? 1 : -1;
                const newIndex = colIndex + direction;

                if (newIndex >= 0 && newIndex < employee.workShift.length) {
                    const start = Math.min(selectionStart ?? colIndex, newIndex);
                    const end = Math.max(selectionStart ?? colIndex, newIndex);

                    dispatch({
                        type: "UPDATE_SHIFT_RANGE",
                        payload: { dayIndex, employeeIndex, startIndex: start, endIndex: end, value: keyboardBaseValue },
                    });

                    inputRefsMatrix.current[dayIndex][employeeIndex][newIndex]?.focus();
                }
            } else {
                // Flechas normales
                if (keyboardSelecting) {
                    setKeyboardSelecting(false);
                    setSelectionStart(null);
                    setKeyboardBaseValue(null);
                }

                if (key === "ArrowRight" && colIndex < employee.workShift.length - 1) {
                    inputRefsMatrix.current[dayIndex][employeeIndex][colIndex + 1]?.focus();
                    event.preventDefault();
                } else if (key === "ArrowLeft" && colIndex > 0) {
                    inputRefsMatrix.current[dayIndex][employeeIndex][colIndex - 1]?.focus();
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
            keyboardSelecting,
            selectionStart,
            keyboardBaseValue,
        ]
    );

    return {
        handleMouseDown,
        handleMouseEnter,
        handleMouseUp,
        handleKeyDown,
    };
};
