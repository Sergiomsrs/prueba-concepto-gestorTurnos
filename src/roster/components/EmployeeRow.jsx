import { memo, useMemo, useRef, useCallback, useContext } from "react";
import { useEmployeeInteractions } from "../hooks/useEmployeeInteractions";
import { selectColor } from "../../utils/function";
import { getVisibleRange, relativeToAbsoluteIndex } from "../../utils/rangeCalculator";
import { AppContext } from "../../context/AppContext";

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
        const { filters } = useContext(AppContext);

        // ✅ Cachear el rango visible (con valores por defecto)
        const rangeConfig = useMemo(() => {
            const displayRange = filters?.displayHourRange ?? { startHour: 7, endHour: 22.5 };
            return getVisibleRange(displayRange.startHour, displayRange.endHour);
        }, [filters?.displayHourRange?.startHour, filters?.displayHourRange?.endHour]);
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

        const disabledRange = useMemo(() => {
            if (!previousEmployee?.workShift) return null;

            const highestIndex = getHighestNonZeroIndex(previousEmployee.workShift);
            if (highestIndex < 48) return null;

            // Caso especial: continuidad de turno en medianoche (00:00 -> 00:00).
            // Si el empleado sigue marcando al inicio del dia, desplazamos la ventana
            // para mantener siempre 12h de descanso desde la ultima marca consecutiva.
            if (highestIndex === 95) {
                const currentShift = employee?.workShift ?? [];
                let lastConsecutiveStartIndex = -1;

                for (let i = 0; i < currentShift.length; i++) {
                    if (currentShift[i] !== "WORK") break;
                    lastConsecutiveStartIndex = i;
                }

                if (lastConsecutiveStartIndex === -1) {
                    // Estado inicial: dejamos libres los 2 primeros inputs.
                    return { start: 2, end: 47 };
                }

                // Dejamos libre el siguiente slot inmediato para poder extender
                // el turno continuo desde el inicio del dia.
                const start = Math.min(lastConsecutiveStartIndex + 2, 95);
                const end = Math.min(lastConsecutiveStartIndex + 48, 95);
                if (start > end) return null;
                return { start, end };
            }

            return { start: 0, end: highestIndex - 48 };
        }, [previousEmployee?.workShift, employee?.workShift]);

        const isIndexDisabled = (index) =>
            !!disabledRange && index >= disabledRange.start && index <= disabledRange.end;

        const totalHours = useMemo(
            () => (employee.workShift.filter((w) => w === "WORK").length * 15) / 60,
            [employee.workShift]
        );

        const hourLabelsByIndex = useMemo(() => {
            const labels = new Map();
            const shift = employee.workShift || [];
            let start = null;

            const indexToTime = (index) => {
                const totalMinutes = index * 15;
                const hh = Math.floor(totalMinutes / 60);
                const mm = totalMinutes % 60;
                return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
            };

            for (let i = 0; i < shift.length; i++) {
                const isWork = shift[i] === "WORK";
                if (isWork && start === null) start = i;

                const closesSegment =
                    start !== null && (!isWork || i === shift.length - 1);

                if (closesSegment) {
                    const end = isWork ? i : i - 1;
                    const segmentLength = end - start + 1;

                    if (segmentLength >= 3) {
                        labels.set(start, { type: "start", text: indexToTime(start) });
                        labels.set(end, { type: "end", text: indexToTime(end + 1) });
                    }
                    start = null;
                }
            }

            return labels;
        }, [employee.workShift]);

        const toggleHour = useCallback((hourIndex) => {
            const currentValue = employee.workShift[hourIndex];

            if (currentValue === "PTO" || isIndexDisabled(hourIndex)) {
                return;
            }

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
            if (isDisabled || value === "PTO") return 'cursor-not-allowed opacity-30';
            if (value === "CONFLICT") return 'cursor-pointer opacity-90';
            return 'cursor-pointer';
        };

        const getBackgroundClass = (value, team) => {
            if (value === "PTO") return 'bg-red-400';
            if (value === "Null") return 'bg-slate-50';
            if (value === "CONFLICT") return 'bg-amber-400 animate-pulse';
            return ''; // WORK: el color va por style
        };

        const outOfRangeIndicator = useMemo(() => {
            const shift = employee.workShift;
            const { startIndex, endIndex } = rangeConfig; // los índices absolutos del rango visible

            const hasBefore = shift.slice(0, startIndex).some(v => v === "WORK");
            const hasAfter = shift.slice(endIndex + 1).some(v => v === "WORK");

            return { hasBefore, hasAfter };
        }, [employee.workShift, rangeConfig.startIndex, rangeConfig.endIndex]);

        return (
            <>
                {/* Elementos de Nombre y Equipo */}
                <div className={`bg-white px-3 py-0 text-sm font-medium text-gray-800 border-r flex items-center

`}>
                    <span className="truncate">{employee.teamWork}</span>
                </div>
                <div className={`bg-white px-3 py-0 text-sm text-gray-700 flex items-center overflow-visible
    ${outOfRangeIndicator.hasBefore ? 'relative before:absolute before:z-10 before:right-[-2px] before:top-0 before:h-full before:w-[2px] before:bg-amber-400 before:content-[""]' : ''}
`}>
                    <span className="truncate">
                        {employee.name} {employee.lastName}
                    </span>
                </div>


                {/* ✅ RENDEREAR SOLO RANGO VISIBLE - Sin crear nuevo array */}
                {Array.from(
                    { length: rangeConfig.visibleSlots },
                    (_, relativeIndex) => {
                        const hourIndex = relativeToAbsoluteIndex(relativeIndex, rangeConfig.startIndex);
                        const value = employee.workShift[hourIndex];

                        const disabled = isIndexDisabled(hourIndex) || value === "PTO";
                        const cellBgClass = disabled ? "bg-red-200/50" : "bg-white";
                        const isHourStart = hourIndex % 4 === 0;
                        const hourLabel = hourLabelsByIndex.get(hourIndex);

                        return (
                            <div
                                key={hourIndex}
                                className={`${cellBgClass} flex items-center justify-center w-5 h-5 px-0 py-0 mx-0 my-1 relative`}
                                onMouseUp={handleMouseUp}
                            >
                                {/* Línea extendida hacia arriba para horas en punto */}
                                {isHourStart && (
                                    <div
                                        className="absolute w-[1px] bg-gray-200 z-10 pointer-events-none"
                                        style={{
                                            left: '0px',
                                            height: '30px',
                                        }}
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
                                        mx-auto my-1
                                        shadow-sm
                                    `}
                                    style={value === "WORK" ? { backgroundColor: selectColor(employee.teamWork) } : {}}
                                />

                                {hourLabel && (
                                    <span
                                        className={`
            absolute z-20 bottom-0 text-[9px] font-semibold leading-none
            pointer-events-none select-none
            px-0.5 rounded-sm
            ${hourLabel.type === "start" ? "left-0" : "right-0"}
          `}
                                        style={{
                                            background: 'rgba(0,0,0,0.28)',
                                            color: 'white',
                                            backdropFilter: 'blur(2px)',
                                            lineHeight: '12px',
                                        }}
                                    >
                                        {hourLabel.text}
                                    </span>
                                )}
                            </div>
                        );
                    }
                )}

                {/* Elemento de Horas Totales */}
                <div className={`bg-white px-3 py-0 text-sm font-medium text-gray-700 border-l text-center
    ${outOfRangeIndicator.hasAfter ? 'relative before:absolute before:left-[-2px] before:top-0 before:h-full before:w-[2px] before:bg-amber-400' : ''}
`}>
                    {totalHours.toFixed(2)}
                </div>
            </>
        );
    },
    // ✅ Comparación personalizada: re-renderear si employee o previousEmployee cambian
    // (filters se lee del contexto, no es una prop)
    (prevProps, nextProps) => {
        return (
            prevProps.employee === nextProps.employee &&
            prevProps.previousEmployee === nextProps.previousEmployee &&
            prevProps.dayIndex === nextProps.dayIndex &&
            prevProps.employeeIndex === nextProps.employeeIndex
        );
    }
);

EmployeeRow.displayName = 'EmployeeRow';