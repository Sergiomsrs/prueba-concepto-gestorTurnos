import { useState, useRef, useCallback, useEffect } from "react";

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
    const rafIdRef = useRef(null);
    const pendingRangeRef = useRef(null);
    const lastAppliedRangeRef = useRef(null);
    // Estado para el arrastre del ratón
    const [isSelecting, setIsSelecting] = useState(false);
    // Índice donde empezó el arrastre
    const startSelectionIndexRef = useRef(null);
    // Valor (true/false) que se está aplicando en el arrastre
    const baseValueRef = useRef(null);
    // Último índice enfocado para la selección con Shift
    const lastFocusedIndexRef = useRef(null); // ✅ Usar ref para evitar dependencia excesiva

    const flushPendingRange = useCallback(() => {
        const pending = pendingRangeRef.current;
        if (!pending) return;

        const lastApplied = lastAppliedRangeRef.current;
        const isSameRange =
            lastApplied &&
            lastApplied.dayIndex === pending.dayIndex &&
            lastApplied.employeeIndex === pending.employeeIndex &&
            lastApplied.startIndex === pending.startIndex &&
            lastApplied.endIndex === pending.endIndex &&
            lastApplied.value === pending.value;

        if (isSameRange) return;

        dispatch({
            type: "UPDATE_SHIFT_RANGE",
            payload: pending,
        });

        lastAppliedRangeRef.current = pending;
    }, [dispatch]);

    // ✅ NUEVO: Limpieza global para el mouse, más simple y basado en isSelecting
    useEffect(() => {
        if (!isSelecting) return;

        // Función para finalizar cualquier arrastre
        const handleGlobalMouseStop = () => {
            if (rafIdRef.current !== null) {
                cancelAnimationFrame(rafIdRef.current);
                rafIdRef.current = null;
            }
            flushPendingRange();

            setIsSelecting(false);
            startSelectionIndexRef.current = null;
            baseValueRef.current = null;
            pendingRangeRef.current = null;
            lastAppliedRangeRef.current = null;
        };

        // Escucha en el documento para terminar el arrastre fuera de la celda
        document.addEventListener('mouseup', handleGlobalMouseStop);
        document.addEventListener('mouseleave', handleGlobalMouseStop);

        return () => {
            document.removeEventListener('mouseup', handleGlobalMouseStop);
            document.removeEventListener('mouseleave', handleGlobalMouseStop);
        };
    }, [isSelecting, flushPendingRange]);

    // 🖱️ MOUSE HANDLERS
    const handleMouseDown = useCallback(
        (index) => {
            // El valor a aplicar en el arrastre (true para 'WORK', false para 'Null')
            const currentValue = employee.workShift[index];
            const newValue = currentValue !== "WORK";

            // Iniciar el arrastre
            setIsSelecting(true);
            startSelectionIndexRef.current = index;
            baseValueRef.current = newValue;
            pendingRangeRef.current = null;
            lastAppliedRangeRef.current = null;

            // La celda inicial debe ser actualizada inmediatamente
            dispatch({
                type: "UPDATE_SHIFT_FIXED",
                payload: { dayIndex, employeeIndex, hourIndex: index, value: newValue },
            });

        },
        [dispatch, dayIndex, employeeIndex, employee.workShift]
    );

    const handleMouseEnter = useCallback(
        (index) => {
            // Solo si estamos en modo arrastre y tenemos un punto de partida
            if (!isSelecting || startSelectionIndexRef.current === null) return;

            const start = Math.min(startSelectionIndexRef.current, index);
            const end = Math.max(startSelectionIndexRef.current, index);

            pendingRangeRef.current = {
                dayIndex,
                employeeIndex,
                startIndex: start,
                endIndex: end,
                value: baseValueRef.current,
            };

            if (rafIdRef.current === null) {
                rafIdRef.current = requestAnimationFrame(() => {
                    rafIdRef.current = null;
                    flushPendingRange();
                });
            }
        },
        [isSelecting, dayIndex, employeeIndex, flushPendingRange]
    );

    const handleMouseUp = useCallback(() => {
        if (rafIdRef.current !== null) {
            cancelAnimationFrame(rafIdRef.current);
            rafIdRef.current = null;
        }
        flushPendingRange();

        setIsSelecting(false);
        startSelectionIndexRef.current = null;
        baseValueRef.current = null;
        pendingRangeRef.current = null;
        lastAppliedRangeRef.current = null;
    }, [flushPendingRange]);

    // 🎹 TECLADO HANDLER
    const handleKeyDown = useCallback(
        (event, colIndex) => {
            const { key, shiftKey } = event;

            // Actualizar el índice enfocado para la selección Shift+Flecha
            if (key !== "Shift") {
                lastFocusedIndexRef.current = colIndex;
            }

            const moveFocus = (newDay, newRow, newCol) => {
                const el = inputRefsMatrix.current?.[newDay]?.[newRow]?.[newCol];
                if (el) el.focus();
            };

            // --- SHIFT + Flechas (selección múltiple)
            if (shiftKey && (key === "ArrowRight" || key === "ArrowLeft")) {
                const direction = key === "ArrowRight" ? 1 : -1;
                const newIndex = colIndex + direction;
                const startSelection = lastFocusedIndexRef.current; // Usar el índice donde se inició la selección

                event.preventDefault(); // ✅ Prevenir el movimiento normal del foco

                if (newIndex >= 0 && newIndex < employee.workShift.length && startSelection !== null) {

                    // Mover el foco a la nueva celda
                    inputRefs.current[newIndex]?.focus();

                    // Determinar el valor base a aplicar (el valor de la celda donde se *inició* la selección)
                    const initialValue = employee.workShift[startSelection] === "WORK";
                    const startRange = Math.min(startSelection, newIndex);
                    const endRange = Math.max(startSelection, newIndex);

                    dispatch({
                        type: "UPDATE_SHIFT_RANGE",
                        payload: {
                            dayIndex,
                            employeeIndex,
                            startIndex: startRange,
                            endIndex: endRange,
                            value: initialValue,
                        },
                    });
                }
            }

            // --- Navegación normal (sin Shift)
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